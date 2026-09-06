import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useListarProdutosQuery } from '../../api/produtosApi';
import CardProduto from './components/CardProduto';
import FiltroCategorias from './components/FiltroCategorias';
import FiltroOrdenacao, { resolverOrdenacao } from './components/FiltroOrdenacao';
import Paginacao from './components/Paginacao';
import Skeleton from '../../components/ui/Skeleton';

export default function ProdutosPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoria = searchParams.get('categoria') ?? '';
  const palavraChave = searchParams.get('palavraChave') ?? '';
  const ordenacao = searchParams.get('ordenacao') ?? 'preco-asc';
  const pagina = Number(searchParams.get('pagina') ?? 0);

  const { ordenarPorProduto, classificarOrdem } = resolverOrdenacao(ordenacao);

  const parametros = useMemo(
    () => ({
      categoria: categoria || undefined,
      palavraChave: palavraChave || undefined,
      numeroPagina: pagina,
      tamanhoPagina: 12,
      ordenarPorProduto,
      classificarOrdem,
    }),
    [categoria, palavraChave, pagina, ordenarPorProduto, classificarOrdem]
  );

  const { data, isLoading, isFetching } = useListarProdutosQuery(parametros);

  function atualizarFiltro(chave, valor) {
    const novosParametros = new URLSearchParams(searchParams);
    if (valor) novosParametros.set(chave, valor);
    else novosParametros.delete(chave);
    novosParametros.delete('pagina');
    setSearchParams(novosParametros);
  }

  function mudarPagina(novaPagina) {
    const novosParametros = new URLSearchParams(searchParams);
    novosParametros.set('pagina', String(novaPagina));
    setSearchParams(novosParametros);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Cardápio</h1>
          {data && <p className="mt-1 text-sm text-muted">{data.totalElementos} item(ns) encontrado(s)</p>}
        </div>
        <div className="flex gap-3">
          <FiltroCategorias valor={categoria} aoMudar={(v) => atualizarFiltro('categoria', v)} />
          <FiltroOrdenacao valor={ordenacao} aoMudar={(v) => atualizarFiltro('ordenacao', v)} />
        </div>
      </div>

      {palavraChave && (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <FiSearch size={14} /> Resultados para &quot;{palavraChave}&quot;
          <button onClick={() => atualizarFiltro('palavraChave', '')} className="font-medium text-brand-600 hover:underline">
            limpar
          </button>
        </p>
      )}

      {isLoading ? (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, indice) => (
            <Skeleton key={indice} className="aspect-4/5" />
          ))}
        </div>
      ) : data?.conteudo?.length ? (
        <>
          <div
            className={`mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 transition-opacity ${isFetching ? 'opacity-60' : ''}`}
          >
            {data.conteudo.map((produto) => (
              <CardProduto key={produto.idProduto} produto={produto} />
            ))}
          </div>
          <Paginacao paginaAtual={data.numeroPagina} totalPaginas={data.totalPaginas} aoMudarPagina={mudarPagina} />
        </>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="text-lg font-medium text-ink">Nenhum produto encontrado</p>
          <p className="text-sm text-muted">Tente ajustar os filtros ou buscar por outro termo.</p>
        </div>
      )}
    </div>
  );
}
