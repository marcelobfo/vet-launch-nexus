
import React from 'react';

const Timeline = () => {
  return (
    <section id="etapas" className="py-20 px-6 bg-vet-primary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Linha do Tempo do <span className="text-vet-accent">Lançamento</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Visualize cada etapa do seu lançamento de forma cronológica, com ações estratégicas em cada momento.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {timelineItems.map((item, index) => (
            <div 
              key={index} 
              className="timeline-item animate-fade-in" 
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-1/3">
                  <h3 className="text-vet-secondary font-semibold text-xl">{item.phase}</h3>
                  <p className="text-sm text-gray-400">{item.timing}</p>
                </div>
                <div className="md:w-2/3">
                  <h4 className="font-medium text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-vet-secondary/20 text-vet-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const timelineItems = [
  {
    phase: "Fase 1",
    timing: "Dias 1-5",
    title: "Preparação de Conteúdo e Infraestrutura",
    description: "Definição de posicionamento, preparação de conteúdos e configuração das ferramentas técnicas necessárias.",
    tags: ["Planejamento", "Conteúdo", "Ferramentas"]
  },
  {
    phase: "Fase 2",
    timing: "Dias 6-20",
    title: "Pré-Lançamento e Captação de Leads",
    description: "Publicação de conteúdo de valor, ativação da PPL e início da nutrição da base de leads.",
    tags: ["Conteúdo", "PPL", "Leads", "Tráfego"]
  },
  {
    phase: "Fase 3",
    timing: "Dias 21-27",
    title: "Evento de Lançamento",
    description: "Realização das aulas ao vivo ou disponibilização das aulas gravadas, com foco em engajamento.",
    tags: ["Aulas", "Engajamento", "Autoridade"]
  },
  {
    phase: "Fase 4",
    timing: "Dias 28-34",
    title: "Período de Vendas",
    description: "Abertura do carrinho, intensificação das comunicações e suporte às dúvidas dos potenciais alunos.",
    tags: ["Vendas", "Oferta", "Conversão"]
  },
  {
    phase: "Fase 5",
    timing: "Dias 35-36",
    title: "Fechamento de Vendas",
    description: "Últimas 48 horas com ações de urgência para conversão dos indecisos e encerramento do carrinho.",
    tags: ["Urgência", "Fechamento", "Últimas Vagas"]
  },
  {
    phase: "Fase 6",
    timing: "Dias 37-67",
    title: "Onboarding e Entrega",
    description: "Boas-vindas aos novos alunos, início do curso e acompanhamento inicial para evitar desistências.",
    tags: ["Onboarding", "Suporte", "Retenção"]
  }
];

export default Timeline;
