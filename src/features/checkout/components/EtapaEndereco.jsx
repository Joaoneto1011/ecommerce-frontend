import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import { useListarEnderecosQuery, useCriarEnderecoMutation } from '../../../api/enderecosApi';
import CardEndereco from '../../enderecos/components/CardEndereco';
import FormularioEndereco from '../../enderecos/components/FormularioEndereco';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

export default function EtapaEndereco({ idEnderecoSelecionado, aoSelecionar, aoAvancar }) {
  const { data: enderecos = [], isLoading } = useListarEnderecosQuery();
  const [criarEndereco, { isLoading: criando }] = useCriarEnderecoMutation();
  const [formularioAberto, setFormularioAberto] = useState(false);

  async function salvarNovoEndereco(dados) {
    try {
      const novoEndereco = await criarEndereco(dados).unwrap();
      aoSelecionar(novoEndereco.idEndereco);
      setFormularioAberto(false);
      toast.success('Endereço adicionado!');
    } catch (erro) {
      const erros = erro?.data?.erros;
      if (erros) Object.values(erros).forEach((mensagem) => toast.error(mensagem));
      else toast.error(erro?.data?.mensagem ?? 'Não foi possível salvar o endereço.');
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, indice) => (
          <Skeleton key={indice} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-ink">Endereço de entrega</h2>

      <div className="mt-4 flex flex-col gap-3">
        {enderecos.map((endereco) => (
          <CardEndereco
            key={endereco.idEndereco}
            endereco={endereco}
            selecionado={endereco.idEndereco === idEnderecoSelecionado}
            aoSelecionar={() => aoSelecionar(endereco.idEndereco)}
          />
        ))}
      </div>

      {formularioAberto ? (
        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <FormularioEndereco
            aoSalvar={salvarNovoEndereco}
            carregando={criando}
            aoCancelar={() => setFormularioAberto(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setFormularioAberto(true)}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          <FiPlus size={16} /> Adicionar novo endereço
        </button>
      )}

      <Button className="mt-8 w-full" tamanho="lg" disabled={!idEnderecoSelecionado} onClick={aoAvancar}>
        Continuar para pagamento
      </Button>
    </div>
  );
}
