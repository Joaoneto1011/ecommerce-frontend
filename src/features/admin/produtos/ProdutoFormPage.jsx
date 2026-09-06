import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import { produtoSchema } from '../../../lib/validationSchemas/produto';
import {
  useBuscarProdutoPorIdQuery,
  useCriarProdutoMutation,
  useAtualizarProdutoMutation,
  useUploadImagemProdutoMutation,
} from '../../../api/produtosApi';
import { useListarCategoriasPublicasQuery } from '../../../api/categoriasApi';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';

export default function ProdutoFormPage() {
  const { idProduto } = useParams();
  const modoEdicao = Boolean(idProduto);
  const navigate = useNavigate();

  const { data: produtoExistente, isLoading: carregandoProduto } = useBuscarProdutoPorIdQuery(idProduto, {
    skip: !modoEdicao,
  });
  const { data: categorias = [] } = useListarCategoriasPublicasQuery();
  const [criarProduto, { isLoading: criando }] = useCriarProdutoMutation();
  const [atualizarProduto, { isLoading: atualizando }] = useAtualizarProdutoMutation();
  const [uploadImagem, { isLoading: enviandoImagem }] = useUploadImagemProdutoMutation();

  const [idCategoria, setIdCategoria] = useState('');
  const [arquivoImagem, setArquivoImagem] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(produtoSchema) });

  useEffect(() => {
    if (produtoExistente) {
      reset({
        nomeProduto: produtoExistente.nomeProduto,
        descricao: produtoExistente.descricao,
        quantidadeEstoque: produtoExistente.quantidadeEstoque,
        preco: produtoExistente.preco,
        desconto: produtoExistente.desconto,
      });
      setIdCategoria(produtoExistente.categoria?.idCategoria ?? '');
    }
  }, [produtoExistente, reset]);

  async function aoSalvar(dados) {
    try {
      if (modoEdicao) {
        await atualizarProduto({ idProduto: Number(idProduto), ...dados }).unwrap();
        toast.success('Produto atualizado!');
        navigate('/admin/produtos');
      } else {
        if (!idCategoria) {
          toast.error('Selecione uma categoria.');
          return;
        }
        const novoProduto = await criarProduto({ idCategoria: Number(idCategoria), ...dados }).unwrap();
        toast.success('Produto criado! Agora envie uma foto.');
        navigate(`/admin/produtos/${novoProduto.idProduto}/editar`);
      }
    } catch (erro) {
      const erros = erro?.data?.erros;
      if (erros) Object.values(erros).forEach((mensagem) => toast.error(mensagem));
      else toast.error(erro?.data?.mensagem ?? 'Não foi possível salvar o produto.');
    }
  }

  async function aoEnviarImagem() {
    if (!arquivoImagem) return;
    try {
      await uploadImagem({ idProduto: Number(idProduto), arquivo: arquivoImagem }).unwrap();
      toast.success('Imagem atualizada!');
      setArquivoImagem(null);
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível enviar a imagem.');
    }
  }

  if (modoEdicao && carregandoProduto) {
    return <Skeleton className="h-96 w-full max-w-2xl" />;
  }

  return (
    <div className="max-w-2xl">
      <Link to="/admin/produtos" className="flex items-center gap-2 text-sm text-muted hover:text-ink">
        <FiArrowLeft size={14} /> Voltar
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-bold text-ink">{modoEdicao ? 'Editar produto' : 'Novo produto'}</h1>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit(aoSalvar)} className="flex flex-col gap-4" noValidate>
          <Input label="Nome" erro={errors.nomeProduto?.message} {...register('nomeProduto')} />
          <Textarea label="Descrição" erro={errors.descricao?.message} {...register('descricao')} />

          <div>
            <Select
              label="Categoria"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              disabled={modoEdicao}
            >
              <option value="">Selecione...</option>
              {categorias.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nomeCategoria}
                </option>
              ))}
            </Select>
            {modoEdicao && (
              <p className="mt-1 text-xs text-muted">A categoria não pode ser alterada após a criação.</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Preço (R$)" type="number" step="0.01" erro={errors.preco?.message} {...register('preco')} />
            <Input label="Desconto (%)" type="number" step="1" erro={errors.desconto?.message} {...register('desconto')} />
            <Input label="Estoque" type="number" erro={errors.quantidadeEstoque?.message} {...register('quantidadeEstoque')} />
          </div>

          <Button type="submit" carregando={criando || atualizando} className="mt-2">
            {modoEdicao ? 'Salvar alterações' : 'Criar produto'}
          </Button>
        </form>
      </Card>

      {modoEdicao && (
        <Card className="mt-6 p-6">
          <h2 className="font-serif text-lg font-bold text-ink">Foto do produto</h2>
          <div className="mt-4 flex items-center gap-4">
            <img
              src={produtoExistente?.imagem}
              alt={produtoExistente?.nomeProduto}
              className="h-20 w-20 rounded-lg bg-black/5 object-cover"
            />
            <div className="flex flex-1 flex-col gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setArquivoImagem(e.target.files?.[0] ?? null)}
                className="text-sm text-ink-soft file:mr-3 file:rounded-lg file:border-0 file:bg-black/5 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-black/10"
              />
              <Button
                variante="outline"
                onClick={aoEnviarImagem}
                disabled={!arquivoImagem}
                carregando={enviandoImagem}
                className="w-fit"
              >
                <FiUpload size={15} /> Enviar imagem
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
