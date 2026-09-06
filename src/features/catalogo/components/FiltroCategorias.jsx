import Select from '../../../components/ui/Select';
import { useListarCategoriasPublicasQuery } from '../../../api/categoriasApi';

export default function FiltroCategorias({ valor, aoMudar }) {
  const { data: categorias = [] } = useListarCategoriasPublicasQuery();

  return (
    <Select value={valor} onChange={(e) => aoMudar(e.target.value)} aria-label="Filtrar por categoria">
      <option value="">Todas as categorias</option>
      {categorias.map((categoria) => (
        <option key={categoria.idCategoria} value={categoria.nomeCategoria}>
          {categoria.nomeCategoria}
        </option>
      ))}
    </Select>
  );
}
