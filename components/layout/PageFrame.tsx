import type { ReactNode } from "react";

type PageFrameProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function PageFrame({ eyebrow = "James AI Operator OS", title, subtitle, children }: PageFrameProps) {
  return (
    <main className="grid min-w-0 gap-6">
      <section className="sacred-panel gold-circuit rounded-lg p-6 md:p-8">
        <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
        <h1 className="max-w-5xl font-display text-[clamp(2.1rem,5vw,5.25rem)] leading-[0.96] text-ivory text-balance-safe">
          {title}
        </h1>
        {subtitle ? <p className="mt-4 max-w-3xl text-base leading-7 text-soft-sand text-balance-safe md:text-lg">{subtitle}</p> : null}
      </section>
      {children}
    </main>
  );
}
