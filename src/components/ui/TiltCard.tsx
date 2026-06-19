import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'framer-motion';
import { cn } from '../../lib/cn';

interface TiltCardProps extends HTMLMotionProps<'div'> {
  /** Narrowed from Framer's `ReactNode | MotionValue` so JSX children type-check. */
  children?: ReactNode;
  /** Max tilt in degrees on each axis. */
  intensity?: number;
  /** Render a cursor-following sheen highlight. */
  glare?: boolean;
}

const SPRING = { stiffness: 150, damping: 18, mass: 0.4 } as const;

/**
 * A card wrapper that tilts in 3D toward the cursor with a soft glare sheen.
 *
 * Built on the Framer Motion already in the bundle (no new deps). Tilt is
 * disabled for `prefers-reduced-motion` users and for touch input, where it
 * would feel janky — in those cases it renders as a plain (still animatable)
 * card so the scroll-reveal `variants`/`layout` passed via props keep working.
 */
export function TiltCard({
  children,
  className,
  style,
  intensity = 8,
  glare = true,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Normalised pointer position within the card (0..1), centred at rest.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);

  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);

  // Sheen tracks the cursor and fades out when the pointer leaves.
  const glareOpacity = useMotionValue(0);
  const glareX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(sy, [0, 1], ['0%', '100%']);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.45), transparent 55%)`;

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    glareOpacity.set(1);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  }

  if (reduceMotion) {
    return (
      <motion.div className={className} style={style} {...rest}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className={cn('relative overflow-hidden', className)}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformPerspective: 900,
        willChange: 'transform',
      }}
      {...rest}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] mix-blend-soft-light"
          style={{ background: glareBg, opacity: glareOpacity }}
        />
      )}
    </motion.div>
  );
}
