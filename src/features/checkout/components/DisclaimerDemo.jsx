import { FiInfo } from 'react-icons/fi';

export default function DisclaimerDemo() {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-700">
      <FiInfo className="mt-0.5 shrink-0" size={16} />
      <p>Ambiente de demonstração — nenhum pagamento real é processado.</p>
    </div>
  );
}
