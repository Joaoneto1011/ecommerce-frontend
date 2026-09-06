import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import { useObterCarrinhoQuery } from '../../api/carrinhoApi';
import ItemCarrinho from './components/ItemCarrinho';
import ResumoCarrinho from './components/ResumoCarrinho';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function CarrinhoPage() {
  const { data: carrinho, isLoading } = useObterCarrinhoQuery();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-ink">Meu carrinho</h1>

      {isLoading ? (
        <div className="mt-8 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, indice) => (
            <Skeleton key={indice} className="h-24 w-full" />
          ))}
        </div>
      ) : carrinho?.itens?.length ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-border bg-surface px-6">
            {carrinho.itens.map((item) => (
              <ItemCarrinho key={item.idItemDoCarrinho} item={item} idCarrinho={carrinho.idCarrinho} />
            ))}
          </div>
          <ResumoCarrinho precoTotal={carrinho.precoTotal} />
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <FiShoppingBag size={40} className="text-muted" />
          <p className="text-lg font-medium text-ink">Seu carrinho está vazio</p>
          <p className="text-sm text-muted">Explore o catálogo e encontre algo para você.</p>
          <Link to="/produtos">
            <Button className="mt-2">Ver produtos</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
