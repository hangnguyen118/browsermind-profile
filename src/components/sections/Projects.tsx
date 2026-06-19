import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Github,
  ExternalLink,
  FolderGit2,
  Loader2,
  RotateCw,
} from 'lucide-react';
import { Section } from '../ui/Section';
import { TechTag } from '../ui/TechTag';
import { TiltCard } from '../ui/TiltCard';
import { fadeUp } from '../../lib/motion';
import { cn } from '../../lib/cn';
import { openSidePanel } from '../../lib/sidePanelBus';
import { useGithubProjects } from '../../hooks/useGithubProjects';
import type { DisplayProject } from '../../types';

export function Projects() {
  const { t, i18n } = useTranslation('sections');
  const [filter, setFilter] = useState<string>('all');
  // Projects are synced exclusively from GitHub (no static fallback).
  const { status, projects, syncedAt, reload } = useGithubProjects();

  // Localized "synced {time}" label, only once we have a sync timestamp.
  const syncedLabel = syncedAt
    ? t('projects.syncedAt', {
        time: new Date(syncedAt).toLocaleString(i18n.language, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      })
    : null;

  // Open the project in the left side panel: the GitHub README if there's a
  // repo, otherwise embed the live demo.
  const view = (project: DisplayProject) => {
    if (project.github) {
      openSidePanel({
        kind: 'github',
        title: project.name,
        subtitle: 'README',
        repoUrl: project.github,
      });
      return;
    }
    if (project.demo) {
      openSidePanel({
        kind: 'embed',
        title: project.name,
        subtitle: 'Demo',
        url: project.demo,
      });
    }
  };

  // Open the live demo in the side panel (from the card's Demo button).
  const openDemo = (project: DisplayProject) => {
    if (!project.demo) return;
    openSidePanel({
      kind: 'embed',
      title: project.name,
      subtitle: 'Demo',
      url: project.demo,
    });
  };

  const categories = useMemo(
    () => ['all', ...new Set(projects.map((p) => p.categoryKey))],
    [projects],
  );

  const visible = projects.filter(
    (p) => filter === 'all' || p.categoryKey === filter,
  );

  return (
    <Section
      id="projects"
      heading={t('projects.heading')}
      subheading={t('projects.subheading')}
      muted
    >
      {status === 'loading' ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500 dark:text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          {t('projects.loading')}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {status === 'error' ? t('projects.error') : t('projects.empty')}
          </p>
          {status === 'error' && (
            <button
              type="button"
              onClick={reload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-accent-300 dark:border-gray-700 dark:text-gray-200"
            >
              <RotateCw size={15} />
              {t('actions.retry', { ns: 'common' })}
            </button>
          )}
        </div>
      ) : (
        <>
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

      {/* Auto-sync hint: these projects come live from GitHub, not a static list. */}
      <motion.p
        variants={fadeUp}
        className="-mt-4 mb-8 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500 dark:text-gray-400"
      >
        <RotateCw size={12} className="text-accent-500" />
        <span>{t('projects.syncHint')}</span>
        {syncedLabel && (
          <>
            <span aria-hidden="true">·</span>
            <span>{syncedLabel}</span>
          </>
        )}
        <button
          type="button"
          onClick={reload}
          className="ml-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-accent-600 transition-colors hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-900/30"
        >
          <RotateCw size={11} />
          {t('projects.refresh')}
        </button>
      </motion.p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => {
          const clickable = Boolean(project.demo || project.github);
          return (
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
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? () => view(project) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        view(project);
                      }
                    }
                  : undefined
              }
              aria-label={clickable ? project.name : undefined}
              className={cn(
                'group flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900',
                clickable &&
                  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
              )}
            >
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-accent-200 to-accent-400 dark:from-accent-900/50 dark:to-accent-700/40">
                <FolderGit2 className="text-white/90" size={40} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {project.description}
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
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-accent-600 dark:text-gray-200 dark:hover:text-accent-300"
                    >
                      <Github size={16} />
                      {t('actions.code', { ns: 'common' })}
                    </a>
                  )}
                  {project.demo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDemo(project);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-accent-600 dark:text-gray-200 dark:hover:text-accent-300"
                    >
                      <ExternalLink size={16} />
                      {t('actions.demo', { ns: 'common' })}
                    </button>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>
          );
        })}
      </div>
        </>
      )}
    </Section>
  );
}
