import { useMemo } from 'react';
import { FiBox, FiTag, FiClock, FiDollarSign } from 'react-icons/fi';
import { useListarProdutosQuery } from '../../api/produtosApi';
import { useListarCategoriasPublicasQuery } from '../../api/categoriasApi';
import { useListarTodosPedidosAdminQuery } from '../../api/pedidosApi';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { formatarMoeda } from '../../lib/formatMoney';

function CartaoEstatistica({ icone: Icone, rotulo, valor, carregando }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icone size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted">{rotulo}</p>
          {carregando ? (
            <Skeleton className="mt-1 h-6 w-16" />
          ) : (
            <p className="truncate text-xl font-semibold text-ink">{valor}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: produtos, isLoading: carregandoProdutos } = useListarProdutosQuery({ numeroPagina: 0, tamanhoPagina: 1 });
  const { data: categorias, isLoading: carregandoCategorias } = useListarCategoriasPublicasQuery();
  const { data: pedidos, isLoading: carregandoPedidos } = useListarTodosPedidosAdminQuery();

  const { pendentes, receitaTotal } = useMemo(() => {
    if (!pedidos) return { pendentes: 0, receitaTotal: 0 };
    const pendentes = pedidos.filter((p) => p.statusPedido === 'PENDENTE').length;
    const receitaTotal = pedidos
      .filter((p) => p.statusPedido !== 'CANCELADO')
      .reduce((soma, p) => soma + Number(p.valorTotal), 0);
    return { pendentes, receitaTotal };
  }, [pedidos]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Visão geral da loja.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <CartaoEstatistica
          icone={FiBox}
          rotulo="Produtos cadastrados"
          valor={produtos?.totalElementos ?? 0}
          carregando={carregandoProdutos}
        />
        <CartaoEstatistica
          icone={FiTag}
          rotulo="Categorias"
          valor={categorias?.length ?? 0}
          carregando={carregandoCategorias}
        />
        <CartaoEstatistica
          icone={FiClock}
          rotulo="Pedidos pendentes"
          valor={pendentes}
          carregando={carregandoPedidos}
        />
        <CartaoEstatistica
          icone={FiDollarSign}
          rotulo="Receita (não cancelados)"
          valor={formatarMoeda(receitaTotal)}
          carregando={carregandoPedidos}
        />
      </div>
    </div>
  );
}
