import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiGrid, FiBox, FiTag, FiClipboard, FiArrowLeft, FiLogOut } from 'react-icons/fi';
import { sessaoEncerrada, selecionarUsuarioLogado } from '../../auth/authSlice';

const ITENS = [
  { to: '/admin', label: 'Dashboard', icone: FiGrid, fim: true },
  { to: '/admin/produtos', label: 'Produtos', icone: FiBox },
  { to: '/admin/categorias', label: 'Categorias', icone: FiTag },
  { to: '/admin/pedidos', label: 'Pedidos', icone: FiClipboard },
];

export default function AdminSidebar() {
  const usuario = useSelector(selecionarUsuarioLogado);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function sair() {
    dispatch(sessaoEncerrada());
    navigate('/');
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-ink text-white">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="font-serif text-lg font-bold">Point da Chama</p>
        <p className="text-xs text-white/50">Painel administrativo</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {ITENS.map(({ to, label, icone: Icone, fim }) => (
          <NavLink
            key={to}
            to={to}
            end={fim}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icone size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <p className="truncate px-3 py-1 text-xs text-white/50">
          Logado como <span className="text-white/80">{usuario?.nomeUsuario}</span>
        </p>
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
        >
          <FiArrowLeft size={18} /> Voltar à loja
        </NavLink>
        <button
          onClick={sair}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/70 hover:bg-white/10 hover:text-red-300"
        >
          <FiLogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
}
