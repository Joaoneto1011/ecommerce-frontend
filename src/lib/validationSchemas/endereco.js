import { z } from 'zod';

// Espelha EnderecoDTO (backend): @Size/@Pattern de cada campo.
export const enderecoSchema = z.object({
  rua: z.string().min(5, 'Mínimo de 5 caracteres').max(100, 'Máximo de 100 caracteres'),
  numeroRua: z.string().min(1, 'Obrigatório').max(10, 'Máximo de 10 caracteres'),
  cidade: z.string().min(3, 'Mínimo de 3 caracteres').max(60, 'Máximo de 60 caracteres'),
  estado: z.string().min(2, 'Mínimo de 2 caracteres').max(30, 'Máximo de 30 caracteres'),
  pais: z.string().min(2, 'Mínimo de 2 caracteres').max(60, 'Máximo de 60 caracteres'),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido. Formato: 00000-000'),
});
