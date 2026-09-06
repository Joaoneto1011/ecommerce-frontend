import { Link } from 'react-router-dom';
import { formatarMoeda } from '../../../lib/formatMoney';
import Badge from '../../../components/ui/Badge';

export default function CardProduto({ produto }) {
  const temDesconto = Number(produto.desconto) > 0;
  const disponivel = Number(produto.quantidadeEstoque) > 0;

  return (
    <Link to={`/produto/${produto.idProduto}`} className="group flex flex-col">
      <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-black/5">
        <img
          src={produto.imagem}
          alt={produto.nomeProduto}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {temDesconto && (
          <Badge variante="brand" className="absolute left-3 top-3">
            -{Number(produto.desconto)}%
          </Badge>
        )}
        {!disponivel && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Badge variante="neutral">Indisponível</Badge>
          </div>
        )}
      </div>
      <h3 className="mt-3 line-clamp-1 text-sm font-medium text-ink">{produto.nomeProduto}</h3>
      <div className="mt-1 flex items-center gap-2">
        {temDesconto ? (
          <>
            <span className="text-sm text-muted line-through">{formatarMoeda(produto.preco)}</span>
            <span className="font-medium text-ink">{formatarMoeda(produto.precoEspecial)}</span>
          </>
        ) : (
          <span className="font-medium text-ink">{formatarMoeda(produto.preco)}</span>
        )}
      </div>
    </Link>
  );
}
