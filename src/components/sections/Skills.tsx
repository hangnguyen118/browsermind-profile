import { useTranslation } from 'react-i18next';
import { Code2, Server, Cog, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Section } from '../ui/Section';
import { TiltCard } from '../ui/TiltCard';
import { SKILL_GROUPS } from '../../data/profile';
import type { SkillGroup, SkillLevel } from '../../types';
import { fadeUp } from '../../lib/motion';
import { cn } from '../../lib/cn';
import { openSidePanel } from '../../lib/sidePanelBus';

const LEVEL_STEPS: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

const GROUP_ICONS: Record<string, LucideIcon> = {
  frontend: Code2,
  backend: Server,
  devops: Cog,
  soft: Users,
};

function LevelDots({ level }: { level: SkillLevel }) {
  const filled = LEVEL_STEPS[level];
  return (
    <span className="flex gap-1" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 w-5 rounded-full',
            i <= filled
              ? 'bg-accent-400'
              : 'bg-gray-200 dark:bg-gray-700',
          )}
        />
      ))}
    </span>
  );
}

export function Skills() {
  const { t, i18n } = useTranslation('sections');

  // Open a Markdown write-up about the skill group in the left side panel.
  const view = (group: SkillGroup) => {
    const lang = i18n.language.startsWith('vi') ? 'vi' : 'en';
    openSidePanel({
      kind: 'markdown',
      title: t(`skills.groups.${group.categoryKey}`),
      subtitle: t('skills.subheading'),
      url: `./skills/${group.categoryKey}.${lang}.md`,
    });
  };

  return (
    <Section
      id="skills"
      heading={t('skills.heading')}
      subheading={t('skills.subheading')}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {SKILL_GROUPS.map((group) => {
          const Icon = GROUP_ICONS[group.categoryKey] ?? Code2;
          return (
            <TiltCard
              key={group.categoryKey}
              variants={fadeUp}
              intensity={6}
              role="button"
              tabIndex={0}
              onClick={() => view(group)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  view(group);
                }
              }}
              aria-label={t(`skills.groups.${group.categoryKey}`)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200">
                  <Icon size={20} />
                </span>
                <h3 className="text-lg font-bold">
                  {t(`skills.groups.${group.categoryKey}`)}
                </h3>
              </div>
              <ul className="space-y-3">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="hidden text-xs text-gray-400 sm:inline dark:text-gray-500">
                        {t(`skills.levels.${skill.level}`)}
                      </span>
                      <LevelDots level={skill.level} />
                    </div>
                  </li>
                ))}
              </ul>
            </TiltCard>
          );
        })}
      </div>
    </Section>
  );
}
