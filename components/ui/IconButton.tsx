import type { LucideIcon } from "lucide-react";

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
};

export function IconButton({ icon: Icon, label, href }: IconButtonProps) {
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </>
  );

  const className = "inline-flex h-10 w-10 items-center justify-center rounded border border-gold/25 bg-obsidian/60 transition hover:-translate-y-0.5 hover:border-gold/55 hover:bg-gold/10";

  if (href) {
    return (
      <a className={className} href={href} title={label}>
        {content}
      </a>
    );
  }

  return (
    <button className={className} type="button" title={label}>
      {content}
    </button>
  );
}
