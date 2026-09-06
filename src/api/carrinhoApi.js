import { apiSlice } from './apiSlice';

// O backend não tem conceito de carrinho anônimo/guest: GET /carrinhos/usuarios/carrinho
// retorna 404 quando o usuário logado nunca adicionou nada. Isso é tratado aqui, na
// camada de dados, como "carrinho vazio" — nunca deve virar um erro/toast na UI.
const CARRINHO_VAZIO = { idCarrinho: null, precoTotal: 0, itens: [] };

export const carrinhoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    obterCarrinho: builder.query({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const resultado = await baseQuery('/carrinhos/usuarios/carrinho');

        if (resultado.error) {
          if (resultado.error.status === 404) {
            return { data: CARRINHO_VAZIO };
          }
          return { error: resultado.error };
        }

        return { data: resultado.data };
      },
      providesTags: ['Carrinho'],
    }),
    adicionarAoCarrinho: builder.mutation({
      query: ({ idProduto, quantidade }) => ({
        url: `/carrinhos/produtos/${idProduto}/quantidade/${quantidade}`,
        method: 'POST',
      }),
      invalidatesTags: ['Carrinho'],
    }),
    atualizarQuantidadeNoCarrinho: builder.mutation({
      query: ({ idProduto, operacao }) => ({
        url: `/carrinhos/produtos/${idProduto}/quantidade/${operacao}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Carrinho'],
    }),
    removerDoCarrinho: builder.mutation({
      query: ({ idCarrinho, idProduto }) => ({
        url: `/carrinhos/${idCarrinho}/produto/${idProduto}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Carrinho'],
    }),
  }),
});

export const {
  useObterCarrinhoQuery,
  useAdicionarAoCarrinhoMutation,
  useAtualizarQuantidadeNoCarrinhoMutation,
  useRemoverDoCarrinhoMutation,
} = carrinhoApi;
