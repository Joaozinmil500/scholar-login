import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentList = ({ students, onEdit, onDelete }: StudentListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (students.length === 0) {
    return (
      <Card className="p-8 text-center shadow-card">
        <p className="text-muted-foreground">Nenhum aluno cadastrado ainda.</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead>Nome</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id} className="hover:bg-secondary/30 transition-colors">
              <TableCell className="font-medium">{student.nome}</TableCell>
              <TableCell>{student.matricula}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{formatDate(student.dataNascimento)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(student)}
                  className="hover:bg-primary/10 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(student.id)}
                  className="hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default StudentList;
