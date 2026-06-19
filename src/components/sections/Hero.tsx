import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Download, MessageSquareText, Send } from 'lucide-react';
import { SocialLinks } from '../ui/SocialLinks';
import { PROFILE } from '../../data/profile';
import { fadeUp, staggerContainer } from '../../lib/motion';
import { openChat } from '../../lib/chatBus';
import { openSidePanel } from '../../lib/sidePanelBus';

// three.js + react-three-fiber are heavy, so the WebGL backdrop loads as its
// own async chunk — the hero text/avatar paint immediately, the 3D fades in.
const HeroBackground3D = lazy(() => import('./HeroBackground3D'));

const POINTER_SPRING = { stiffness: 120, damping: 20, mass: 0.5 } as const;

export function Hero() {
  const { t } = useTranslation(['sections', 'common']);
  const [avatarError, setAvatarError] = useState(false);
  const [show3d, setShow3d] = useState(false);
  const reduceMotion = useReducedMotion();

  // Shared cursor position (normalised -0.5..0.5) read by the 3D scene.
  const pointer = useRef({ x: 0, y: 0 });

  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const sx = useSpring(mvx, POINTER_SPRING);
  const sy = useSpring(mvy, POINTER_SPRING);

  // Avatar floats and tilts toward the cursor; blobs drift the other way for depth.
  const avatarX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const avatarY = useTransform(sy, [-0.5, 0.5], [-16, 16]);
  const avatarRotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const avatarRotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const blobAX = useTransform(sx, [-0.5, 0.5], [28, -28]);
  const blobAY = useTransform(sy, [-0.5, 0.5], [28, -28]);
  const blobBX = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const blobBY = useTransform(sy, [-0.5, 0.5], [-20, 20]);

  // Defer mounting the 3D chunk until after the first paint.
  useEffect(() => {
    setShow3d(true);
  }, []);

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mvx.set(x);
    mvy.set(y);
    pointer.current.x = x;
    pointer.current.y = y;
  }

  function handlePointerLeave() {
    mvx.set(0);
    mvy.set(0);
    pointer.current.x = 0;
    pointer.current.y = 0;
  }

  // Open the CV PDF in the left side panel when the avatar is clicked.
  function openCv() {
    openSidePanel({
      kind: 'pdf',
      title: t('hero.name'),
      subtitle: 'CV',
      url: PROFILE.cvUrl,
    });
  }

  return (
    <section
      id="top"
      onPointerMove={reduceMotion ? undefined : handlePointerMove}
      onPointerLeave={reduceMotion ? undefined : handlePointerLeave}
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24"
    >
      {/* WebGL particle backdrop (lazy, behind everything, disabled for reduced motion). */}
      {show3d && !reduceMotion && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <Suspense fallback={null}>
            <HeroBackground3D pointer={pointer} />
          </Suspense>
        </motion.div>
      )}

      {/* Decorative accent blobs */}
      <motion.div
        aria-hidden
        style={{ x: blobAX, y: blobAY }}
        className="pointer-events-none absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-accent-200/50 blur-3xl dark:bg-accent-900/30"
      />
      <motion.div
        aria-hidden
        style={{ x: blobBX, y: blobBY }}
        className="pointer-events-none absolute top-40 -left-24 -z-10 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl dark:bg-accent-800/20"
      />

      <div className="container-page">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col-reverse items-center gap-10 md:flex-row md:justify-between"
        >
          <div className="max-w-xl text-center md:text-left">
            <motion.p
              variants={fadeUp}
              className="text-base font-medium text-accent-600 dark:text-accent-300"
            >
              {t('hero.greeting')}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {t('hero.name')}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-xl font-semibold accent-gradient-text sm:text-2xl"
            >
              {t('hero.title')}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-300"
            >
              {t('hero.tagline')}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
            >
              <a
                href={PROFILE.cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-600"
              >
                <Download size={18} />
                {t('common:actions.downloadCv')}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-accent-300 dark:border-gray-700 dark:text-gray-200"
              >
                <Send size={18} />
                {t('common:actions.contact')}
              </a>
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 dark:bg-white dark:text-gray-900"
              >
                <MessageSquareText size={18} />
                {t('common:actions.chatWithAi')}
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex justify-center md:justify-start"
            >
              <SocialLinks />
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="shrink-0">
            <motion.div
              role="button"
              tabIndex={0}
              onClick={openCv}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openCv();
                }
              }}
              aria-label={t('common:actions.downloadCv')}
              style={{
                x: avatarX,
                y: avatarY,
                rotateX: avatarRotateX,
                rotateY: avatarRotateY,
                transformPerspective: 800,
              }}
              className="relative cursor-pointer rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            >
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-accent-300 to-accent-500 blur-md" />
              <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-xl sm:h-56 sm:w-56 dark:border-gray-800">
                {!avatarError ? (
                  <img
                    src={PROFILE.avatarUrl}
                    alt={t('hero.name')}
                    onError={() => setAvatarError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-accent-100 text-5xl font-extrabold text-accent-700 dark:bg-accent-900/40 dark:text-accent-200">
                    {PROFILE.initials}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
