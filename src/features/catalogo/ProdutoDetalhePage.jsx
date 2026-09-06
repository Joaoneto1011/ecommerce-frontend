import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi';
import { useBuscarProdutoPorIdQuery } from '../../api/produtosApi';
import { useAdicionarAoCarrinhoMutation } from '../../api/carrinhoApi';
import { selecionarEstaAutenticado } from '../auth/authSlice';
import { formatarMoeda } from '../../lib/formatMoney';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';

export default function ProdutoDetalhePage() {
  const { idProduto } = useParams();
  const navigate = useNavigate();
  const estaAutenticado = useSelector(selecionarEstaAutenticado);
  const { data: produto, isLoading, isError } = useBuscarProdutoPorIdQuery(idProduto);
  const [adicionarAoCarrinho, { isLoading: adicionando }] = useAdicionarAoCarrinhoMutation();
  const [quantidade, setQuantidade] = useState(1);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <Skeleton className="aspect-square" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !produto) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-ink">Produto não encontrado</p>
        <Button variante="outline" className="mt-4" onClick={() => navigate('/produtos')}>
          Voltar para produtos
        </Button>
      </div>
    );
  }

  const temDesconto = Number(produto.desconto) > 0;
  const disponivel = Number(produto.quantidadeEstoque) > 0;

  async function aoAdicionarAoCarrinho() {
    if (!estaAutenticado) {
      toast('Entre na sua conta para adicionar ao carrinho.', { icon: '🔒' });
      navigate('/login', { state: { de: { pathname: `/produto/${idProduto}` } } });
      return;
    }
    try {
      await adicionarAoCarrinho({ idProduto: produto.idProduto, quantidade }).unwrap();
      toast.success('Produto adicionado ao carrinho!');
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível adicionar ao carrinho.');
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-black/5">
          <img src={produto.imagem} alt={produto.nomeProduto} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col">
          {produto.categoria && (
            <span className="text-sm font-medium uppercase tracking-wide text-brand-600">
              {produto.categoria.nomeCategoria}
            </span>
          )}
          <h1 className="mt-2 font-serif text-3xl text-ink">{produto.nomeProduto}</h1>

          <div className="mt-4 flex items-center gap-3">
            {temDesconto ? (
              <>
                <span className="text-lg text-muted line-through">{formatarMoeda(produto.preco)}</span>
                <span className="text-2xl font-semibold text-ink">{formatarMoeda(produto.precoEspecial)}</span>
                <Badge variante="brand">-{Number(produto.desconto)}%</Badge>
              </>
            ) : (
              <span className="text-2xl font-semibold text-ink">{formatarMoeda(produto.preco)}</span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-ink-soft">{produto.descricao}</p>

          <div className="mt-6">
            {disponivel ? <Badge variante="success">Em estoque</Badge> : <Badge variante="danger">Indisponível</Badge>}
          </div>

          {disponivel && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-ink-soft hover:bg-black/5"
                  aria-label="Diminuir quantidade"
                >
                  <FiMinus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantidade}</span>
                <button
                  onClick={() => setQuantidade((q) => Math.min(produto.quantidadeEstoque, q + 1))}
                  className="flex h-11 w-11 items-center justify-center text-ink-soft hover:bg-black/5"
                  aria-label="Aumentar quantidade"
                >
                  <FiPlus size={16} />
                </button>
              </div>
              <Button onClick={aoAdicionarAoCarrinho} carregando={adicionando} className="flex-1" tamanho="lg">
                <FiShoppingBag size={18} /> Adicionar ao carrinho
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
