import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { formatarMoeda } from '../../../lib/formatMoney';
import {
  useAtualizarQuantidadeNoCarrinhoMutation,
  useRemoverDoCarrinhoMutation,
} from '../../../api/carrinhoApi';

export default function ItemCarrinho({ item, idCarrinho }) {
  const [atualizarQuantidade, { isLoading: atualizando }] = useAtualizarQuantidadeNoCarrinhoMutation();
  const [remover, { isLoading: removendo }] = useRemoverDoCarrinhoMutation();

  async function alterar(operacao) {
    try {
      await atualizarQuantidade({ idProduto: item.produto.idProduto, operacao }).unwrap();
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível atualizar o item.');
    }
  }

  async function removerItem() {
    try {
      await remover({ idCarrinho, idProduto: item.produto.idProduto }).unwrap();
      toast.success('Item removido do carrinho.');
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível remover o item.');
    }
  }

  const carregando = atualizando || removendo;

  return (
    <div className="flex items-center gap-4 border-b border-border py-4 last:border-0">
      <img
        src={item.produto.imagem}
        alt={item.produto.nomeProduto}
        className="h-20 w-20 shrink-0 rounded-lg bg-black/5 object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{item.produto.nomeProduto}</p>
        <p className="mt-1 text-sm text-muted">{formatarMoeda(item.precoComDesconto)} / unidade</p>
      </div>
      <div className="flex items-center rounded-lg border border-border">
        <button
          onClick={() => alterar('deletar')}
          disabled={carregando}
          className="flex h-9 w-9 items-center justify-center text-ink-soft hover:bg-black/5 disabled:opacity-40"
          aria-label="Diminuir quantidade"
        >
          <FiMinus size={14} />
        </button>
        <span className="w-7 text-center text-sm font-medium">{item.quantidade}</span>
        <button
          onClick={() => alterar('adicionar')}
          disabled={carregando}
          className="flex h-9 w-9 items-center justify-center text-ink-soft hover:bg-black/5 disabled:opacity-40"
          aria-label="Aumentar quantidade"
        >
          <FiPlus size={14} />
        </button>
      </div>
      <p className="w-24 shrink-0 text-right font-medium text-ink">
        {formatarMoeda(item.precoComDesconto * item.quantidade)}
      </p>
      <button
        onClick={removerItem}
        disabled={carregando}
        className="text-muted hover:text-danger disabled:opacity-40"
        aria-label="Remover item"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}
