const formatador = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

export function formatarData(data) {
  if (!data) return '';
  const dataObj = typeof data === 'string' ? new Date(`${data}T00:00:00`) : data;
  return formatador.format(dataObj);
}
