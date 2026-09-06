import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import {
  useListarTodosPedidosAdminQuery,
  useAtualizarStatusPedidoMutation,
} from '../../../api/pedidosApi';
import { formatarMoeda } from '../../../lib/formatMoney';
import { formatarData } from '../../../lib/formatDate';
import BadgeStatusPedido from '../../pedidos/components/BadgeStatusPedido';
import Card from '../../../components/ui/Card';
import Select from '../../../components/ui/Select';
import Skeleton from '../../../components/ui/Skeleton';

const PROXIMOS_STATUS = {
  PENDENTE: ['PAGO', 'CANCELADO'],
  PAGO: ['ENVIADO', 'CANCELADO'],
  ENVIADO: ['ENTREGUE'],
  ENTREGUE: [],
  CANCELADO: [],
};

const ROTULOS_METODO_PAGAMENTO = {
  cartao_credito: 'Cartão de crédito',
  cartao_debito: 'Cartão de débito',
  pix: 'Pix',
  boleto: 'Boleto',
};

export default function PedidoDetalheAdminPage() {
  const { idPedido } = useParams();
  const { data: pedidos = [], isLoading } = useListarTodosPedidosAdminQuery();
  const [atualizarStatus] = useAtualizarStatusPedidoMutation();
  const pedido = pedidos.find((p) => String(p.idPedido) === idPedido);

  async function mudarStatus(novoStatus, elementoSelect) {
    if (!novoStatus) return;
    try {
      await atualizarStatus({ idPedido: pedido.idPedido, novoStatus }).unwrap();
      toast.success(`Pedido #${pedido.idPedido} atualizado para ${novoStatus}.`);
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível atualizar o status.');
    } finally {
      if (elementoSelect) elementoSelect.value = '';
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    );
  }

  if (!pedido) {
    return (
      <div>
        <Link to="/admin/pedidos" className="flex items-center gap-2 text-sm text-muted hover:text-ink">
          <FiArrowLeft size={14} /> Voltar
        </Link>
        <p className="mt-6 text-sm text-muted">Pedido não encontrado.</p>
      </div>
    );
  }

  const opcoesStatus = PROXIMOS_STATUS[pedido.statusPedido] ?? [];

  return (
    <div className="max-w-3xl">
      <Link to="/admin/pedidos" className="flex items-center gap-2 text-sm text-muted hover:text-ink">
        <FiArrowLeft size={14} /> Voltar para pedidos
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">Pedido #{pedido.idPedido}</h1>
          <p className="mt-1 text-sm text-muted">
            Realizado em {formatarData(pedido.dataDoPedido)} por {pedido.email}
          </p>
        </div>
        <BadgeStatusPedido status={pedido.statusPedido} />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-serif text-lg font-bold text-ink">Itens do pedido</h2>
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
                <p className="text-sm text-muted">
                  {item.quantidade} × {formatarMoeda(item.precoProdutoPedido)}
                </p>
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
      </Card>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-serif text-lg font-bold text-ink">Endereço de entrega</h2>
          {pedido.enderecoDeEntrega ? (
            <p className="mt-2 text-sm text-ink-soft">
              {pedido.enderecoDeEntrega.rua}, {pedido.enderecoDeEntrega.numeroRua}
              <br />
              {pedido.enderecoDeEntrega.cidade}/{pedido.enderecoDeEntrega.estado} — CEP{' '}
              {pedido.enderecoDeEntrega.cep}
              <br />
              {pedido.enderecoDeEntrega.pais}
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted">Nenhum endereço registrado.</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-lg font-bold text-ink">Pagamento</h2>
          {pedido.pagamento ? (
            <dl className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Método</dt>
                <dd className="text-ink-soft">
                  {ROTULOS_METODO_PAGAMENTO[pedido.pagamento.metodoDePagamento] ??
                    pedido.pagamento.metodoDePagamento}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Status no gateway</dt>
                <dd className="text-ink-soft">{pedido.pagamento.statusGateway ?? '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Gateway</dt>
                <dd className="text-ink-soft">{pedido.pagamento.nomeGateway ?? '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">ID no gateway</dt>
                <dd className="truncate text-ink-soft">{pedido.pagamento.idPagamentoGateway ?? '—'}</dd>
              </div>
              {pedido.pagamento.mensagemRespostaGateway && (
                <p className="pt-1 text-xs text-muted">{pedido.pagamento.mensagemRespostaGateway}</p>
              )}
            </dl>
          ) : (
            <p className="mt-2 text-sm text-muted">Nenhum pagamento registrado.</p>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-serif text-lg font-bold text-ink">Avançar status do pedido</h2>
        {opcoesStatus.length > 0 ? (
          <Select
            defaultValue=""
            onChange={(e) => mudarStatus(e.target.value, e.target)}
            className="mt-3 max-w-xs"
          >
            <option value="" disabled>
              Alterar para...
            </option>
            {opcoesStatus.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Este pedido está em um status final e não pode mais ser alterado.
          </p>
        )}
      </Card>
    </div>
  );
}
