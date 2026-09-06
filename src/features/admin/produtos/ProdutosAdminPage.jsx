import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useListarProdutosQuery, useExcluirProdutoMutation } from '../../../api/produtosApi';
import { formatarMoeda } from '../../../lib/formatMoney';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';
import Badge from '../../../components/ui/Badge';

export default function ProdutosAdminPage() {
  const { data, isLoading } = useListarProdutosQuery({ numeroPagina: 0, tamanhoPagina: 100 });
  const [excluirProduto] = useExcluirProdutoMutation();

  async function excluir(produto) {
    if (!window.confirm(`Excluir "${produto.nomeProduto}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await excluirProduto(produto.idProduto).unwrap();
      toast.success('Produto excluído.');
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível excluir o produto.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">Produtos</h1>
          <p className="mt-1 text-sm text-muted">{data?.totalElementos ?? 0} produto(s) cadastrado(s)</p>
        </div>
        <Link to="/admin/produtos/novo">
          <Button>
            <FiPlus size={16} /> Novo produto
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
        {isLoading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 5 }).map((_, indice) => (
              <Skeleton key={indice} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.conteudo?.map((produto) => (
                <tr key={produto.idProduto}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img
                      src={produto.imagem}
                      alt={produto.nomeProduto}
                      className="h-10 w-10 rounded-lg bg-black/5 object-cover"
                    />
                    <span className="font-medium text-ink">{produto.nomeProduto}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{produto.categoria?.nomeCategoria ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatarMoeda(produto.precoEspecial)}</td>
                  <td className="px-4 py-3">
                    {Number(produto.quantidadeEstoque) > 0 ? (
                      <span className="text-ink-soft">{produto.quantidadeEstoque}</span>
                    ) : (
                      <Badge variante="danger">Esgotado</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/admin/produtos/${produto.idProduto}/editar`}
                        className="rounded-lg p-2 text-muted hover:bg-black/5 hover:text-ink"
                        aria-label="Editar"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        onClick={() => excluir(produto)}
                        className="rounded-lg p-2 text-muted hover:bg-danger-bg hover:text-danger"
                        aria-label="Excluir"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
