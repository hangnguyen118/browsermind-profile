import { Github, Linkedin, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '../../data/profile';
import { cn } from '../../lib/cn';

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail } as const;

interface SocialLinksProps {
  className?: string;
  size?: number;
}

/** Row of social icon links (GitHub, LinkedIn, Email). */
export function SocialLinks({ className, size = 20 }: SocialLinksProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {SOCIAL_LINKS.map((link) => {
        const Icon = ICONS[link.icon];
        const external = link.href.startsWith('http');
        return (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            title={link.label}
            {...(external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="rounded-lg border border-gray-200 p-2.5 text-gray-600 transition-colors hover:border-accent-300 hover:text-accent-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-accent-400 dark:hover:text-accent-300"
          >
            <Icon size={size} />
          </a>
        );
      })}
    </div>
  );
}
