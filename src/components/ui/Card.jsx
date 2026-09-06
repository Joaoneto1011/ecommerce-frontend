export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-[0_1px_2px_rgba(17,17,20,0.04)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
