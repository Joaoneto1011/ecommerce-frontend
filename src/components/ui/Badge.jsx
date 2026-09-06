const VARIANTES = {
  neutral: 'bg-black/5 text-ink-soft',
  brand: 'bg-brand-100 text-brand-700',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
};

export default function Badge({ variante = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${VARIANTES[variante]} ${className}`}
    >
      {children}
    </span>
  );
}
