import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view so the nav can highlight the
 * active link (SPEC §3 useScrollSpy). Uses IntersectionObserver.
 */
export function useScrollSpy(
  sectionIds: string[],
  options?: { rootMargin?: string },
): string | null {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds[0] ?? null,
  );

  useEffect(() => {
    const rootMargin = options?.rootMargin ?? '-45% 0px -50% 0px';
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top among those intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin, threshold: 0 },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // sectionIds is a stable literal array from the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(','), options?.rootMargin]);

  return activeId;
}
