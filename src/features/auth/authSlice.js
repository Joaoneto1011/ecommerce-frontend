import { createSlice } from '@reduxjs/toolkit';

const usuarioSalvo = localStorage.getItem('ecommerce-loja.usuario');

const initialState = {
  token: localStorage.getItem('ecommerce-loja.token') || null,
  usuario: usuarioSalvo ? JSON.parse(usuarioSalvo) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    credenciaisRecebidas: (state, action) => {
      const { token, ...usuario } = action.payload;
      state.token = token;
      state.usuario = usuario;
      localStorage.setItem('ecommerce-loja.token', token);
      localStorage.setItem('ecommerce-loja.usuario', JSON.stringify(usuario));
    },
    sessaoEncerrada: (state) => {
      state.token = null;
      state.usuario = null;
      localStorage.removeItem('ecommerce-loja.token');
      localStorage.removeItem('ecommerce-loja.usuario');
    },
  },
});

export const { credenciaisRecebidas, sessaoEncerrada } = authSlice.actions;
export default authSlice.reducer;

export const selecionarUsuarioLogado = (state) => state.auth.usuario;
export const selecionarToken = (state) => state.auth.token;
export const selecionarEstaAutenticado = (state) => Boolean(state.auth.token);
export const selecionarEhAdministrador = (state) =>
  Boolean(state.auth.usuario?.perfis?.includes('PERFIL_ADMINISTRADOR'));
