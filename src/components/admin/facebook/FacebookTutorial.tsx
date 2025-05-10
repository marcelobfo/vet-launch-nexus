
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TutorialStep } from '@/types/facebook';

interface FacebookTutorialProps {
  steps: TutorialStep[];
}

const FacebookTutorial: React.FC<FacebookTutorialProps> = ({ steps }) => {
  return (
    <div className="bg-card border border-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="h-5 w-5 text-vet-primary" />
        <h3 className="text-lg font-medium">Tutorial de Configuração</h3>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {steps.map((step, index) => (
          <AccordionItem key={index} value={`step-${index + 1}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-vet-primary/20 text-vet-primary text-xs font-medium">
                  {index + 1}
                </div>
                <span>{step.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-8 border-l border-gray-800 ml-3 text-gray-400">
                {step.content}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => window.open('https://developers.facebook.com/docs/marketing-api/get-started', '_blank')}
        >
          <ArrowRight className="h-4 w-4" />
          <span>Acessar Documentação Completa</span>
        </Button>
      </div>
    </div>
  );
};

export default FacebookTutorial;
