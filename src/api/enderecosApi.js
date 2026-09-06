import { apiSlice } from './apiSlice';

export const enderecosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listarEnderecos: builder.query({
      query: () => '/enderecos/usuarios',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ idEndereco }) => ({ type: 'Endereco', id: idEndereco })),
              { type: 'Endereco', id: 'LIST' },
            ]
          : [{ type: 'Endereco', id: 'LIST' }],
    }),
    criarEndereco: builder.mutation({
      query: (endereco) => ({ url: '/enderecos', method: 'POST', body: endereco }),
      invalidatesTags: [{ type: 'Endereco', id: 'LIST' }],
    }),
    atualizarEndereco: builder.mutation({
      query: ({ idEndereco, ...dados }) => ({
        url: `/enderecos/${idEndereco}`,
        method: 'PUT',
        body: dados,
      }),
      invalidatesTags: (result, error, { idEndereco }) => [{ type: 'Endereco', id: idEndereco }],
    }),
    excluirEndereco: builder.mutation({
      query: (idEndereco) => ({ url: `/enderecos/${idEndereco}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Endereco', id: 'LIST' }],
    }),
  }),
});

export const {
  useListarEnderecosQuery,
  useCriarEnderecoMutation,
  useAtualizarEnderecoMutation,
  useExcluirEnderecoMutation,
} = enderecosApi;
