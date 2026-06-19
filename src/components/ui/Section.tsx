import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, revealProps, staggerContainer } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface SectionProps {
  id: string;
  heading: string;
  subheading?: string;
  children: ReactNode;
  /** Alternating background for visual rhythm. */
  muted?: boolean;
  className?: string;
}

/** Standard page section with a revealed heading and content (SPEC §4). */
export function Section({
  id,
  heading,
  subheading,
  children,
  muted = false,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'section-padding scroll-mt-20',
        muted && 'bg-gray-50 dark:bg-gray-900/40',
        className,
      )}
    >
      <div className="container-page">
        <motion.div {...revealProps} variants={staggerContainer}>
          <motion.div variants={fadeUp} className="mb-10 sm:mb-14">
            {subheading && (
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-300">
                {subheading}
              </p>
            )}
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {heading}
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-accent-400" />
          </motion.div>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
