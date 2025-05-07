
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const defaultCosts = [
  {
    title: "Designer",
    priority: "Média",
    description: "Criação de artes para redes sociais, anúncios e materiais visuais do lançamento.",
    cost: "R$ 800 - R$ 1.500",
    includes: [
      "Identidade visual do lançamento",
      "Posts para Instagram e Facebook",
      "Banners para anúncios",
      "Thumbnails para vídeos"
    ]
  },
  {
    title: "Automação",
    priority: "Alta",
    description: "Configuração dos fluxos de automação de WhatsApp e E-mail para o lançamento.",
    cost: "R$ 1.000 - R$ 2.000",
    includes: [
      "Configuração do ManyChat/ActiveCampaign",
      "Criação de sequências de nutrição",
      "Segmentação de leads por comportamento",
      "Integração entre plataformas"
    ]
  },
  {
    title: "Web Designer",
    priority: "Alta",
    description: "Desenvolvimento das landing pages necessárias para o funil de lançamento.",
    cost: "R$ 1.500 - R$ 3.000",
    includes: [
      "Página de Pré-Lançamento (PPL)",
      "Página de Inscrição para o evento",
      "Página de Aulas/Conteúdos",
      "Página de Vendas (PLV)",
      "Página de Obrigado"
    ]
  },
  {
    title: "Ferramentas",
    priority: "Alta",
    description: "Plataformas e softwares necessários para hospedar e gerenciar o lançamento.",
    cost: "R$ 3.000 - R$ 7.000",
    includes: [
      "Hospedagem e Domínio",
      "Plataforma de E-mail Marketing",
      "Ferramenta de Automação WhatsApp",
      "Plataforma de Pagamentos",
      "Software de Webinar/Lives"
    ]
  },
  {
    title: "Tráfego Pago",
    priority: "Variável",
    description: "Investimento em anúncios para captação de leads e divulgação do lançamento.",
    cost: "R$ 2.000 - R$ 5.000",
    includes: [
      "Anúncios no Facebook e Instagram",
      "Campanha de captação de leads",
      "Remarketing para inscritos",
      "Anúncios para aumento de vendas",
      "Otimização contínua das campanhas"
    ]
  },
  {
    title: "Extras",
    priority: "Média",
    description: "Serviços adicionais que podem aumentar a eficiência e conversão do lançamento.",
    cost: "Variável",
    includes: [
      "Copywriter para textos persuasivos",
      "Editor de vídeo para aulas",
      "Consultor de lançamentos",
      "Suporte durante o lançamento",
      "Mentorias privadas (opcional)"
    ]
  }
];

const confeitariaCosts = [
  {
    title: "Fotos e Vídeos",
    priority: "Alta",
    description: "Conteúdo visual profissional para redes sociais e material de lançamento.",
    cost: "R$ 2.000 - R$ 5.000",
    includes: [
      "Sessão fotográfica dos produtos",
      "Vídeos demonstrativos de técnicas",
      "Depoimentos em vídeo",
      "Fotos para redes sociais e materiais"
    ]
  },
  {
    title: "Copywriting",
    priority: "Alta",
    description: "Textos persuasivos para páginas de venda, emails e posts.",
    cost: "R$ 1.500 - R$ 3.000",
    includes: [
      "Roteiros para vídeos e lives",
      "Textos para página de vendas",
      "Sequência de emails para lançamento",
      "Escrita de posts para redes sociais"
    ]
  },
  {
    title: "E-mail Marketing",
    priority: "Alta",
    description: "Plataforma para envio de emails e automações.",
    cost: "R$ 150/mês",
    includes: [
      "RD Station ou Mailchimp",
      "Segmentação de leads",
      "Automações e disparos",
      "Relatórios de desempenho"
    ]
  },
  {
    title: "Plataforma de Páginas",
    priority: "Alta",
    description: "Ferramentas para criar landing pages e página de vendas.",
    cost: "R$ 100 - R$ 300/mês",
    includes: [
      "Leadlovers ou Klickpages",
      "Páginas de captura de leads",
      "Página de vendas otimizada",
      "Checkout integrado"
    ]
  },
  {
    title: "Tráfego Pago",
    priority: "Alta",
    description: "Investimento em anúncios para captação de leads e vendas.",
    cost: "R$ 2.000 - R$ 10.000",
    includes: [
      "Anúncios no Facebook e Instagram",
      "Segmentação para público-alvo",
      "Remarketing para leads",
      "Otimização de campanhas"
    ]
  },
  {
    title: "Atendimento",
    priority: "Média",
    description: "Suporte e atendimento durante o lançamento.",
    cost: "R$ 100 - R$ 800/mês",
    includes: [
      "Agente de IA via Manychat ou n8n",
      "WhatsApp API para automações",
      "Atendimento humano (opcional)",
      "CRM para gestão de leads"
    ]
  }
];

const Costs = () => {
  const [costCards, setCostCards] = useState(defaultCosts);
  const [basicTotal, setBasicTotal] = useState("R$ 8.300");
  const [completeTotal, setCompleteTotal] = useState("R$ 18.500");
  
  useEffect(() => {
    // Check if there are stored costs in localStorage
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const { costs, activeTemplateId } = JSON.parse(storedConfig);
        
        // If Carla Borges template is active, use confeitaria costs
        if (activeTemplateId === "template-4") {
          setCostCards(confeitariaCosts);
          setBasicTotal("R$ 6.030");
          setCompleteTotal("R$ 21.750");
        } else if (costs && Array.isArray(costs)) {
          setCostCards(costs);
        }
      } catch (error) {
        console.error("Error parsing stored costs:", error);
      }
    }
  }, []);
  
  return (
    <section id="custos" className="py-20 px-6 bg-primary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Previsão de <span className="text-accent">Custos</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Planejamento financeiro para seu lançamento, com estimativas de investimento para cada área.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {costCards.map((card, index) => (
              <Card 
                key={index} 
                className="netflix-card border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardHeader className="bg-gradient-to-r from-card to-transparent pb-3">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{card.title}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${getPriorityClass(card.priority)}`}>
                      {card.priority}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-300 mb-2">{card.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Investimento:</span>
                      <span className="text-accent font-medium">{card.cost}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-gray-400">Inclui:</p>
                    <ul className="text-xs space-y-1">
                      {card.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-secondary">•</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="glass-card p-6 animate-fade-in delay-500">
            <h3 className="text-xl font-semibold text-white mb-4">Investimento Total Estimado</h3>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-2 text-center md:text-left">
                <p className="text-gray-300">Dependendo do escopo e escala do seu lançamento:</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-3 py-1 rounded-full bg-secondary/20 text-secondary">
                    Básico
                  </span>
                  <span className="text-accent font-semibold text-xl">{basicTotal}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-3 py-1 rounded-full bg-accent/20 text-accent">
                    Completo
                  </span>
                  <span className="text-accent font-semibold text-xl">{completeTotal}</span>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 max-w-md">
                <p className="text-sm text-gray-300">
                  <span className="text-secondary font-medium">Importante:</span> Este investimento pode ser otimizado com planejamento adequado. O retorno geralmente supera o investimento inicial quando a estratégia é bem executada, com média de conversão entre 3-5% da lista total de leads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function getPriorityClass(priority) {
  switch (priority) {
    case 'Alta':
      return 'bg-accent/20 text-accent';
    case 'Média':
      return 'bg-secondary/20 text-secondary';
    case 'Variável':
      return 'bg-blue-500/20 text-blue-400';
    default:
      return 'bg-muted/20 text-muted-foreground';
  }
}

export default Costs;
