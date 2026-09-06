import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selecionarEstaAutenticado, selecionarEhAdministrador } from './authSlice';

export default function RotaProtegida() {
  const estaAutenticado = useSelector(selecionarEstaAutenticado);
  const ehAdministrador = useSelector(selecionarEhAdministrador);
  const location = useLocation();

  if (!estaAutenticado) {
    return <Navigate to="/login" state={{ de: location }} replace />;
  }

  // Carrinho, endereços e pedidos são fluxos de cliente — o admin gerencia
  // a loja pelo painel, não compra nela.
  if (ehAdministrador) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
