
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileWarning, Info } from "lucide-react";

const ApiDocs: React.FC = () => {
  return (
    <div className="bg-vet-dark/50 rounded-lg p-4 border border-gray-800">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
        <Info className="h-4 w-4 text-blue-400" />
        Documentação da API
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        A API REST permite integração com outras aplicações e serviços.
      </p>
      
      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="endpoint1" className="border-gray-800">
          <AccordionTrigger className="text-sm">
            Endpoint de Usuários
          </AccordionTrigger>
          <AccordionContent className="text-xs">
            <code className="block bg-black/30 p-2 rounded-md">
              GET /api/v1/users<br />
              POST /api/v1/users<br />
              GET /api/v1/users/:id<br />
              PUT /api/v1/users/:id<br />
              DELETE /api/v1/users/:id
            </code>
            <p className="mt-2 text-gray-400">
              Permite gerenciar usuários do sistema.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="endpoint2" className="border-gray-800">
          <AccordionTrigger className="text-sm">
            Endpoint de Empresas
          </AccordionTrigger>
          <AccordionContent className="text-xs">
            <code className="block bg-black/30 p-2 rounded-md">
              GET /api/v1/companies<br />
              POST /api/v1/companies<br />
              GET /api/v1/companies/:id<br />
              PUT /api/v1/companies/:id<br />
              DELETE /api/v1/companies/:id
            </code>
            <p className="mt-2 text-gray-400">
              Permite gerenciar empresas no sistema.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="endpoint3" className="border-gray-800">
          <AccordionTrigger className="text-sm">
            Endpoint de Projetos
          </AccordionTrigger>
          <AccordionContent className="text-xs">
            <code className="block bg-black/30 p-2 rounded-md">
              GET /api/v1/projects<br />
              POST /api/v1/projects<br />
              GET /api/v1/projects/:id<br />
              PUT /api/v1/projects/:id<br />
              DELETE /api/v1/projects/:id
            </code>
            <p className="mt-2 text-gray-400">
              Permite gerenciar projetos e tarefas.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-4 flex items-center gap-2 p-2 bg-amber-900/20 border border-amber-700/30 rounded-md text-amber-400 text-xs">
        <FileWarning className="h-4 w-4" />
        <p>
          Para utilizar a API, será necessário implementar autenticação via token JWT.
        </p>
      </div>
    </div>
  );
};

export default ApiDocs;
