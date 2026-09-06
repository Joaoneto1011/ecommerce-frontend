import { useParams, Link } from 'react-router-dom';
import { useListarPedidosQuery } from '../../api/pedidosApi';
import { formatarMoeda } from '../../lib/formatMoney';
import { formatarData } from '../../lib/formatDate';
import BadgeStatusPedido from './components/BadgeStatusPedido';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function PedidoDetalhePage() {
  const { idPedido } = useParams();
  const { data: pedidos = [], isLoading } = useListarPedidosQuery();
  const pedido = pedidos.find((p) => String(p.idPedido) === idPedido);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-6 h-48 w-full" />
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-lg font-medium text-ink">Pedido não encontrado</p>
        <Link to="/pedidos">
          <Button variante="outline" className="mt-4">
            Voltar para pedidos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Pedido #{pedido.idPedido}</h1>
        <BadgeStatusPedido status={pedido.statusPedido} />
      </div>
      <p className="mt-1 text-sm text-muted">Realizado em {formatarData(pedido.dataDoPedido)}</p>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="font-serif text-lg text-ink">Itens</h2>
        <div className="mt-4 divide-y divide-border">
          {pedido.itensDoPedido.map((item) => (
            <div key={item.idItemDoPedido} className="flex items-center gap-4 py-3">
              <img
                src={item.produto.imagem}
                alt={item.produto.nomeProduto}
                className="h-16 w-16 rounded-lg bg-black/5 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{item.produto.nomeProduto}</p>
                <p className="text-sm text-muted">Quantidade: {item.quantidade}</p>
              </div>
              <span className="font-medium text-ink">
                {formatarMoeda(item.precoProdutoPedido * item.quantidade)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-base font-semibold text-ink">
          <span>Total</span>
          <span>{formatarMoeda(pedido.valorTotal)}</span>
        </div>
      </div>

      {pedido.enderecoDeEntrega && (
        <div className="mt-6 rounded-xl border border-border bg-surface p-6">
          <h2 className="font-serif text-lg text-ink">Endereço de entrega</h2>
          <p className="mt-2 text-sm text-ink-soft">
            {pedido.enderecoDeEntrega.rua}, {pedido.enderecoDeEntrega.numeroRua} — {pedido.enderecoDeEntrega.cidade}/
            {pedido.enderecoDeEntrega.estado}, CEP {pedido.enderecoDeEntrega.cep}
          </p>
        </div>
      )}
    </div>
  );
}
