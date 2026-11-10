import { Conversation, KnowledgeItem, Visit, SocialPost, Tenant } from './types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Ambiental Controle de Pragas',
    slug: 'ambiental-pragas',
    segment: 'Controle de Pragas',
    ownerName: 'Carlos Mendes',
    whatsappNumber: '+55 11 98877-6655',
    plan: 'Pro',
    status: 'Ativo',
    customDomain: 'ambientalcontroledepragas.com.br',
    createdAt: '15/01/2026'
  },
  {
    id: 'tenant-2',
    name: 'SOS Dedetizadora Campinas',
    slug: 'sos-pragas',
    segment: 'Controle de Pragas & Limpeza',
    ownerName: 'Roberto Silveira',
    whatsappNumber: '+55 19 97788-4433',
    plan: 'Enterprise',
    status: 'Ativo',
    customDomain: 'sosdedetizadoracampinas.com.br',
    createdAt: '20/02/2026'
  },
  {
    id: 'tenant-3',
    name: 'CleanClean Higienização',
    slug: 'cleanclean',
    segment: 'Limpeza de Estofados & Sofás',
    ownerName: 'Fernanda Lima',
    whatsappNumber: '+55 21 98111-2233',
    plan: 'Starter',
    status: 'Teste',
    customDomain: 'cleancleanoficial.com.br',
    createdAt: '01/03/2026'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'Mariana Souza',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    customerEmail: 'mariana.souza@gmail.com',
    customerPhone: '+55 11 98877-6655',
    channel: 'whatsapp',
    status: 'open',
    sentiment: 'Frustrado/Urgente',
    urgencyScore: 5,
    unreadCount: 2,
    lastMessageTime: 'Há 5 min',
    assignedAgent: 'Carlos Mendes',
    tags: ['Dedetização', 'Urgente', 'Residencial'],
    company: 'Residência',
    messages: [
      {
        id: 'm-1',
        sender: 'customer',
        senderName: 'Mariana Souza',
        text: 'Olá! Apareceram vários baratinhas e formigas na minha cozinha esta semana. Vocês atendem na região de Perdizes (SP) amanhã?',
        timestamp: '14:30',
        channel: 'whatsapp'
      },
      {
        id: 'm-2',
        sender: 'customer',
        senderName: 'Mariana Souza',
        text: 'Tenho duas crianças pequenas em casa, o produto tem cheiro forte ou precisa desocupar o imóvel?',
        timestamp: '14:31',
        channel: 'whatsapp'
      }
    ],
    notes: ['Cliente preocupada com crianças em casa. Explicar que usamos produtos microencapsulados sem cheiro e liberação em 2h.']
  },
  {
    id: 'conv-2',
    customerName: 'Lucas Ferreira',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    customerEmail: 'lucas.ferreira@techcorp.com.br',
    customerPhone: '+55 21 97766-5544',
    channel: 'website',
    status: 'open',
    sentiment: 'Neutro',
    urgencyScore: 3,
    unreadCount: 1,
    lastMessageTime: 'Há 18 min',
    assignedAgent: 'Ana Beatriz',
    tags: ['Desratização', 'Comercial', 'Galpão'],
    company: 'TechCorp Logística',
    messages: [
      {
        id: 'm-3',
        sender: 'customer',
        senderName: 'Lucas Ferreira',
        text: 'Olá, vim pelo site ambientalcontroledepragas.com.br. Precisamos de contrato mensal de desratização e sanitização para nosso centro de distribuição de 2.000m².',
        timestamp: '14:12',
        channel: 'website'
      }
    ],
    notes: ['Lead comercial de alto valor (Galpão 2.000m²). Agendar visita técnica para orçamento.']
  },
  {
    id: 'conv-3',
    customerName: 'Beatriz Lima',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    customerEmail: 'beatriz.lima@inovainvest.com',
    customerPhone: '+55 31 99988-1122',
    channel: 'instagram',
    status: 'pending',
    sentiment: 'Positivo',
    urgencyScore: 2,
    unreadCount: 0,
    lastMessageTime: 'Há 2 horas',
    assignedAgent: 'Carlos Mendes',
    tags: ['Descupinização', 'Orçamento'],
    company: 'Condomínio Bela Vista',
    messages: [
      {
        id: 'm-4',
        sender: 'customer',
        senderName: 'Beatriz Lima',
        text: 'Oi! Vi o vídeo de descupinização no Instagram de vocês. O piso de madeira do salão de festas está com farelos. Quanto custa a visita de inspeção?',
        timestamp: '12:15',
        channel: 'instagram'
      },
      {
        id: 'm-5',
        sender: 'agent',
        senderName: 'Carlos Mendes',
        text: 'Olá Beatriz! A visita técnica de inspeção para cupins em condomínios é 100% gratuita na nossa região. Posso agendar para sexta-feira pela manhã?',
        timestamp: '12:40',
        channel: 'instagram'
      }
    ],
    notes: ['Inspeção gratuita agendada para sexta-feira período da manhã.']
  }
];

