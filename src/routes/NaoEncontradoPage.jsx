import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NaoEncontradoPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="font-serif text-6xl text-ink">404</p>
      <p className="mt-4 text-lg font-medium text-ink">Página não encontrada</p>
      <p className="mt-2 text-sm text-muted">O endereço que você tentou acessar não existe.</p>
      <Link to="/">
        <Button className="mt-6">Voltar para a home</Button>
      </Link>
    </div>
  );
}
