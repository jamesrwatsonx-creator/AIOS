type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
};

export function SectionTitle({ eyebrow, title, action }: SectionTitleProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-gold/80">{eyebrow}</p>
        ) : null}
        <h2 className="font-display text-[clamp(1.35rem,2vw,2.05rem)] leading-tight text-ivory text-balance-safe">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
