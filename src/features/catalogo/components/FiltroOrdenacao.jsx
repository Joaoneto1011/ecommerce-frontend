import Select from '../../../components/ui/Select';

const OPCOES = [
  { valor: 'preco-asc', rotulo: 'Menor preço', ordenarPor: 'preco', ordem: 'asc' },
  { valor: 'preco-desc', rotulo: 'Maior preço', ordenarPor: 'preco', ordem: 'desc' },
  { valor: 'nomeProduto-asc', rotulo: 'Nome (A-Z)', ordenarPor: 'nomeProduto', ordem: 'asc' },
];

export function resolverOrdenacao(valor) {
  const opcao = OPCOES.find((o) => o.valor === valor) ?? OPCOES[0];
  return { ordenarPorProduto: opcao.ordenarPor, classificarOrdem: opcao.ordem };
}

export default function FiltroOrdenacao({ valor, aoMudar }) {
  return (
    <Select value={valor} onChange={(e) => aoMudar(e.target.value)} aria-label="Ordenar por">
      {OPCOES.map((opcao) => (
        <option key={opcao.valor} value={opcao.valor}>
          {opcao.rotulo}
        </option>
      ))}
    </Select>
  );
}
