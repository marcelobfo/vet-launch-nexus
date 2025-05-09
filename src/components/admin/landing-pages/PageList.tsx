
import React from 'react';
import { PageListProps } from '@/types/landingPageTypes';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Copy,
  Trash2,
  Eye,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';

const PageList: React.FC<PageListProps> = ({
  pages,
  loading,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePublish,
  onOpenAiModal,
  formatDate
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-vet-primary"></div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg border-dashed">
        <h3 className="font-medium text-lg mb-2">Sem landing pages</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Comece criando sua primeira página de lançamento ou captura de leads
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atualizada em</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell className="font-medium">{page.title}</TableCell>
              <TableCell className="text-sm text-gray-500">{page.slug}</TableCell>
              <TableCell>
                {page.published ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-800">
                    Publicada
                  </Badge>
                ) : (
                  <Badge variant="outline">Rascunho</Badge>
                )}
              </TableCell>
              <TableCell>{formatDate(page.updated_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(page)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTogglePublish(page)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {page.published ? 'Despublicar' : 'Publicar'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(page)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenAiModal(page)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Melhorar com IA
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(page.id)} className="text-red-500">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PageList;
