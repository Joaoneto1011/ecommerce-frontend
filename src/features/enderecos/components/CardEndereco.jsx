import { FiEdit2, FiTrash2, FiMapPin } from 'react-icons/fi';

export default function CardEndereco({ endereco, selecionado = false, aoSelecionar, aoEditar, aoExcluir }) {
  return (
    <div
      onClick={aoSelecionar}
      className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
        aoSelecionar ? 'cursor-pointer' : ''
      } ${selecionado ? 'border-brand-500 bg-brand-50' : 'border-border bg-surface hover:border-ink/20'}`}
    >
      <FiMapPin className={`mt-0.5 shrink-0 ${selecionado ? 'text-brand-600' : 'text-muted'}`} size={18} />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium text-ink">
          {endereco.rua}, {endereco.numeroRua}
        </p>
        <p className="text-muted">
          {endereco.cidade} - {endereco.estado}, {endereco.pais}
        </p>
        <p className="text-muted">CEP {endereco.cep}</p>
      </div>
      {(aoEditar || aoExcluir) && (
        <div className="flex shrink-0 gap-1">
          {aoEditar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                aoEditar();
              }}
              className="rounded-lg p-2 text-muted hover:bg-black/5 hover:text-ink"
              aria-label="Editar endereço"
            >
              <FiEdit2 size={15} />
            </button>
          )}
          {aoExcluir && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                aoExcluir();
              }}
              className="rounded-lg p-2 text-muted hover:bg-danger-bg hover:text-danger"
              aria-label="Excluir endereço"
            >
              <FiTrash2 size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
