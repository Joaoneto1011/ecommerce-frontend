import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { loginSchema } from '../../lib/validationSchemas/login';
import { useLoginMutation } from '../../api/autenticacaoApi';
import { credenciaisRecebidas } from './authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  async function aoEnviar(dados) {
    try {
      const resultado = await login(dados).unwrap();
      dispatch(credenciaisRecebidas(resultado));
      toast.success(`Bem-vindo(a), ${resultado.nomeUsuario}!`);
      navigate(location.state?.de?.pathname ?? '/');
    } catch (erro) {
      toast.error(erro?.data?.mensagem ?? 'Não foi possível entrar. Tente novamente.');
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl text-ink">Entrar</h1>
      <p className="mt-1 text-sm text-muted">Acesse sua conta para continuar comprando.</p>

      <Card className="mt-8 p-6">
        <form onSubmit={handleSubmit(aoEnviar)} className="flex flex-col gap-4" noValidate>
          <Input
            label="Nome de usuário"
            placeholder="usuario1"
            erro={errors.nomeUsuario?.message}
            {...register('nomeUsuario')}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            erro={errors.senha?.message}
            {...register('senha')}
          />
          <Button type="submit" carregando={isLoading} className="mt-2 w-full">
            Entrar
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-medium text-brand-600 hover:text-brand-700">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
