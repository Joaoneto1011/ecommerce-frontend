import { forwardRef } from 'react';
import Spinner from './Spinner';

const VARIANTES = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 focus-visible:outline-brand-500 disabled:bg-brand-300',
  secondary:
    'bg-ink text-white hover:bg-ink-soft focus-visible:outline-ink disabled:bg-muted',
  outline:
    'bg-transparent text-ink border border-border hover:bg-surface hover:border-ink/30 focus-visible:outline-ink disabled:opacity-50',
  ghost:
    'bg-transparent text-ink-soft hover:bg-black/5 focus-visible:outline-ink disabled:opacity-50',
  danger:
    'bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger disabled:opacity-50',
};

const TAMANHOS = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2',
};

const Button = forwardRef(function Button(
  {
    variante = 'primary',
    tamanho = 'md',
    carregando = false,
    className = '',
    children,
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || carregando}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:cursor-not-allowed
        ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${className}`}
      {...props}
    >
      {carregando && <Spinner tamanho="sm" className="text-current" />}
      {children}
    </button>
  );
});

export default Button;
