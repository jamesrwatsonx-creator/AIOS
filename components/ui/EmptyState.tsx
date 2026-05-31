import { Eye } from "lucide-react";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="grid place-items-center gap-3 rounded border border-gold/16 bg-obsidian/45 p-8 text-center">
      <Eye className="h-8 w-8 text-gold/70" aria-hidden="true" />
      <h3 className="font-display text-2xl text-gold text-balance-safe">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-soft-sand text-balance-safe">{message}</p>
    </div>
  );
}
