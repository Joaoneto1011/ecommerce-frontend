import { apiSlice } from './apiSlice';

export const autenticacaoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credenciais) => ({ url: '/autenticacao/entrar', method: 'POST', body: credenciais }),
    }),
    cadastrar: builder.mutation({
      query: (dados) => ({ url: '/autenticacao/cadastrar', method: 'POST', body: dados }),
    }),
  }),
});

export const { useLoginMutation, useCadastrarMutation } = autenticacaoApi;