export const INITIAL_VISITS: Visit[] = [
  {
    id: 'v-1',
    clientName: 'Mariana Souza',
    clientPhone: '+55 11 98877-6655',
    address: 'Rua Desembargador do Vale, 450 - Perdizes, São Paulo - SP',
    serviceType: 'Dedetização de Baratas/Formigas',
    scheduledDate: '2026-11-12',
    scheduledPeriod: 'Manhã (08h - 12h)',
    technicianName: 'Marcos Silva',
    status: 'Confirmado pelo Cliente',
    notes: 'Cliente confirmou via WhatsApp. Possui crianças pequenas (explicar ausência de cheiro).'
  },
  {
    id: 'v-2',
    clientName: 'Lucas Ferreira (TechCorp)',
    clientPhone: '+55 21 97766-5544',
    address: 'Av. Industrial, 1200 - Distrito Industrial, Guarulhos - SP',
    serviceType: 'Desratização',
    scheduledDate: '2026-11-13',
    scheduledPeriod: 'Tarde (13h - 18h)',
    technicianName: 'Roberto Santos',
    status: 'Agendado',
    notes: 'Visita técnica comercial para galpão logístico.'
  },
  {
    id: 'v-3',
    clientName: 'Beatriz Lima',
    clientPhone: '+55 31 99988-1122',
    address: 'Alameda dos Ipês, 89 ap 12 - Jardins, São Paulo - SP',
    serviceType: 'Descupinização',
    scheduledDate: '2026-11-14',
    scheduledPeriod: 'Manhã (08h - 12h)',
    technicianName: 'Marcos Silva',
    status: 'Agendado',
    notes: 'Inspeção gratuita de cupim em assoalho de madeira.'
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp-1',
    caption: 'Cansado de dividir sua cozinha com formigas e baratas? 🚫 Na Ambiental Controle de Pragas, utilizamos produtos microencapsulados sem cheiro, permitindo que você retorne ao ambiente em apenas 2 horas! Agende sua visita técnica gratuita pelo site ambientalcontroledepragas.com.br 📞 (11) 4002-8922 #Dedetizacao #ControleDePragas #AmbientalPragas #SaoPaulo',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600',
    platforms: ['instagram', 'facebook'],
    scheduledDate: '2026-11-10',
    scheduledTime: '09:00',
    status: 'Agendado'
  },
  {
    id: 'sp-2',
    caption: 'Você sabia que barulhos no gesso à noite podem ser sinais de infestação de roedores ou cupins de madeira seca? 🐀🪵 Proteja seu patrimônio com quem entende do assunto. Visita e orçamento sem compromisso! Acesse https://ambientalcontroledepragas.com.br #Desratizacao #Descupinizacao #EmpresaDeDedetizacao',
    imageUrl: 'https://images.unsplash.com/photo-1584467735811-628d011f1cb5?w=600',
    platforms: ['instagram', 'facebook'],
    scheduledDate: '2026-11-11',
    scheduledTime: '10:30',
    status: 'Agendado'
  },
  {
    id: 'sp-3',
    caption: 'Condomínios e empresas exigem laudo técnico atualizado para a Vigilância Sanitária. 📋 A Ambiental Controle de Pragas emite certificado oficial válido para alvarás e auditorias. Solicite uma proposta hoje mesmo! #VigilanciaSanitaria #DedetizadoraSP',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
    platforms: ['facebook'],
    scheduledDate: '2026-11-09',
    scheduledTime: '15:00',
    status: 'Publicado'
  }
];

