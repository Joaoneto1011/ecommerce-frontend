import { Link, useNavigate } from 'react-router-dom';
import { useListarProdutosQuery } from '../../api/produtosApi';
import { useListarCategoriasPublicasQuery } from '../../api/categoriasApi';
import CardProduto from './components/CardProduto';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function HomePage() {
  const { data, isLoading } = useListarProdutosQuery({ numeroPagina: 0, tamanhoPagina: 8 });
  const { data: categorias = [] } = useListarCategoriasPublicasQuery();
  const navigate = useNavigate();

  return (
    <div>
      <section className="relative overflow-hidden bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
            Direto da chapa
          </span>
          <h1 className="max-w-xl font-serif text-4xl font-bold text-white sm:text-5xl">
            Lanches no ponto certo.
          </h1>
          <p className="max-w-md text-white/70">
            Hambúrgueres artesanais, porções generosas e bebida geladinha — peça pelo site e retire ou receba rapidinho.
          </p>
          <Button variante="primary" tamanho="lg" onClick={() => navigate('/produtos')} className="mt-2">
            Ver cardápio
          </Button>
        </div>
      </section>

      {categorias.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categorias.map((categoria) => (
              <Link
                key={categoria.idCategoria}
                to={`/produtos?categoria=${encodeURIComponent(categoria.nomeCategoria)}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink-soft hover:border-brand-400 hover:text-brand-600"
              >
                {categoria.nomeCategoria}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-ink">Mais pedidos</h2>
          <Link to="/produtos" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Ver todos
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, indice) => (
              <Skeleton key={indice} className="aspect-4/5" />
            ))}
          </div>
        ) : data?.conteudo?.length ? (
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {data.conteudo.map((produto) => (
              <CardProduto key={produto.idProduto} produto={produto} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-muted">Nenhum item no cardápio ainda.</p>
        )}
      </section>
    </div>
  );
}
