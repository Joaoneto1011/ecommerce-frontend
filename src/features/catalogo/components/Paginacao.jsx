import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Paginacao({ paginaAtual, totalPaginas, aoMudarPagina }) {
  if (totalPaginas <= 1) return null;

  const todasPaginas = Array.from({ length: totalPaginas }, (_, i) => i);
  const janela = todasPaginas.filter(
    (p) => p === 0 || p === totalPaginas - 1 || Math.abs(p - paginaAtual) <= 1
  );

  const itens = [];
  let ultimo = -1;
  for (const p of janela) {
    if (ultimo !== -1 && p - ultimo > 1) itens.push(`reticencias-${p}`);
    itens.push(p);
    ultimo = p;
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-1">
      <button
        onClick={() => aoMudarPagina(Math.max(0, paginaAtual - 1))}
        disabled={paginaAtual === 0}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-black/5 disabled:opacity-30"
        aria-label="Página anterior"
      >
        <FiChevronLeft size={18} />
      </button>

      {itens.map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-2 text-muted">…</span>
        ) : (
          <button
            key={item}
            onClick={() => aoMudarPagina(item)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
              item === paginaAtual ? 'bg-ink text-white' : 'text-ink-soft hover:bg-black/5'
            }`}
          >
            {item + 1}
          </button>
        )
      )}

      <button
        onClick={() => aoMudarPagina(Math.min(totalPaginas - 1, paginaAtual + 1))}
        disabled={paginaAtual === totalPaginas - 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-black/5 disabled:opacity-30"
        aria-label="Próxima página"
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
}
