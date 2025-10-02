import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Student } from '@/types/student';
import StudentList from '@/components/StudentList';
import StudentForm from '@/components/StudentForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, LogOut, GraduationCap } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, [isAuthenticated, navigate]);

  const saveStudents = (updatedStudents: Student[]) => {
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
  };

  const handleAddStudent = (data: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...data,
      id: crypto.randomUUID(),
    };
    const updatedStudents = [...students, newStudent];
    saveStudents(updatedStudents);
    toast.success('Aluno cadastrado com sucesso!');
    setIsFormOpen(false);
  };

  const handleEditStudent = (data: Omit<Student, 'id'>) => {
    if (!editingStudent) return;
    
    const updatedStudents = students.map((s) =>
      s.id === editingStudent.id ? { ...data, id: editingStudent.id } : s
    );
    saveStudents(updatedStudents);
    toast.success('Aluno atualizado com sucesso!');
    setEditingStudent(null);
    setIsFormOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    const updatedStudents = students.filter((s) => s.id !== id);
    saveStudents(updatedStudents);
    toast.success('Aluno removido com sucesso!');
    setDeletingId(null);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logout realizado com sucesso!');
  };

  const existingMatriculas = students
    .filter((s) => s.id !== editingStudent?.id)
    .map((s) => s.matricula);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-elegant">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestão de Alunos</h1>
              <p className="text-muted-foreground">Sistema de cadastro e controle</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-elegant"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Aluno
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <StudentList
          students={students}
          onEdit={handleOpenEdit}
          onDelete={(id) => setDeletingId(id)}
        />

        <StudentForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
          student={editingStudent}
          existingMatriculas={existingMatriculas}
        />

        <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingId && handleDeleteStudent(deletingId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Dashboard;
