import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cadastroSchema } from '../../lib/validationSchemas/cadastro';
import { useCadastrarMutation } from '../../api/autenticacaoApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function CadastroPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(cadastroSchema) });
  const [cadastrar, { isLoading }] = useCadastrarMutation();
  const navigate = useNavigate();

  async function aoEnviar(dados) {
    try {
      await cadastrar({
        nomeUsuario: dados.nomeUsuario,
        email: dados.email,
        senha: dados.senha,
      }).unwrap();
      toast.success('Conta criada! Faça login para continuar.');
      navigate('/login');
    } catch (erro) {
      const erros = erro?.data?.erros;
      if (erros) {
        Object.values(erros).forEach((mensagem) => toast.error(mensagem));
      } else {
        toast.error(erro?.data?.mensagem ?? 'Não foi possível criar a conta.');
      }
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">Criar conta</h1>
      <p className="mt-1 text-sm text-muted">Leva menos de um minuto.</p>

      <Card className="mt-8 p-6">
        <form onSubmit={handleSubmit(aoEnviar)} className="flex flex-col gap-4" noValidate>
          <Input label="Nome de usuário" erro={errors.nomeUsuario?.message} {...register('nomeUsuario')} />
          <Input label="Email" type="email" erro={errors.email?.message} {...register('email')} />
          <Input label="Senha" type="password" erro={errors.senha?.message} {...register('senha')} />
          <Input
            label="Confirmar senha"
            type="password"
            erro={errors.confirmarSenha?.message}
            {...register('confirmarSenha')}
          />
          <Button type="submit" carregando={isLoading} className="mt-2 w-full">
            Criar conta
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Entrar
        </Link>
      </p>
    </div>
  );
}
