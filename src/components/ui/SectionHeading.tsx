const TEXT_SHADOW = "[text-shadow:0_2px_24px_rgba(0,0,0,0.95),0_0_3px_rgba(0,0,0,0.9)]";

interface SectionHeadingProps {
  title: string;
  subtitle: string;
}

/** Section title with a dark scrim so it stays readable over bright 3D scenes. */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="pointer-events-none relative isolate">
      <div
        aria-hidden="true"
        className="absolute -inset-x-4 -inset-y-5 -z-10 bg-[radial-gradient(ellipse_at_left,rgba(2,3,10,0.85)_0%,rgba(2,3,10,0.55)_50%,transparent_78%)]"
      />
      <h2 className={`font-display text-2xl font-bold text-white sm:text-4xl ${TEXT_SHADOW}`}>
        {title}
      </h2>
      <p className={`mt-1 text-sm font-medium text-white/90 ${TEXT_SHADOW}`}>{subtitle}</p>
    </div>
  );
}
