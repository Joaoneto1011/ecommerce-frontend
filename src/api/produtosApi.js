import { apiSlice } from './apiSlice';

export const produtosApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint único e flexível (/public/produtos) cobre busca + categoria + ordenação
    // + paginação ao mesmo tempo, e nunca lança erro em resultado vazio (conteudo: []) —
    // por isso é preferido aqui em vez dos endpoints dedicados de categoria/palavra-chave,
    // que retornam 400 quando não há resultado (bom para uso avulso, ruim para uma tela
        // de listagem com filtros combináveis).
    listarProdutos: builder.query({
      query: (params = {}) => ({ url: '/public/produtos', params }),
      providesTags: (result) =>
        result?.conteudo
          ? [
              ...result.conteudo.map(({ idProduto }) => ({ type: 'Produto', id: idProduto })),
              { type: 'Produto', id: 'LIST' },
            ]
          : [{ type: 'Produto', id: 'LIST' }],
    }),
    buscarProdutoPorId: builder.query({
      query: (idProduto) => `/public/produtos/${idProduto}`,
      providesTags: (result, error, idProduto) => [{ type: 'Produto', id: idProduto }],
    }),

    // --- endpoints de administração ---
    criarProduto: builder.mutation({
      query: ({ idCategoria, ...dados }) => ({
        url: `/administrador/categorias/${idCategoria}/produto`,
        method: 'POST',
        body: dados,
      }),
      invalidatesTags: [{ type: 'Produto', id: 'LIST' }],
    }),
    atualizarProduto: builder.mutation({
      query: ({ idProduto, ...dados }) => ({
        url: `/administrador/produtos/${idProduto}`,
        method: 'PUT',
        body: dados,
      }),
      invalidatesTags: (result, error, { idProduto }) => [
        { type: 'Produto', id: idProduto },
        { type: 'Produto', id: 'LIST' },
      ],
    }),
    excluirProduto: builder.mutation({
      query: (idProduto) => ({ url: `/administrador/produtos/${idProduto}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Produto', id: 'LIST' }],
    }),
    uploadImagemProduto: builder.mutation({
      query: ({ idProduto, arquivo }) => {
        const form = new FormData();
        form.append('imagem', arquivo);
        return { url: `/administrador/produtos/${idProduto}/imagem`, method: 'PUT', body: form };
      },
      invalidatesTags: (result, error, { idProduto }) => [
        { type: 'Produto', id: idProduto },
        { type: 'Produto', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListarProdutosQuery,
  useBuscarProdutoPorIdQuery,
  useCriarProdutoMutation,
  useAtualizarProdutoMutation,
  useExcluirProdutoMutation,
  useUploadImagemProdutoMutation,
} = produtosApi;
