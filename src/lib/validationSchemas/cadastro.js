import { z } from 'zod';

// Espelha SolicitacaoDeCadastro (backend): nomeUsuario 3-20, email até 50, senha 6-40.
export const cadastroSchema = z
  .object({
    nomeUsuario: z
      .string()
      .min(3, 'Mínimo de 3 caracteres')
      .max(20, 'Máximo de 20 caracteres'),
    email: z.string().email('Informe um email válido').max(50, 'Máximo de 50 caracteres'),
    senha: z.string().min(6, 'Mínimo de 6 caracteres').max(40, 'Máximo de 40 caracteres'),
    confirmarSenha: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });
