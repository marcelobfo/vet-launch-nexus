
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Automation = () => {
  return (
    <section id="automacao" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Automação de <span className="text-vet-secondary">Marketing</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Estruturas de automação de WhatsApp e E-mail para otimizar o processo de lançamento e aumentar as taxas de conversão.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-8">
            <div className="bg-gradient-to-br from-vet-primary/60 to-transparent p-6 rounded-lg border border-vet-secondary/30 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 text-white">Ferramentas Recomendadas</h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {tools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-vet-secondary/20 rounded-md">
                      <span className="text-vet-secondary font-bold text-lg">{tool.initial}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{tool.name}</p>
                      <p className="text-xs text-gray-400">{tool.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-gradient-to-br from-card to-card/60 border-border/50 animate-fade-in delay-100">
              <CardHeader>
                <CardTitle className="text-xl">Automação WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {whatsappAutomation.map((item, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-vet-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-vet-secondary font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col gap-8">
            <Card className="bg-gradient-to-br from-card to-card/60 border-border/50 animate-fade-in delay-200">
              <CardHeader>
                <CardTitle className="text-xl">Automação E-mail</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {emailAutomation.map((item, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-vet-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-vet-accent font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <div className="bg-gradient-to-br from-vet-primary/60 to-transparent p-6 rounded-lg border border-vet-accent/30 animate-fade-in delay-300">
              <h3 className="text-xl font-semibold mb-4 text-white">Fluxos de Automação</h3>
              <div className="space-y-4">
                {automationFlows.map((flow, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h4 className="font-medium text-vet-accent mb-2">{flow.name}</h4>
                    <p className="text-sm text-gray-300 mb-3">{flow.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {flow.triggers.map((trigger, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-vet-accent/20 text-white">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const tools = [
  { name: "ActiveCampaign", type: "E-mail Marketing", initial: "A" },
  { name: "ManyChat", type: "Automação WhatsApp", initial: "M" },
  { name: "Zapier", type: "Integrações", initial: "Z" },
  { name: "RD Station", type: "Marketing Automation", initial: "R" },
];

const whatsappAutomation = [
  { 
    title: "Sequência de Boas-Vindas", 
    description: "Mensagem automática após cadastro na PPL com material prometido e próximos passos." 
  },
  { 
    title: "Lembrete de Aulas", 
    description: "Notificações enviadas 1h e 15min antes de cada aula ao vivo com link de acesso." 
  },
  { 
    title: "Resgate de Abandono", 
    description: "Mensagens para quem não assistiu às aulas, com lembretes e conteúdo complementar." 
  },
  { 
    title: "Urgência de Fechamento", 
    description: "Sequência para os últimos 2 dias, com contadores e lembretes de encerramento." 
  },
  { 
    title: "Suporte Humano Integrado", 
    description: "Transferência para atendente real quando detectadas dúvidas específicas." 
  },
];

const emailAutomation = [
  { 
    title: "Nutrição de Leads", 
    description: "Sequência de 5-7 emails com conteúdo educativo após cadastro na PPL." 
  },
  { 
    title: "Aquecimento Pré-Evento", 
    description: "Emails preparatórios com histórias de sucesso e expectativa para as aulas." 
  },
  { 
    title: "Acompanhamento de Aulas", 
    description: "Emails pós-aula com resumos, materiais complementares e próximos passos." 
  },
  { 
    title: "Abertura de Carrinho", 
    description: "Anúncio da oferta com detalhamento do curso, bônus e garantias." 
  },
  { 
    title: "Objeções e Testimonials", 
    description: "Emails focados em superar dúvidas comuns e apresentar casos de sucesso." 
  },
  { 
    title: "Sequência de Fechamento", 
    description: "Emails de urgência com contadores regressivos e últimas chamadas para ação." 
  },
];

const automationFlows = [
  {
    name: "Segmentação por Interesse",
    description: "Separa leads por área de interesse na veterinária para enviar conteúdo personalizado.",
    triggers: ["Clique em Link", "Resposta a Pergunta", "Comportamento no Site"]
  },
  {
    name: "Reengajamento de Inativos",
    description: "Reativa leads que não abrem emails ou respondem mensagens há mais de 5 dias.",
    triggers: ["Inatividade", "Abandono", "Recuperação"]
  },
  {
    name: "Carrinho Abandonado",
    description: "Sequência para quem iniciou o processo de compra mas não concluiu o pagamento.",
    triggers: ["Acesso à Página", "Carrinho não Finalizado", "Retorno"]
  }
];

export default Automation;
