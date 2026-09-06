import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiPackage, FiMapPin, FiLogOut, FiSettings } from 'react-icons/fi';
import {
  selecionarEstaAutenticado,
  selecionarUsuarioLogado,
  selecionarEhAdministrador,
  sessaoEncerrada,
} from '../../features/auth/authSlice';
import { useObterCarrinhoQuery } from '../../api/carrinhoApi';

export default function Header() {
  const estaAutenticado = useSelector(selecionarEstaAutenticado);
  const usuario = useSelector(selecionarUsuarioLogado);
  const ehAdministrador = useSelector(selecionarEhAdministrador);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuAbertoMobile, setMenuAbertoMobile] = useState(false);
  const [busca, setBusca] = useState('');

  const { data: carrinho } = useObterCarrinhoQuery(undefined, { skip: !estaAutenticado || ehAdministrador });
  const quantidadeNoCarrinho = carrinho?.itens?.reduce((total, item) => total + item.quantidade, 0) ?? 0;

  function aoBuscar(evento) {
    evento.preventDefault();
    navigate(busca.trim() ? `/produtos?palavraChave=${encodeURIComponent(busca.trim())}` : '/produtos');
    setMenuAbertoMobile(false);
  }

  function sair() {
    dispatch(sessaoEncerrada());
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 font-serif text-2xl font-bold tracking-tight text-ink">
          Point da Chama
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
          <Link to="/" className="hover:text-ink">Início</Link>
          <Link to="/produtos" className="hover:text-ink">Cardápio</Link>
        </nav>

        <form onSubmit={aoBuscar} className="relative ml-auto hidden max-w-sm flex-1 md:block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            type="search"
            placeholder="Buscar no cardápio"
            className="w-full rounded-full border border-border bg-canvas py-2 pl-9 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {!ehAdministrador && (
            <Link
              to="/carrinho"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-black/5 hover:text-ink"
              aria-label="Carrinho"
            >
              <FiShoppingBag size={20} />
              {quantidadeNoCarrinho > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                  {quantidadeNoCarrinho}
                </span>
              )}
            </Link>
          )}

          {estaAutenticado ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-black/5 hover:text-ink">
                <FiUser size={20} />
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                className="z-50 mt-2 w-56 origin-top-right rounded-xl border border-border bg-surface p-1.5 shadow-lg focus:outline-none"
              >
                <div className="px-3 py-2 text-sm text-muted">
                  Olá, <span className="font-medium text-ink">{usuario?.nomeUsuario}</span>
                </div>
                {!ehAdministrador && (
                  <>
                    <MenuItem>
                      <Link to="/pedidos" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-soft data-focus:bg-black/5">
                        <FiPackage size={16} /> Meus pedidos
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/enderecos" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-soft data-focus:bg-black/5">
                        <FiMapPin size={16} /> Meus endereços
                      </Link>
                    </MenuItem>
                  </>
                )}
                {ehAdministrador && (
                  <MenuItem>
                    <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-600 data-focus:bg-brand-50">
                      <FiSettings size={16} /> Painel administrativo
                    </Link>
                  </MenuItem>
                )}
                <MenuItem>
                  <button onClick={sair} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger data-focus:bg-danger-bg">
                    <FiLogOut size={16} /> Sair
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Entrar
            </Link>
          )}

          <button
            onClick={() => setMenuAbertoMobile((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-black/5 md:hidden"
            aria-label="Menu"
          >
            {menuAbertoMobile ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {menuAbertoMobile && (
        <div className="border-t border-border px-4 pb-4 pt-2 md:hidden">
          <form onSubmit={aoBuscar} className="relative mb-3">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              type="search"
              placeholder="Buscar no cardápio"
              className="w-full rounded-full border border-border bg-canvas py-2 pl-9 pr-4 text-sm outline-none"
            />
          </form>
          <nav className="flex flex-col gap-1 text-sm font-medium text-ink-soft">
            <Link to="/" onClick={() => setMenuAbertoMobile(false)} className="rounded-lg px-2 py-2 hover:bg-black/5">Início</Link>
            <Link to="/produtos" onClick={() => setMenuAbertoMobile(false)} className="rounded-lg px-2 py-2 hover:bg-black/5">Cardápio</Link>
            {ehAdministrador && (
              <Link to="/admin" onClick={() => setMenuAbertoMobile(false)} className="rounded-lg px-2 py-2 text-brand-600 hover:bg-black/5">Painel administrativo</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
