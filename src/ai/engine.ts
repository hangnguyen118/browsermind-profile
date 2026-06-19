import type {
  TextGenerationPipeline,
  ProgressInfo,
} from '@huggingface/transformers';
import type { ChatMessage, ModelProgress } from '../types';

/**
 * Transformers.js wrapper that loads Qwen2.5-0.5B-Instruct (ONNX) and generates
 * chat completions fully in the browser. Uses WebGPU when available, falling
 * back to WASM (CPU) otherwise (SPEC §12).
 *
 * The library is loaded via dynamic import() so its (large) code stays in a
 * separate chunk and out of the initial bundle (SPEC §8.4).
 */

// Pre-converted ONNX model on the HuggingFace CDN (SPEC §2 note).
const MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct';

type ProgressCallback = (progress: ModelProgress) => void;

let generatorPromise: Promise<TextGenerationPipeline> | null = null;

/** Lazily load the Transformers.js module (code-split). */
function lib() {
  return import('@huggingface/transformers');
}

/** True if the browser exposes a WebGPU adapter we can request. */
async function hasWebGPU(): Promise<boolean> {
  try {
    const gpu = (
      navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }
    ).gpu;
    if (!gpu) return false;
    const adapter = await gpu.requestAdapter();
    return adapter != null;
  } catch {
    return false;
  }
}

function toProgress(info: ProgressInfo): ModelProgress | null {
  // We only surface download/progress phases to the UI.
  if (info.status === 'progress') {
    const file = 'file' in info && info.file ? info.file : 'model';
    const pct =
      'progress' in info && typeof info.progress === 'number'
        ? Math.round(info.progress)
        : null;
    return { label: file, percent: pct };
  }
  if (info.status === 'initiate') {
    const file = 'file' in info && info.file ? info.file : 'model';
    return { label: file, percent: 0 };
  }
  return null;
}

/**
 * Load (or return the cached) text-generation pipeline. The underlying model
 * shards are cached in the browser (IndexedDB / Cache Storage) by
 * Transformers.js, so subsequent loads are fast and offline-capable.
 */
export async function loadEngine(
  onProgress?: ProgressCallback,
): Promise<TextGenerationPipeline> {
  if (generatorPromise) return generatorPromise;

  generatorPromise = (async () => {
    const { pipeline } = await lib();
    const webgpu = await hasWebGPU();
    const device = webgpu ? 'webgpu' : 'wasm';
    // Use q4 (int4 weights, fp32 activations) on both devices. The q4f16
    // variant is faster but its fp16 activations are numerically unstable for
    // the tiny Qwen2.5-0.5B model on many GPUs (Intel/AMD integrated), where it
    // emits garbage tokens. q4 keeps the download size and quality, just stable.
    const dtype = 'q4';

    // Cast to a simpler signature: the union of pipeline() overloads is too
    // complex for TS to represent (TS2590) when resolved generically.
    const createPipeline = pipeline as unknown as (
      task: string,
      model: string,
      options: Record<string, unknown>,
    ) => Promise<TextGenerationPipeline>;

    const generator = await createPipeline('text-generation', MODEL_ID, {
      device,
      dtype,
      progress_callback: (info: ProgressInfo) => {
        const p = toProgress(info);
        if (p && onProgress) onProgress(p);
      },
    });

    return generator;
  })();

  try {
    return await generatorPromise;
  } catch (err) {
    // Reset so a later retry can attempt loading again.
    generatorPromise = null;
    throw err;
  }
}

/** Whether the engine has finished loading at least once. */
export function isEngineReady(): boolean {
  return generatorPromise != null;
}

export interface GenerateOptions {
  /** Full message list (already includes the system prompt). */
  messages: Pick<ChatMessage, 'role' | 'content'>[];
  /** Called with each new token chunk as it's produced. */
  onToken?: (chunk: string) => void;
  maxNewTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

/**
 * Generate an assistant reply. Streams tokens through `onToken` and resolves
 * with the full text.
 */
export async function generate(options: GenerateOptions): Promise<string> {
  const {
    messages,
    onToken,
    maxNewTokens = 512,
    temperature = 0.7,
    signal,
  } = options;

  const { TextStreamer } = await lib();
  const generator = await loadEngine();

  const streamer = onToken
    ? new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (text: string) => onToken(text),
      })
    : undefined;

  const output = (await generator(messages as unknown as string, {
    max_new_tokens: maxNewTokens,
    temperature,
    do_sample: temperature > 0,
    top_p: 0.9,
    repetition_penalty: 1.1,
    return_full_text: false,
    streamer,
    // @ts-expect-error - newer transformers.js supports AbortSignal for stopping.
    signal,
  })) as Array<{ generated_text: unknown }>;

  // When messages are passed, generated_text is the appended assistant turn.
  const last = output?.[0]?.generated_text;
  if (Array.isArray(last)) {
    const tail = last[last.length - 1] as { content?: string } | undefined;
    return (tail?.content ?? '').trim();
  }
  return typeof last === 'string' ? last.trim() : '';
}
