import { z } from 'zod';

export const loginSchema = z.object({
  nomeUsuario: z.string().min(1, 'Informe seu nome de usuário'),
  senha: z.string().min(1, 'Informe sua senha'),
});
