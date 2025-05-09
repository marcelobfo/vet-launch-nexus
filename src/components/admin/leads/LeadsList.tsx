
import React from 'react';
import { MoreHorizontal, Mail, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lead } from '@/types';

interface LeadsListProps {
  filteredLeads: Lead[];
  selectedLeads: string[];
  toggleSelectLead: (leadId: string) => void;
  toggleSelectAll: () => void;
  formatDate: (dateString: string) => string;
  getLandingPageName: (pageId: string | null) => string;
}

const LeadsList: React.FC<LeadsListProps> = ({ 
  filteredLeads, 
  selectedLeads, 
  toggleSelectLead, 
  toggleSelectAll,
  formatDate,
  getLandingPageName
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <input
                type="checkbox"
                checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                onChange={toggleSelectAll}
                className="rounded"
              />
            </TableHead>
            <TableHead>Nome / Email</TableHead>
            <TableHead>Fonte</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Cadastro</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead.id)}
                  onChange={() => toggleSelectLead(lead.id)}
                  className="rounded"
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{lead.name || '-'}</div>
                  <div className="text-sm text-gray-500">{lead.email}</div>
                  {lead.phone && (
                    <div className="text-xs text-gray-400">{lead.phone}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {lead.source && (
                  <Badge variant="outline">
                    {lead.landing_page_id 
                      ? getLandingPageName(lead.landing_page_id)
                      : lead.source}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {lead.tags && lead.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      className="bg-blue-500/10 text-blue-400 border-blue-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{formatDate(lead.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {}}>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                      <Tag className="h-4 w-4 mr-2" />
                      Adicionar Tags
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

export default LeadsList;
