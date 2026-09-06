const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatarMoeda(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return formatador.format(0);
  return formatador.format(numero);
}
