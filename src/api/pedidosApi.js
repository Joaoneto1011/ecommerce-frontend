import { apiSlice } from './apiSlice';

export const pedidosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listarPedidos: builder.query({
      query: () => '/pedidos/usuarios',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ idPedido }) => ({ type: 'Pedido', id: idPedido })),
              { type: 'Pedido', id: 'LIST' },
            ]
          : [{ type: 'Pedido', id: 'LIST' }],
    }),
    // O backend nunca marca o pedido como PAGO a partir do que o cliente envia aqui —
    // ele sempre nasce PENDENTE. Os campos de gateway são apenas informativos (auditoria).
    criarPedido: builder.mutation({
      query: ({ metodoDePagamento, ...dados }) => ({
        url: `/pedido/usuarios/pagamentos/${metodoDePagamento}`,
        method: 'POST',
        body: dados,
      }),
      invalidatesTags: [{ type: 'Pedido', id: 'LIST' }, 'Carrinho'],
    }),

    // --- endpoints de administração ---
    listarTodosPedidosAdmin: builder.query({
      query: () => '/administrador/pedidos',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ idPedido }) => ({ type: 'Pedido', id: idPedido })),
              { type: 'Pedido', id: 'LIST' },
            ]
          : [{ type: 'Pedido', id: 'LIST' }],
    }),
    atualizarStatusPedido: builder.mutation({
      query: ({ idPedido, novoStatus }) => ({
        url: `/administrador/pedidos/${idPedido}/status`,
        method: 'PUT',
        body: { novoStatus },
      }),
      invalidatesTags: (result, error, { idPedido }) => [
        { type: 'Pedido', id: idPedido },
        { type: 'Pedido', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListarPedidosQuery,
  useCriarPedidoMutation,
  useListarTodosPedidosAdminQuery,
  useAtualizarStatusPedidoMutation,
} = pedidosApi;
