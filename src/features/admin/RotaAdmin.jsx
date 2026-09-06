import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selecionarEstaAutenticado, selecionarEhAdministrador } from '../auth/authSlice';

export default function RotaAdmin() {
  const estaAutenticado = useSelector(selecionarEstaAutenticado);
  const ehAdministrador = useSelector(selecionarEhAdministrador);

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (!ehAdministrador) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
