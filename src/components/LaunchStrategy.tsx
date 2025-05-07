import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LaunchStrategy = () => {
  const [strategies, setStrategies] = useState([
    {
      title: "Pré-Lançamento",
      duration: "15 a 20 dias",
      objective: "Construir autoridade, engajamento e criar expectativa",
      actions: [
        "Produção de conteúdo relevante sobre problemas e soluções da área veterinária",
        "Captura de leads através de PPL com iscas digitais",
        "Estruturar automação de WhatsApp e E-mail para aquecer a base",
        "Uso de gatilhos mentais: reciprocidade, prova social, autoridade",
        "Impulsionamento de posts e tráfego pago para a PPL"
      ]
    },
    {
      title: "Lançamento (Evento)",
      duration: "7 dias",
      objective: "Gerar valor, engajamento e aquecer os leads para a oferta",
      actions: [
        "Aula 1: Problema e oportunidade no mercado veterinário",
        "Aula 2: Solução e jornada do expert veterinário",
        "Aula 3: Casos de sucesso e apresentação do curso",
        "Aula 4 (opcional): Perguntas e Respostas ao vivo",
        "Interação no grupo fechado do WhatsApp e Telegram"
      ]
    },
    {
      title: "Abertura do Carrinho",
      duration: "5 a 7 dias",
      objective: "Maximizar vendas no menor tempo possível",
      actions: [
        "Envio de ofertas via e-mail e WhatsApp",
        "Lives de tira-dúvidas sobre o programa",
        "Depoimentos de alunos e estudos de caso reais",
        "Gatilhos: escassez (vagas limitadas), urgência (bônus expira)",
        "Suporte ativo para dúvidas de pagamento e acesso"
      ]
    },
    {
      title: "Fechamento do Carrinho",
      duration: "Últimos 2 dias",
      objective: "Acelerar vendas para os indecisos",
      actions: [
        "E-mail e WhatsApp com \"Aviso: Últimas Horas\"",
        "Mensagem pessoal para leads quentes (via WhatsApp ou direct)",
        "Contagem regressiva na página de vendas",
        "Reforço dos casos de sucesso e garantias",
        "Final impactante com último chamado para ação"
      ]
    },
    {
      title: "Pós-Venda e Onboarding",
      duration: "Primeiros 30 dias",
      objective: "Reduzir desistências e aumentar engajamento no curso",
      actions: [
        "Bem-vindo personalizado (WhatsApp, E-mail e Telegram)",
        "Live de Boas-Vindas com orientações iniciais",
        "Grupo exclusivo para alunos trocarem experiências",
        "Suporte estruturado para primeiros passos",
        "Coleta de feedback para melhorias contínuas"
      ]
    },
    {
      title: "Automação de Marketing",
      duration: "Contínuo",
      objective: "Otimizar a experiência e aumentar conversões",
      actions: [
        "Segmentação de leads por interesse e comportamento",
        "Automações para envio de lembretes e conteúdos personalizados",
        "Notificações de urgência e escassez em momentos estratégicos",
        "Reengajamento de leads frios com novas ofertas",
        "Monitoramento constante de métricas para otimização"
      ]
    }
  ]);

  // Carla Borges strategy content
  const confeitariaStrategies = [
    {
      title: "Pré-Pré-Lançamento",
      duration: "30 a 60 dias",
      objective: "Construir autoridade e criar uma base de leads",
      actions: [
        "Criação de conteúdo gratuito: posts, reels e stories com dicas de confeitaria",
        "Desenvolvimento de e-book com 10 receitas de bolos lucrativos",
        "Configuração de página de captura e sequência de e-mails",
        "Análise de concorrência e benchmarking"
      ]
    },
    {
      title: "Pré-Lançamento",
      duration: "7 a 14 dias",
      objective: "Aquecer a base e gerar interesse na oferta",
      actions: [
        "Sequência de conteúdo com provas e depoimentos de alunos",
        "Lives temáticas de aquecimento com interação e CTA para lista VIP",
        "E-mails de aquecimento e contagem regressiva",
        "Demonstrações de técnicas e resultados"
      ]
    },
    {
      title: "Lançamento",
      duration: "7 dias",
      objective: "Converter leads em clientes",
      actions: [
        "Abertura de carrinho com urgência e escassez",
        "Campanhas de anúncio pagos com remarketing e Lookalike",
        "Atendimento 1 a 1 com suporte humanizado",
        "Lives tirando dúvidas ao vivo durante a semana"
      ]
    },
    {
      title: "Fechamento",
      duration: "Último dia",
      objective: "Maximizar conversões finais",
      actions: [
        "Live de encerramento com bônus exclusivos",
        "E-mail e WhatsApp com \"Últimas Horas\"",
        "Mensagens personalizadas para leads quentes",
        "Contagem regressiva na página de vendas",
        "Final impactante com último chamado para ação"
      ]
    },
    {
      title: "Pós-Lançamento",
      duration: "7 a 30 dias",
      objective: "Garantir satisfação e evitar cancelamentos",
      actions: [
        "Entrega do produto/curso com boas-vindas",
        "Coleta de feedbacks, NPS e depoimentos",
        "Criação de comunidade exclusiva para alunos",
        "Suporte estruturado para primeiros passos",
        "Relatório de resultados com análises para otimização"
      ]
    },
    {
      title: "Melhorias contínuas",
      duration: "Contínuo",
      objective: "Otimizar futuros lançamentos",
      actions: [
        "Adição de depoimentos reais com fotos/vídeos",
        "Segmentação de leads com e-mails personalizados",
        "Criação de novas ofertas com bônus exclusivos",
        "Testes A/B em páginas de vendas e e-mails",
        "Automação de remarketing para leads não convertidos"
      ]
    }
  ];
  
  useEffect(() => {
    // Check if there's stored content in localStorage
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const { activeTemplateId } = JSON.parse(storedConfig);
        
        // If Carla Borges template is active, use confeitaria strategies
        if (activeTemplateId === "template-4") {
          setStrategies(confeitariaStrategies);
        } else {
          // Otherwise use default strategies from localStorage if available
          const { strategies: storedStrategies } = JSON.parse(storedConfig);
          if (storedStrategies && Array.isArray(storedStrategies)) {
            setStrategies(storedStrategies);
          }
        }
      } catch (error) {
        console.error("Error parsing stored config:", error);
      }
    }
  }, []);

  return (
    <section id="estrategia" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Estrutura do <span className="text-secondary">Lançamento</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Baseado no Método 6 em 7, adaptado especificamente para maximizar seus resultados com menos etapas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strategies.map((strategy, index) => (
            <Card key={index} className="netflix-card bg-gradient-to-br from-card to-card/60 border-border/50 animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
              <CardHeader className="pb-2">
                <div className="w-14 h-1 bg-accent mb-4"></div>
                <CardTitle className="text-xl font-bold">{strategy.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {strategy.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-gray-300 mb-3">
                  <span className="text-secondary font-semibold">Objetivo:</span> {strategy.objective}
                </p>
                <div>
                  <h4 className="text-sm font-semibold text-secondary mb-2">Ações principais:</h4>
                  <ul className="space-y-2">
                    {strategy.actions.map((action, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-secondary mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaunchStrategy;
