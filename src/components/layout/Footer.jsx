import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-serif text-xl font-bold text-ink">Point da Chama</p>
            <p className="mt-1 text-sm font-medium text-brand-600">Lanches no ponto certo.</p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Projeto de portfólio: loja completa consumindo uma API Spring Boot real
              (catálogo, carrinho, checkout e pedidos).
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-ink">Navegação</span>
              <Link to="/" className="text-muted hover:text-ink">Início</Link>
              <Link to="/produtos" className="text-muted hover:text-ink">Cardápio</Link>
              <Link to="/pedidos" className="text-muted hover:text-ink">Meus pedidos</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          <p>
            Ambiente de demonstração — nenhum pagamento real é processado.
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Point da Chama. Projeto de portfólio.</p>
        </div>
      </div>
    </footer>
  );
}
