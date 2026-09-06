import Badge from '../../../components/ui/Badge';

const CONFIG = {
  PENDENTE: { variante: 'neutral', rotulo: 'Pendente' },
  PAGO: { variante: 'success', rotulo: 'Pago' },
  ENVIADO: { variante: 'brand', rotulo: 'Enviado' },
  ENTREGUE: { variante: 'success', rotulo: 'Entregue' },
  CANCELADO: { variante: 'danger', rotulo: 'Cancelado' },
};

export default function BadgeStatusPedido({ status }) {
  const config = CONFIG[status] ?? { variante: 'neutral', rotulo: status };
  return <Badge variante={config.variante}>{config.rotulo}</Badge>;
}
