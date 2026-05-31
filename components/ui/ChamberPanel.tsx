type ChamberPanelProps = {
  children: React.ReactNode;
  className?: string;
  accent?: string;
};

export function ChamberPanel({ children, className = "", accent = "#d4a64a" }: ChamberPanelProps) {
  return (
    <section
      className={`sacred-panel min-w-0 rounded-lg p-5 shadow-gold-soft ${className}`}
      style={{ boxShadow: `0 0 0 1px ${accent}22, 0 24px 80px rgba(0,0,0,0.34)` }}
    >
      {children}
    </section>
  );
}
