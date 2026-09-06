import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RotaProtegida from '../features/auth/RotaProtegida';
import LoginPage from '../features/auth/LoginPage';
import CadastroPage from '../features/auth/CadastroPage';
import HomePage from '../features/catalogo/HomePage';
import ProdutosPage from '../features/catalogo/ProdutosPage';
import ProdutoDetalhePage from '../features/catalogo/ProdutoDetalhePage';
import CarrinhoPage from '../features/carrinho/CarrinhoPage';
import EnderecosPage from '../features/enderecos/EnderecosPage';
import CheckoutPage from '../features/checkout/CheckoutPage';
import PedidosPage from '../features/pedidos/PedidosPage';
import PedidoDetalhePage from '../features/pedidos/PedidoDetalhePage';
import RotaAdmin from '../features/admin/RotaAdmin';
import AdminLayout from '../features/admin/layout/AdminLayout';
import DashboardPage from '../features/admin/DashboardPage';
import ProdutosAdminPage from '../features/admin/produtos/ProdutosAdminPage';
import ProdutoFormPage from '../features/admin/produtos/ProdutoFormPage';
import CategoriasAdminPage from '../features/admin/categorias/CategoriasAdminPage';
import PedidosAdminPage from '../features/admin/pedidos/PedidosAdminPage';
import PedidoDetalheAdminPage from '../features/admin/pedidos/PedidoDetalheAdminPage';
import NaoEncontradoPage from './NaoEncontradoPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/produtos', element: <ProdutosPage /> },
      { path: '/produto/:idProduto', element: <ProdutoDetalhePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/cadastro', element: <CadastroPage /> },
      {
        element: <RotaProtegida />,
        children: [
          { path: '/carrinho', element: <CarrinhoPage /> },
          { path: '/enderecos', element: <EnderecosPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/pedidos', element: <PedidosPage /> },
          { path: '/pedidos/:idPedido', element: <PedidoDetalhePage /> },
        ],
      },
      { path: '*', element: <NaoEncontradoPage /> },
    ],
  },
  {
    element: <RotaAdmin />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'produtos', element: <ProdutosAdminPage /> },
          { path: 'produtos/novo', element: <ProdutoFormPage /> },
          { path: 'produtos/:idProduto/editar', element: <ProdutoFormPage /> },
          { path: 'categorias', element: <CategoriasAdminPage /> },
          { path: 'pedidos', element: <PedidosAdminPage /> },
          { path: 'pedidos/:idPedido', element: <PedidoDetalheAdminPage /> },
        ],
      },
    ],
  },
]);
