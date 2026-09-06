import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enderecoSchema } from '../../../lib/validationSchemas/endereco';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const VALORES_PADRAO = { rua: '', numeroRua: '', cidade: '', estado: '', pais: 'Brasil', cep: '' };

export default function FormularioEndereco({ enderecoInicial, aoSalvar, carregando, aoCancelar }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enderecoSchema),
    defaultValues: enderecoInicial ?? VALORES_PADRAO,
  });

  useEffect(() => {
    reset(enderecoInicial ?? VALORES_PADRAO);
  }, [enderecoInicial, reset]);

  return (
    <form onSubmit={handleSubmit(aoSalvar)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Input label="Rua" erro={errors.rua?.message} {...register('rua')} />
        </div>
        <Input label="Número" erro={errors.numeroRua?.message} {...register('numeroRua')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Cidade" erro={errors.cidade?.message} {...register('cidade')} />
        <Input label="Estado" erro={errors.estado?.message} {...register('estado')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="País" erro={errors.pais?.message} {...register('pais')} />
        <Input label="CEP" placeholder="00000-000" erro={errors.cep?.message} {...register('cep')} />
      </div>
      <div className="mt-2 flex justify-end gap-3">
        {aoCancelar && (
          <Button variante="ghost" type="button" onClick={aoCancelar}>
            Cancelar
          </Button>
        )}
        <Button type="submit" carregando={carregando}>
          Salvar endereço
        </Button>
      </div>
    </form>
  );
}
