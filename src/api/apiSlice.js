import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryComTratamentoDeAuth from '../app/baseQuery';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryComTratamentoDeAuth,
  tagTypes: ['Produto', 'Categoria', 'Carrinho', 'Endereco', 'Pedido'],
  endpoints: () => ({}),
});