export const INITIAL_KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'kb-1',
    category: 'Procedimentos e Segurança',
    title: 'Precisa sair de casa durante a dedetização?',
    content: 'Para dedetização de baratas, formigas e aranhas com produtos microencapsulados modernos, não é necessário sair de casa por dias. Recomendamos apenas ausentar o local por 2 horas após a aplicação para secagem completa. Pets devem aguardar 3 horas.',
    tags: ['dedetização', 'segurança', 'pets', 'prazo', 'site']
  },
  {
    id: 'kb-2',
    category: 'Serviços Especializados',
    title: 'Como funciona o tratamento contra cupins (Descupinização)?',
    content: 'A descupinização realizada pela Ambiental Controle de Pragas (ambientalcontroledepragas.com.br) é feita através de barreira química injetada em furos estratégicos na madeira e pulverização de calda cupinicida de alta persistência. Oferecemos garantia de até 2 anos em contratos residenciais e comerciais.',
    tags: ['cupins', 'descupinização', 'garantia', 'madeira']
  },
  {
    id: 'kb-3',
    category: 'Serviços Especializados',
    title: 'Desratização: Controle profissional de roedores (ratos e camundongos)',
    content: 'Utilizamos iscas raticidas peletizadas e parafinadas de dose única em caixas porta-iscas com chave e lacre de segurança, impedindo o acesso de crianças e animais domésticos. O mapeamento é feito nos perímetros e tocas identificados na inspeção.',
    tags: ['ratos', 'desratização', 'roedores', 'segurança']
  },
  {
    id: 'kb-4',
    category: 'Serviços Especializados',
    title: 'Sanitização e Desinfecção de Ambientes contra Vírus e Bactérias',
    content: 'Serviço executado com atomizadores a frio de ultrabaixo volume (UBV) aplicando quaternário de amônio de 5ª geração. Elimina 99,9% de vírus, bactérias, ácaros e fungos, ideal para escritórios, escolas, comércios e residências.',
    tags: ['sanitização', 'desinfecção', 'vírus', 'bactérias']
  },
  {
    id: 'kb-5',
    category: 'Agendamentos e Visitas',
    title: 'A visita técnica de inspeção e orçamento é cobrada?',
    content: 'Não! A Ambiental Controle de Pragas oferece visita técnica de inspeção e orçamento 100% gratuita em toda a região atendida. Nossos técnicos avaliam o grau de infestação, identificam a espécie da praga e indicam o melhor tratamento.',
    tags: ['visita', 'orçamento', 'gratuita', 'site']
  },
  {
    id: 'kb-6',
    category: 'Documentação e Laudos',
    title: 'Emissão de Certificado de Execução de Serviço e Laudo Técnico',
    content: 'Emitimos Certificado de Garantia e Laudo Técnico válido para apresentação à Vigilância Sanitária, prefeituras, auditorias (ISO/ANVISA) e condomínios. Nossos produtos são devidamente registrados no Ministério da Saúde/ANVISA.',
    tags: ['certificado', 'anvisa', 'laudo', 'vigilância']
  },
  {
    id: 'kb-7',
    category: 'Instruções ao Cliente',
    title: 'O que fazer antes e depois da aplicação de dedetização?',
    content: 'ANTES: Retirar alimentos expostos, guardar utensílios de cozinha em armários fechados ou sacos plásticos, recolher comedouros de pets. DEPOIS: Aguardar o período de reentrada informado pelo técnico (geralmente 2h), fazer limpeza apenas com pano úmido no chão (evitar lavar com muita água nos primeiros 3 dias para não remover o produto residual das frestas).',
    tags: ['preparo', 'limpeza', 'instruções', 'cuidados']
  },
  {
    id: 'kb-8',
    category: 'Website Oficial',
    title: 'Informações sobre o portal ambientalcontroledepragas.com.br',
    content: 'No site oficial ambientalcontroledepragas.com.br, os clientes encontram formulários de orçamento rápido, telefones de plantão 24h para emergências com pragas e artigos educativos sobre prevenção de pragas urbanas.',
    tags: ['site', 'portal', 'atendimento', '24h']
  }
];
