import { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import DisclaimerDemo from './DisclaimerDemo';

const METODOS = [
  { valor: 'cartao_credito', rotulo: 'Cartão de crédito' },
  { valor: 'pix', rotulo: 'Pix' },
  { valor: 'boleto', rotulo: 'Boleto' },
];

export default function EtapaPagamento({ metodo, aoMudarMetodo, aoVoltar, aoFinalizar, carregando }) {
  const [numeroCartao, setNumeroCartao] = useState('');

  return (
    <div>
      <h2 className="font-serif text-xl text-ink">Forma de pagamento</h2>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {METODOS.map((item) => (
          <button
            key={item.valor}
            onClick={() => aoMudarMetodo(item.valor)}
            className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
              metodo === item.valor
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-border text-ink-soft hover:border-ink/20'
            }`}
          >
            {item.rotulo}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {metodo === 'cartao_credito' && (
          <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-ink-soft">
              <FiCreditCard size={18} />
              <span className="text-sm">Esta é uma simulação — qualquer número de 16 dígitos é aceito.</span>
            </div>
            <Input
              label="Número do cartão"
              inputMode="numeric"
              maxLength={19}
              placeholder="0000 0000 0000 0000"
              value={numeroCartao}
              onChange={(e) =>
                setNumeroCartao(
                  e.target.value
                    .replace(/[^\d]/g, '')
                    .replace(/(.{4})/g, '$1 ')
                    .trim()
                )
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Validade" placeholder="MM/AA" />
              <Input label="CVV" placeholder="123" maxLength={4} />
            </div>
          </div>
        )}
        {metodo === 'pix' && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border p-8 text-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-black/5 text-xs text-muted">
              QR Code simulado
            </div>
            <p className="text-sm text-muted">Escaneie o código para simular o pagamento via Pix.</p>
          </div>
        )}
        {metodo === 'boleto' && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border p-8 text-center">
            <div className="flex h-16 w-full items-center justify-center rounded-lg bg-black/5 text-xs tracking-widest text-muted">
              ||| || ||| | |||| || |||
            </div>
            <p className="text-sm text-muted">Boleto simulado — gerado apenas para fins de demonstração.</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <DisclaimerDemo />
      </div>

      <div className="mt-6 flex gap-3">
        <Button variante="outline" onClick={aoVoltar}>
          Voltar
        </Button>
        <Button className="flex-1" tamanho="lg" onClick={aoFinalizar} carregando={carregando}>
          Concluir pedido
        </Button>
      </div>
    </div>
  );
}
