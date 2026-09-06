import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import { useListarPedidosQuery } from '../../api/pedidosApi';
import CardPedido from './components/CardPedido';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function PedidosPage() {
  const { data: pedidos = [], isLoading } = useListarPedidosQuery();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-ink">Meus pedidos</h1>

      {isLoading ? (
        <div className="mt-8 flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, indice) => (
            <Skeleton key={indice} className="h-20 w-full" />
          ))}
        </div>
      ) : pedidos.length ? (
        <div className="mt-8 flex flex-col gap-3">
          {pedidos.map((pedido) => (
            <CardPedido key={pedido.idPedido} pedido={pedido} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <FiPackage size={40} className="text-muted" />
          <p className="text-lg font-medium text-ink">Você ainda não fez nenhum pedido</p>
          <Link to="/produtos">
            <Button className="mt-2">Ver produtos</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
