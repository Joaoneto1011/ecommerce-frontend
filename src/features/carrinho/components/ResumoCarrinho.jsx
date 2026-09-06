import { Link } from 'react-router-dom';
import { formatarMoeda } from '../../../lib/formatMoney';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export default function ResumoCarrinho({ precoTotal }) {
  return (
    <Card className="h-fit p-6">
      <h2 className="font-serif text-xl text-ink">Resumo</h2>
      <div className="mt-4 flex items-center justify-between text-sm text-ink-soft">
        <span>Subtotal</span>
        <span>{formatarMoeda(precoTotal)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-ink-soft">
        <span>Frete</span>
        <span>Calculado no checkout</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-base font-semibold text-ink">
        <span>Total</span>
        <span>{formatarMoeda(precoTotal)}</span>
      </div>
      <Link to="/checkout">
        <Button className="mt-6 w-full" tamanho="lg">
          Finalizar compra
        </Button>
      </Link>
    </Card>
  );
}
