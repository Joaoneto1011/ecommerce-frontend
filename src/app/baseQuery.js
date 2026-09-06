import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { sessaoEncerrada, selecionarToken } from '../features/auth/authSlice';

// O token JWT é enviado via header Authorization (não via cookie httpOnly, que o
// backend também suporta). Escolha deliberada: este frontend é hospedado em domínio
// diferente do backend em produção, e cookies cross-site exigem SameSite=None + Secure
// e configuração extra que não compensa a complexidade para um projeto de portfólio.
const baseQueryBase = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = selecionarToken(getState());
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Qualquer 401 (token ausente/expirado/inválido) encerra a sessão local — sem isso,
// uma requisição autenticada falha silenciosamente sem caminho de recuperação para o usuário.
const baseQueryComTratamentoDeAuth = async (args, api, extraOptions) => {
  const resultado = await baseQueryBase(args, api, extraOptions);

  if (resultado.error?.status === 401) {
    api.dispatch(sessaoEncerrada());
  }

  return resultado;
};

export default baseQueryComTratamentoDeAuth;
