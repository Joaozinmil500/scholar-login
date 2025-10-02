import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const studentSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
  matricula: z.string().min(1, 'Matrícula é obrigatória').max(50, 'Matrícula muito longa'),
  email: z.string().email('E-mail inválido').max(255, 'E-mail muito longo'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
  student?: Student | null;
  existingMatriculas: string[];
}

const StudentForm = ({ open, onClose, onSubmit, student, existingMatriculas }: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      nome: '',
      matricula: '',
      email: '',
      dataNascimento: '',
    },
  });

  const handleFormSubmit = (data: StudentFormData) => {
    // Verificar matrícula duplicada apenas se for um novo aluno ou se a matrícula foi alterada
    if ((!student || student.matricula !== data.matricula) && existingMatriculas.includes(data.matricula)) {
      alert('Esta matrícula já está em uso!');
      return;
    }
    
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {student ? 'Editar Aluno' : 'Novo Aluno'}
          </DialogTitle>
          <DialogDescription>
            {student ? 'Atualize as informações do aluno' : 'Preencha os dados do novo aluno'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              {...register('nome')}
              placeholder="Digite o nome completo"
              className="transition-all focus:shadow-elegant"
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              id="matricula"
              {...register('matricula')}
              placeholder="Digite a matrícula"
              className="transition-all focus:shadow-elegant"
            />
            {errors.matricula && (
              <p className="text-sm text-destructive">{errors.matricula.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Digite o e-mail"
              className="transition-all focus:shadow-elegant"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              {...register('dataNascimento')}
              className="transition-all focus:shadow-elegant"
            />
            {errors.dataNascimento && (
              <p className="text-sm text-destructive">{errors.dataNascimento.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
            >
              {student ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
