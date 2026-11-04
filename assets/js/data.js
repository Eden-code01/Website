/* ==========================================================================
   EDEN.OS — conteúdo do sistema
   Edite este arquivo para atualizar o portfólio. Nada mais precisa mudar.
   ========================================================================== */
window.EDEN = {
  profile: {
    name: "Éden Samuel",
    handle: "eden",
    role: "Software Engineer · IA & Automação",
    location: "Curitiba, PR — Brasil",
    education: "Engenharia de Software — PUCPR",
    bio: [
      "Construo sistemas que pensam e trabalham sozinhos: automações, integrações e soluções com IA que tiram tarefas repetitivas do caminho e colocam dados no centro das decisões.",
      "Venho de vendas, seguros e consórcio — então meu código começa no problema do cliente, não na ferramenta. Hoje, uno engenharia de software, IA aplicada e performance de negócio na Up Lead."
    ],
    status: "Disponível para projetos",
    // TODO: troque pelo seu e-mail público
    email: "seuemail@email.com",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/%C3%A9den-samuel-22854b19b", icon: "in" },
      { label: "GitHub", url: "https://github.com/Eden-code01", icon: "gh" },
      { label: "Instagram", url: "https://www.instagram.com/eden_samuelm0/", icon: "ig" }
    ]
  },

  /* Projetos pessoais -------------------------------------------------- */
  projects: [
    {
      id: "vision-guard",
      name: "Vision Guard",
      kind: "IoT · Visão computacional",
      status: "em produção",
      year: "2025",
      summary: "Monitoramento inteligente com ESP32 + webcam Logitech C920. Detecta movimento com OpenCV, captura a imagem e dispara alertas automáticos em um canal do Discord.",
      highlights: ["Detecção de movimento em tempo real", "API REST em Flask", "Logs e configuração do sistema", "Alertas automáticos via webhook"],
      stack: ["Python", "OpenCV", "Flask", "ESP32", "Discord API"],
      links: [{ label: "GitHub", url: "https://github.com/Eden-code01" }]
    },
    {
      id: "eden-os",
      name: "Eden.OS",
      kind: "Web · Interface",
      status: "online",
      year: "2026",
      summary: "Este portfólio: uma interface de sistema operacional no navegador, com gerenciador de janelas, terminal e assistente por comandos. Zero frameworks, carregamento instantâneo.",
      highlights: ["Window manager próprio", "Terminal interativo", "Command palette (⌘K)", "100% vanilla JS"],
      stack: ["HTML", "CSS", "JavaScript"],
      links: [{ label: "Código", url: "https://github.com/Eden-code01/Website" }]
    },
    {
      id: "crud-core",
      name: "CRUD Core",
      kind: "Full-stack · Dados",
      status: "estudo",
      year: "2025",
      summary: "Sistemas CRUD com PHP e MySQL rodando em XAMPP — modelagem relacional, conexão front ↔ back e regras de negócio no servidor.",
      highlights: ["Modelagem relacional", "Integração front/back", "Validação no servidor"],
      stack: ["PHP", "MySQL", "JavaScript", "XAMPP"],
      links: [{ label: "GitHub", url: "https://github.com/Eden-code01" }]
    }
  ],

  /* Trajetória profissional (mais recente primeiro) -------------------- */
  career: [
    {
      period: "atual",
      title: "Fundador",
      org: "Up Lead",
      text: "Estruturando uma operação de geração de leads com IA e automação: captação, qualificação e follow-up rodando em fluxos inteligentes.",
      tags: ["IA", "Automação", "Growth"]
    },
    {
      period: "em curso",
      title: "Engenharia de Software",
      org: "PUCPR",
      text: "Formação em engenharia de software com foco em desenvolvimento web, Java, bancos de dados e arquitetura de sistemas.",
      tags: ["Java", "Web", "Banco de dados"]
    },
    {
      period: "anterior",
      title: "Consultor de Seguros & Consórcio",
      org: "Mercado financeiro",
      text: "Consultoria e vendas consultivas: entender a necessidade do cliente, desenhar a solução e fechar com clareza. A base de como penso produto até hoje.",
      tags: ["Vendas", "Consultoria", "Negociação"]
    },
    {
      period: "anterior",
      title: "Atendimento ao Cliente",
      org: "Varejo & serviços",
      text: "Linha de frente com pessoas reais e problemas reais — comunicação, empatia e foco em resultado.",
      tags: ["Comunicação", "CX"]
    }
  ],

  /* Empresa ------------------------------------------------------------ */
  company: {
    name: "Up Lead",
    tagline: "Leads qualificados no piloto automático.",
    description: "A Up Lead combina inteligência artificial e automação para gerar, qualificar e nutrir leads. Menos planilha e trabalho manual, mais conversas certas com as pessoas certas — tudo orientado por dados.",
    pillars: [
      { title: "Captação", text: "Fluxos de aquisição que trazem contatos com perfil real de compra." },
      { title: "Qualificação com IA", text: "Agentes que conversam, classificam e priorizam cada lead automaticamente." },
      { title: "Automação de follow-up", text: "Nenhum lead esquecido: cadências inteligentes em WhatsApp, e-mail e CRM." },
      { title: "Dados & performance", text: "Dashboards e métricas para decidir com base no que realmente converte." }
    ],
    // TODO: coloque o site/Instagram da Up Lead
    url: ""
  },

  /* Automações ----------------------------------------------------------
     Cada automação é um pipeline: gatilho → etapas → saída */
  automations: [
    {
      name: "Lead Qualifier",
      desc: "Recebe o lead, enriquece os dados, pontua com IA e roteia para o vendedor certo.",
      flow: ["Formulário", "Enriquecimento", "Score IA", "CRM", "WhatsApp"],
      tags: ["IA", "CRM", "Vendas"]
    },
    {
      name: "Motion Alert",
      desc: "Câmera detecta movimento, captura o frame e envia o alerta com imagem em segundos.",
      flow: ["Webcam", "OpenCV", "Flask API", "Discord"],
      tags: ["IoT", "Visão", "Python"]
    },
    {
      name: "Follow-up Engine",
      desc: "Cadência automática de contato baseada no comportamento do lead — sem nenhum esquecido.",
      flow: ["Gatilho", "Regras", "Mensagem IA", "Envio", "Métricas"],
      tags: ["Automação", "Growth"]
    },
    {
      name: "Data Digest",
      desc: "Coleta dados de várias fontes, consolida e entrega um resumo diário com os números que importam.",
      flow: ["APIs", "Tratamento", "Resumo IA", "Relatório"],
      tags: ["Dados", "IA"]
    }
  ],

  /* Stack -------------------------------------------------------------- */
  stack: [
    { group: "Linguagens", items: ["Python", "JavaScript", "Java", "PHP", "SQL", "HTML/CSS"] },
    { group: "IA & Automação", items: ["LLMs & prompts", "Agentes de IA", "Integrações via API", "Webhooks", "OpenCV"] },
    { group: "Back-end & Dados", items: ["Flask", "REST APIs", "MySQL", "XAMPP"] },
    { group: "Hardware & IoT", items: ["ESP32", "Câmeras USB", "Sensores"] },
    { group: "Ferramentas", items: ["Git", "GitHub", "VS Code"] }
  ]
};
