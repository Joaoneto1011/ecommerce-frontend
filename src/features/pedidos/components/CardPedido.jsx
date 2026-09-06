import { Link } from 'react-router-dom';
import { formatarMoeda } from '../../../lib/formatMoney';
import { formatarData } from '../../../lib/formatDate';
import BadgeStatusPedido from './BadgeStatusPedido';

export default function CardPedido({ pedido }) {
  return (
    <Link
      to={`/pedidos/${pedido.idPedido}`}
      className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:border-ink/20"
    >
      <div>
        <p className="text-sm font-medium text-ink">Pedido #{pedido.idPedido}</p>
        <p className="mt-1 text-sm text-muted">
          {formatarData(pedido.dataDoPedido)} · {pedido.itensDoPedido.length} item(ns)
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-medium text-ink">{formatarMoeda(pedido.valorTotal)}</span>
        <BadgeStatusPedido status={pedido.statusPedido} />
      </div>
    </Link>
  );
}
