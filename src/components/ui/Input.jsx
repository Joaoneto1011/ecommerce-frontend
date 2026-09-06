import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, erro, hint, className = '', id, ...props },
  ref
) {
  const idGerado = useId();
  const inputId = id ?? idGerado;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!erro}
        className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted
          transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40
          ${erro ? 'border-danger focus:border-danger' : 'border-border focus:border-brand-400'}
          ${className}`}
        {...props}
      />
      {erro && <p className="text-xs text-danger">{erro}</p>}
      {!erro && hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
});

export default Input;
