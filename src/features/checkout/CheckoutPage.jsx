import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useObterCarrinhoQuery } from '../../api/carrinhoApi';
import { useCriarPedidoMutation } from '../../api/pedidosApi';
import EtapaEndereco from './components/EtapaEndereco';
import EtapaPagamento from './components/EtapaPagamento';
import EtapaConfirmacao from './components/EtapaConfirmacao';
import { formatarMoeda } from '../../lib/formatMoney';

const ETAPAS = ['Endereço', 'Pagamento', 'Confirmação'];

export default function CheckoutPage() {
  const { data: carrinho, isLoading } = useObterCarrinhoQuery();
  const [criarPedido, { isLoading: finalizando }] = useCriarPedidoMutation();

  const [etapa, setEtapa] = useState(0);
  const [idEndereco, setIdEndereco] = useState(null);
  const [metodo, setMetodo] = useState('cartao_credito');
  const [pedidoCriado, setPedidoCriado] = useState(null);

  if (!isLoading && !carrinho?.itens?.length && !pedidoCriado) {
    return <Navigate to="/carrinho" replace />;
  }

  async function finalizarPedido() {
    try {
      const pedido = await criarPedido({
        metodoDePagamento: metodo,
        idEndereco,
        nomeGateway: 'Simulação Aurora',
        idPagamentoGateway: `sim_${Date.now()}`,
        statusGateway: 'aprovado',
        mensagemRespostaGateway: 'Pagamento simulado aprovado',
      }).unwrap();
      setPedidoCriado(pedido);
      setEtapa(2);
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível concluir o pedido.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-ink">Finalizar compra</h1>

      <ol className="mt-6 flex items-center gap-2 text-sm">
        {ETAPAS.map((rotulo, indice) => (
          <li key={rotulo} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                indice <= etapa ? 'bg-brand-500 text-white' : 'bg-black/5 text-muted'
              }`}
            >
              {indice + 1}
            </span>
            <span className={indice <= etapa ? 'font-medium text-ink' : 'text-muted'}>{rotulo}</span>
            {indice < ETAPAS.length - 1 && <span className="mx-2 h-px w-8 bg-border" />}
          </li>
        ))}
      </ol>

      {!isLoading && carrinho && etapa !== 2 && (
        <p className="mt-4 text-sm text-muted">
          {carrinho.itens.length} item(ns) no carrinho — total {formatarMoeda(carrinho.precoTotal)}
        </p>
      )}

      <div className="mt-8">
        {etapa === 0 && (
          <EtapaEndereco idEnderecoSelecionado={idEndereco} aoSelecionar={setIdEndereco} aoAvancar={() => setEtapa(1)} />
        )}
        {etapa === 1 && (
          <EtapaPagamento
            metodo={metodo}
            aoMudarMetodo={setMetodo}
            aoVoltar={() => setEtapa(0)}
            aoFinalizar={finalizarPedido}
            carregando={finalizando}
          />
        )}
        {etapa === 2 && pedidoCriado && <EtapaConfirmacao pedido={pedidoCriado} />}
      </div>
    </div>
  );
}
