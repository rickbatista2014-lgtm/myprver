import { User, Post, Group, Chat, Message, Transaction } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Gabriel Silva',
  avatarUrl: 'https://picsum.photos/id/64/200/200',
  coins: 1250,
  role: 'Membro',
  isVerified: false,
  bio: 'Amante de trens, dinossauros e programação. O mundo é azul! 💙',
  followers: 450,
  following: 120,
  caregiverName: 'Maria Silva',
  childName: 'Gabriel',
  childNameColor: '#2563EB',
  childAge: '14',
  city: 'São Paulo',
  state: 'SP',
  country: 'Brasil'
};

export const MOCK_GOV_USER: User = {
  id: 'gov1',
  name: 'Secretaria de Saúde - SP',
  avatarUrl: 'https://cdn-icons-png.flaticon.com/512/921/921347.png',
  coins: 0,
  role: 'Governo',
  isVerified: true,
  bio: 'Perfil Oficial para atendimento ao cidadão.',
  followers: 10000,
  following: 0,
  cnpj: '00.000.000/0001-00'
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    content: 'Hoje consegui ir ao mercado sem fones de ouvido! Foi difícil por causa do barulho, mas consegui terminar as compras. Uma pequena vitória! 🎉',
    likes: 24,
    comments: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isLiked: false,
    type: 'regular'
  },
  {
    id: 'p_denuncia_1',
    userId: 'u3',
    type: 'denuncia',
    content: 'Absurdo! O posto de saúde do Centro recusou atendimento prioritário hoje. Disseram que "autismo não tem cara" e me fizeram esperar 2 horas com meu filho em crise. Precisamos de respeito e cumprimento da lei!',
    denunciaDetails: {
      agency: 'UBS Centro',
      location: 'São Paulo, SP'
    },
    likes: 156,
    comments: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isLiked: true,
  },
  {
    id: 'p2',
    userId: 'u3',
    content: 'Alguém mais tem hiperfoco em mapas antigos? Acabei de passar 4 horas analisando mapas de 1800. Olhem esse detalhe!',
    imageUrl: 'https://picsum.photos/id/175/800/400',
    likes: 156,
    comments: 32,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    isLiked: true,
    type: 'regular'
  },
  {
    id: 'p3',
    userId: 'u4',
    content: 'Meu filho João (6 anos) falou "mamãe" pela primeira vez hoje durante a terapia ABA. Meu coração explodiu de alegria! 💙💙💙',
    likes: 890,
    comments: 145,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isLiked: false,
    type: 'regular'
  }
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Pais Atípicos Unidos',
    description: 'Grupo de apoio para pais e mães de crianças no espectro.',
    imageUrl: 'https://picsum.photos/id/296/200/200',
    members: 15420
  },
  {
    id: 'g2',
    name: 'Artistas no Espectro',
    description: 'Compartilhe sua arte, desenhos e criações.',
    imageUrl: 'https://picsum.photos/id/305/200/200',
    members: 8540
  },
  {
    id: 'g3',
    name: 'Dicas de Terapia Ocupacional',
    description: 'Troca de experiências sobre atividades sensoriais.',
    imageUrl: 'https://picsum.photos/id/400/200/200',
    members: 12100
  }
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    userId: 'u5',
    name: 'Dra. Ana (Psicóloga)',
    avatar: 'https://picsum.photos/id/338/200/200',
    lastMessage: 'Como foi a adaptação na escola hoje?',
    unread: 1
  },
  {
    id: 'c2',
    userId: 'u2',
    name: 'Grupo de Pais da Escola',
    avatar: 'https://picsum.photos/id/50/200/200',
    lastMessage: 'Pedro: A reunião será amanhã às 19h.',
    unread: 3
  }
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', text: 'Olá Gabriel, tudo bem?', senderId: 'u5', isMe: false, timestamp: new Date(Date.now() - 1000 * 60 * 60) },
    { id: 'm2', text: 'Oi Dra., tudo sim. Tivemos um dia bom.', senderId: 'u1', isMe: true, timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 'm3', text: 'Como foi a adaptação na escola hoje?', senderId: 'u5', isMe: false, timestamp: new Date(Date.now() - 1000 * 60 * 5) }
  ]
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'credit', amount: 50, description: 'Bônus Diário', date: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 't2', type: 'debit', amount: 10, description: 'Doação para Live', date: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: 't3', type: 'credit', amount: 100, description: 'Vídeo Assistido', date: new Date(Date.now() - 1000 * 60 * 60 * 72) },
];

export const MOCK_FRIENDS = [
  { id: 'u2', name: 'Carlos Santos' },
  { id: 'u3', name: 'Marina Oliveira' },
  { id: 'u4', name: 'Roberto Almeida' }
];

export const MOCK_ADS = [
  {
    id: 'ad1',
    title: 'Clínica Integrar',
    content: 'Terapias multidisciplinares especializadas em TEA com ambiente sensorialmente adaptado.',
    imageUrl: 'https://picsum.photos/id/402/800/400',
  }
];