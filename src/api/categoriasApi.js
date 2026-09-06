import { apiSlice } from './apiSlice';

export const categoriasApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listarCategoriasPublicas: builder.query({
      query: () => '/public/categorias',
      providesTags: [{ type: 'Categoria', id: 'LIST' }],
    }),

    // --- endpoints de administração ---
    // Nota: /categorias hoje exige só estar autenticado, não necessariamente ser admin
    // (restrição existe apenas na UI do painel, não no backend).
    criarCategoria: builder.mutation({
      query: (dados) => ({ url: '/categorias', method: 'POST', body: dados }),
      invalidatesTags: [{ type: 'Categoria', id: 'LIST' }],
    }),
    atualizarCategoria: builder.mutation({
      query: ({ idCategoria, ...dados }) => ({
        url: `/categorias/${idCategoria}`,
        method: 'PUT',
        body: dados,
      }),
      invalidatesTags: [{ type: 'Categoria', id: 'LIST' }],
    }),
    excluirCategoria: builder.mutation({
      query: (idCategoria) => ({ url: `/categorias/${idCategoria}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Categoria', id: 'LIST' }],
    }),
  }),
});

export const {
  useListarCategoriasPublicasQuery,
  useCriarCategoriaMutation,
  useAtualizarCategoriaMutation,
  useExcluirCategoriaMutation,
} = categoriasApi;
