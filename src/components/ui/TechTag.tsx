import { cn } from '../../lib/cn';

interface TechTagProps {
  label: string;
  className?: string;
}

/** Small pill used for tech-stack tags across sections. */
export function TechTag({ label, className }: TechTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-800 dark:bg-accent-900/40 dark:text-accent-200',
        className,
      )}
    >
      {label}
    </span>
  );
}
