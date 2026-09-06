import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { formatarMoeda } from '../../../lib/formatMoney';
import Button from '../../../components/ui/Button';

export default function EtapaConfirmacao({ pedido }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <FiCheckCircle className="text-success" size={56} />
      <h2 className="mt-4 font-serif text-2xl text-ink">Pedido recebido — pagamento simulado</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Seu pedido #{pedido.idPedido} foi registrado com status <strong>{pedido.statusPedido}</strong> no valor de{' '}
        {formatarMoeda(pedido.valorTotal)}. Nenhuma cobrança real foi feita — este é um ambiente de demonstração.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/produtos">
          <Button variante="outline">Continuar comprando</Button>
        </Link>
        <Link to={`/pedidos/${pedido.idPedido}`}>
          <Button>Ver pedido</Button>
        </Link>
      </div>
    </div>
  );
}
