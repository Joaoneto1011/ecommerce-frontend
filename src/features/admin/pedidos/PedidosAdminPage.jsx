import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { useListarTodosPedidosAdminQuery, useAtualizarStatusPedidoMutation } from '../../../api/pedidosApi';
import { formatarMoeda } from '../../../lib/formatMoney';
import { formatarData } from '../../../lib/formatDate';
import BadgeStatusPedido from '../../pedidos/components/BadgeStatusPedido';
import Select from '../../../components/ui/Select';
import Skeleton from '../../../components/ui/Skeleton';

const PROXIMOS_STATUS = {
  PENDENTE: ['PAGO', 'CANCELADO'],
  PAGO: ['ENVIADO', 'CANCELADO'],
  ENVIADO: ['ENTREGUE'],
  ENTREGUE: [],
  CANCELADO: [],
};

export default function PedidosAdminPage() {
  const { data: pedidos = [], isLoading } = useListarTodosPedidosAdminQuery();
  const [atualizarStatus] = useAtualizarStatusPedidoMutation();

  async function mudarStatus(idPedido, novoStatus, elementoSelect) {
    if (!novoStatus) return;
    try {
      await atualizarStatus({ idPedido, novoStatus }).unwrap();
      toast.success(`Pedido #${idPedido} atualizado para ${novoStatus}.`);
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível atualizar o status.');
    } finally {
      if (elementoSelect) elementoSelect.value = '';
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Pedidos</h1>
      <p className="mt-1 text-sm text-muted">{pedidos.length} pedido(s) no total</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
        {isLoading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 5 }).map((_, indice) => (
              <Skeleton key={indice} className="h-12 w-full" />
            ))}
          </div>
        ) : pedidos.length ? (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Avançar status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pedidos.map((pedido) => {
                const opcoes = PROXIMOS_STATUS[pedido.statusPedido] ?? [];
                return (
                  <tr key={pedido.idPedido}>
                    <td className="px-4 py-3 font-medium text-ink">
                      <Link to={`/admin/pedidos/${pedido.idPedido}`} className="hover:text-brand-600 hover:underline">
                        #{pedido.idPedido}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{pedido.email}</td>
                    <td className="px-4 py-3 text-ink-soft">{formatarData(pedido.dataDoPedido)}</td>
                    <td className="px-4 py-3 text-ink-soft">{formatarMoeda(pedido.valorTotal)}</td>
                    <td className="px-4 py-3">
                      <BadgeStatusPedido status={pedido.statusPedido} />
                    </td>
                    <td className="px-4 py-3">
                      {opcoes.length > 0 ? (
                        <Select
                          defaultValue=""
                          onChange={(e) => mudarStatus(pedido.idPedido, e.target.value, e.target)}
                          className="min-w-[10rem]"
                        >
                          <option value="" disabled>
                            Alterar para...
                          </option>
                          {opcoes.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/pedidos/${pedido.idPedido}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-black/5 hover:text-ink"
                        aria-label="Ver detalhes do pedido"
                      >
                        <FiEye size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-sm text-muted">Nenhum pedido registrado ainda.</p>
        )}
      </div>
    </div>
  );
}
