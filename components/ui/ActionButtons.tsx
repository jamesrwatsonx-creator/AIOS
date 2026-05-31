type SaveClearProps = {
  onSave: () => void;
  onClear: () => void;
  saved?: boolean;
  saveLabel?: string;
};

export function SaveClearButtons({ onSave, onClear, saved, saveLabel = "SAVE" }: SaveClearProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onSave}
        className="rounded-none border border-gold/55 bg-obsidian px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-gold transition hover:bg-gold hover:text-obsidian"
      >
        {saveLabel}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="rounded-none border border-burnt-bronze/45 bg-burnt-bronze/10 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-soft-sand transition hover:border-burnt-bronze hover:text-ivory"
      >
        Clear
      </button>
      {saved ? <span className="font-mono text-xs uppercase tracking-[0.14em] text-gold">Saved ✓</span> : null}
    </div>
  );
}
