import { forwardRef, useId } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Select = forwardRef(function Select(
  { label, erro, className = '', id, children, ...props },
  ref
) {
  const idGerado = useId();
  const selectId = id ?? idGerado;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!erro}
          className={`w-full appearance-none rounded-lg border bg-surface px-3.5 py-2.5 pr-9 text-sm text-ink
            transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40
            ${erro ? 'border-danger focus:border-danger' : 'border-border focus:border-brand-400'}
            ${className}`}
          {...props}
        >
          {children}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
      </div>
      {erro && <p className="text-xs text-danger">{erro}</p>}
    </div>
  );
});

export default Select;
