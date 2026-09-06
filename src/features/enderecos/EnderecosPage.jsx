import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import {
  useListarEnderecosQuery,
  useCriarEnderecoMutation,
  useAtualizarEnderecoMutation,
  useExcluirEnderecoMutation,
} from '../../api/enderecosApi';
import CardEndereco from './components/CardEndereco';
import FormularioEndereco from './components/FormularioEndereco';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

export default function EnderecosPage() {
  const { data: enderecos = [], isLoading } = useListarEnderecosQuery();
  const [criarEndereco, { isLoading: criando }] = useCriarEnderecoMutation();
  const [atualizarEndereco, { isLoading: atualizando }] = useAtualizarEnderecoMutation();
  const [excluirEndereco] = useExcluirEnderecoMutation();

  const [modalAberto, setModalAberto] = useState(false);
  const [enderecoEmEdicao, setEnderecoEmEdicao] = useState(null);

  function abrirParaCriar() {
    setEnderecoEmEdicao(null);
    setModalAberto(true);
  }

  function abrirParaEditar(endereco) {
    setEnderecoEmEdicao(endereco);
    setModalAberto(true);
  }

  async function salvar(dados) {
    try {
      if (enderecoEmEdicao) {
        await atualizarEndereco({ idEndereco: enderecoEmEdicao.idEndereco, ...dados }).unwrap();
        toast.success('Endereço atualizado!');
      } else {
        await criarEndereco(dados).unwrap();
        toast.success('Endereço adicionado!');
      }
      setModalAberto(false);
    } catch (erro) {
      const erros = erro?.data?.erros;
      if (erros) Object.values(erros).forEach((mensagem) => toast.error(mensagem));
      else toast.error(erro?.data?.mensagem ?? 'Não foi possível salvar o endereço.');
    }
  }

  async function excluir(idEndereco) {
    try {
      await excluirEndereco(idEndereco).unwrap();
      toast.success('Endereço excluído.');
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível excluir o endereço.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Meus endereços</h1>
        <Button onClick={abrirParaCriar}>
          <FiPlus size={16} /> Novo endereço
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-8 flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, indice) => (
            <Skeleton key={indice} className="h-20 w-full" />
          ))}
        </div>
      ) : enderecos.length ? (
        <div className="mt-8 flex flex-col gap-3">
          {enderecos.map((endereco) => (
            <CardEndereco
              key={endereco.idEndereco}
              endereco={endereco}
              aoEditar={() => abrirParaEditar(endereco)}
              aoExcluir={() => excluir(endereco.idEndereco)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted">Você ainda não cadastrou nenhum endereço.</p>
      )}

      <Modal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo={enderecoEmEdicao ? 'Editar endereço' : 'Novo endereço'}
      >
        <FormularioEndereco
          enderecoInicial={enderecoEmEdicao}
          aoSalvar={salvar}
          carregando={criando || atualizando}
          aoCancelar={() => setModalAberto(false)}
        />
      </Modal>
    </div>
  );
}
