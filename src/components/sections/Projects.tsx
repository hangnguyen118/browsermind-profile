import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Github, ExternalLink, FolderGit2 } from 'lucide-react';
import { Section } from '../ui/Section';
import { TechTag } from '../ui/TechTag';
import { TiltCard } from '../ui/TiltCard';
import { PROJECTS } from '../../data/profile';
import { fadeUp } from '../../lib/motion';
import { cn } from '../../lib/cn';

export function Projects() {
  const { t } = useTranslation('sections');
  const [filter, setFilter] = useState<string>('all');

  const categories = useMemo(
    () => ['all', ...new Set(PROJECTS.map((p) => p.categoryKey))],
    [],
  );

  const visible = PROJECTS.filter(
    (p) => filter === 'all' || p.categoryKey === filter,
  );

  return (
    <Section
      id="projects"
      heading={t('projects.heading')}
      subheading={t('projects.subheading')}
      muted
    >
      {/* Filter chips */}
      <motion.div variants={fadeUp} className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === cat
                ? 'bg-accent-500 text-white'
                : 'border border-gray-300 text-gray-600 hover:border-accent-300 dark:border-gray-700 dark:text-gray-300',
            )}
          >
            {cat === 'all' ? t('projects.all') : t(`projects.filters.${cat}`)}
          </button>
        ))}
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="h-full"
          >
            <TiltCard
              intensity={6}
              className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-accent-200 to-accent-400 dark:from-accent-900/50 dark:to-accent-700/40">
                <FolderGit2 className="text-white/90" size={40} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold">{t(`projects.${project.nameKey}`)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {t(`projects.${project.descKey}`)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <TechTag key={tech} label={tech} />
                  ))}
                </div>
                <div className="mt-5 flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-accent-600 dark:text-gray-200 dark:hover:text-accent-300"
                    >
                      <Github size={16} />
                      {t('actions.code', { ns: 'common' })}
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-accent-600 dark:text-gray-200 dark:hover:text-accent-300"
                    >
                      <ExternalLink size={16} />
                      {t('actions.demo', { ns: 'common' })}
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
