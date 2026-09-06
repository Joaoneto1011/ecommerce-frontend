import { z } from 'zod';

// Espelha ProdutoDTO (backend): nomeProduto 3-100, descricao 6-500,
// quantidadeEstoque >= 0, preco > 0, desconto 0-100.
export const produtoSchema = z.object({
  nomeProduto: z.string().min(3, 'Mínimo de 3 caracteres').max(100, 'Máximo de 100 caracteres'),
  descricao: z.string().min(6, 'Mínimo de 6 caracteres').max(500, 'Máximo de 500 caracteres'),
  quantidadeEstoque: z.coerce
    .number({ message: 'Informe um número' })
    .int('Deve ser um número inteiro')
    .min(0, 'Não pode ser negativo'),
  preco: z.coerce.number({ message: 'Informe um número' }).positive('O preço deve ser maior que zero'),
  desconto: z.coerce
    .number({ message: 'Informe um número' })
    .min(0, 'Não pode ser negativo')
    .max(100, 'Não pode ser maior que 100'),
});
