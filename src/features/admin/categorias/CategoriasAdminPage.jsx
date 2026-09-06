import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  useListarCategoriasPublicasQuery,
  useCriarCategoriaMutation,
  useAtualizarCategoriaMutation,
  useExcluirCategoriaMutation,
} from '../../../api/categoriasApi';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

export default function CategoriasAdminPage() {
  const { data: categorias = [], isLoading } = useListarCategoriasPublicasQuery();
  const [criarCategoria, { isLoading: criando }] = useCriarCategoriaMutation();
  const [atualizarCategoria, { isLoading: atualizando }] = useAtualizarCategoriaMutation();
  const [excluirCategoria] = useExcluirCategoriaMutation();

  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState(null);
  const [nome, setNome] = useState('');

  function abrirParaCriar() {
    setCategoriaEmEdicao(null);
    setNome('');
    setModalAberto(true);
  }

  function abrirParaEditar(categoria) {
    setCategoriaEmEdicao(categoria);
    setNome(categoria.nomeCategoria);
    setModalAberto(true);
  }

  async function salvar(evento) {
    evento.preventDefault();
    try {
      if (categoriaEmEdicao) {
        await atualizarCategoria({ idCategoria: categoriaEmEdicao.idCategoria, nomeCategoria: nome }).unwrap();
        toast.success('Categoria atualizada!');
      } else {
        await criarCategoria({ nomeCategoria: nome }).unwrap();
        toast.success('Categoria criada!');
      }
      setModalAberto(false);
    } catch (erro) {
      const erros = erro?.data?.erros;
      if (erros) Object.values(erros).forEach((mensagem) => toast.error(mensagem));
      else toast.error(erro?.data?.mensagem ?? 'Não foi possível salvar a categoria.');
    }
  }

  async function excluir(categoria) {
    if (
      !window.confirm(
        `Excluir a categoria "${categoria.nomeCategoria}"? Só é possível se não houver produtos vinculados.`
      )
    )
      return;
    try {
      await excluirCategoria(categoria.idCategoria).unwrap();
      toast.success('Categoria excluída.');
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível excluir a categoria.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">Categorias</h1>
          <p className="mt-1 text-sm text-muted">{categorias.length} categoria(s) cadastrada(s)</p>
        </div>
        <Button onClick={abrirParaCriar}>
          <FiPlus size={16} /> Nova categoria
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, indice) => <Skeleton key={indice} className="h-14 w-full" />)
          : categorias.map((categoria) => (
              <div
                key={categoria.idCategoria}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-4"
              >
                <span className="font-medium text-ink">{categoria.nomeCategoria}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => abrirParaEditar(categoria)}
                    className="rounded-lg p-2 text-muted hover:bg-black/5 hover:text-ink"
                    aria-label="Editar"
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    onClick={() => excluir(categoria)}
                    className="rounded-lg p-2 text-muted hover:bg-danger-bg hover:text-danger"
                    aria-label="Excluir"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
      </div>

      <Modal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo={categoriaEmEdicao ? 'Editar categoria' : 'Nova categoria'}
      >
        <form onSubmit={salvar} className="flex flex-col gap-4">
          <Input
            label="Nome da categoria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            minLength={5}
            maxLength={50}
            required
          />
          <div className="flex justify-end gap-3">
            <Button variante="ghost" type="button" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" carregando={criando || atualizando}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
