
export interface Template {
  id: string;
  name: string;
  description: string;
  config: {
    companyInfo: {
      heroTitle: string;
      heroSubtitle: string;
      aboutText: string;
      heroFeatures: {
        title: string;
        desc: string;
        color: string;
      }[];
    },
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    }
  };
}

export const defaultTemplates: Template[] = [
  {
    id: "template-1",
    name: "Lançamento Veterinário",
    description: "Modelo de lançamento para profissionais da área veterinária",
    config: {
      companyInfo: {
        heroTitle: "Lançamento Expert Veterinário",
        heroSubtitle: "Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para profissionais veterinários.",
        aboutText: "Método 6 em 7, Adaptado para Veterinários",
        heroFeatures: [
          {
            title: "Pré-Lançamento",
            desc: "Construção de autoridade e captação de leads qualificados",
            color: "bg-vet-secondary"
          },
          {
            title: "Evento de Lançamento",
            desc: "Aulas ao vivo com alta conversão e engajamento",
            color: "bg-vet-accent"
          },
          {
            title: "Automação Inteligente",
            desc: "Fluxos de WhatsApp e E-mail para maximizar resultados",
            color: "bg-blue-600"
          }
        ]
      },
      colors: {
        primary: "#00A3E0",
        secondary: "#F28B00",
        accent: "#95D600"
      }
    }
  },
  {
    id: "template-2",
    name: "Lançamento Coaching",
    description: "Modelo de lançamento para coaches e mentores",
    config: {
      companyInfo: {
        heroTitle: "Lançamento Expert Coaching",
        heroSubtitle: "Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para coaches.",
        aboutText: "Método 6 em 7, Potencializado para Coaches",
        heroFeatures: [
          {
            title: "Pré-Lançamento",
            desc: "Construção de autoridade e captação de leads qualificados",
            color: "bg-blue-600"
          },
          {
            title: "Evento de Lançamento",
            desc: "Aulas ao vivo com alta conversão e engajamento",
            color: "bg-purple-600"
          },
          {
            title: "Automação Inteligente",
            desc: "Fluxos de WhatsApp e E-mail para maximizar resultados",
            color: "bg-green-600"
          }
        ]
      },
      colors: {
        primary: "#4A4DE7",
        secondary: "#FF6B6B",
        accent: "#2DCE89"
      }
    }
  },
  {
    id: "template-3",
    name: "Lançamento Nutrição",
    description: "Modelo de lançamento para nutricionistas",
    config: {
      companyInfo: {
        heroTitle: "Lançamento Expert Nutrição",
        heroSubtitle: "Estratégia completa para transformar seu conhecimento em um negócio digital de sucesso, com planejamento de lançamento otimizado para nutricionistas.",
        aboutText: "Método 6 em 7, Adaptado para Nutrição",
        heroFeatures: [
          {
            title: "Pré-Lançamento",
            desc: "Construção de autoridade e captação de leads qualificados",
            color: "bg-green-600"
          },
          {
            title: "Evento de Lançamento",
            desc: "Aulas ao vivo com alta conversão e engajamento",
            color: "bg-amber-600"
          },
          {
            title: "Automação Inteligente",
            desc: "Fluxos de WhatsApp e E-mail para maximizar resultados",
            color: "bg-emerald-600"
          }
        ]
      },
      colors: {
        primary: "#4CAF50",
        secondary: "#FF9800",
        accent: "#E91E63"
      }
    }
  },
  {
    id: "template-4",
    name: "Carla Borges Confeitaria",
    description: "Modelo de lançamento para confeitaria gourmet",
    config: {
      companyInfo: {
        heroTitle: "Lançamento Confeitaria Gourmet",
        heroSubtitle: "Estratégia completa para transformar sua confeitaria em um negócio digital de sucesso, com planejamento de lançamento 6 em 7 otimizado para confeiteiros.",
        aboutText: "Método 6 em 7, Especializado para Confeitaria",
        heroFeatures: [
          {
            title: "Pré-Lançamento",
            desc: "Construção de autoridade e captação de leads através de conteúdos visuais",
            color: "bg-pink-600"
          },
          {
            title: "Evento de Lançamento",
            desc: "Lives demonstrativas com alta conversão e receitas exclusivas",
            color: "bg-red-600"
          },
          {
            title: "Automação Inteligente",
            desc: "Fluxos de WhatsApp e E-mail para engajamento e vendas",
            color: "bg-amber-600"
          }
        ]
      },
      colors: {
        primary: "#D81B60",
        secondary: "#F4511E",
        accent: "#FFC107"
      }
    }
  }
];
