import React, { useState, useEffect, useRef } from 'react';
import { 
  Puzzle, Search, Heart, Bell, PlayCircle, Radio, ExternalLink, 
  Sparkles, Palette, Send, Wallet, ArrowDownLeft, ArrowUpRight, 
  Scale, Landmark, ArrowLeft, Phone, Video, Award, Megaphone, 
  Plus, Trash2, Building2, CheckCircle2
} from 'lucide-react';
import { AccessSettings, User, Post, Ad, Message, Transaction } from './types';
import { 
  MOCK_USER, MOCK_POSTS, MOCK_ADS, MOCK_CHATS, MOCK_MESSAGES, 
  MOCK_TRANSACTIONS, MOCK_GROUPS, MOCK_FRIENDS, MOCK_GOV_USER
} from './constants';
import Navigation from './components/Navigation';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';

const App: React.FC = () => {
  // --- State Management ---
  const [currentView, setCurrentView] = useState('feed');
  const [accessSettings, setAccessSettings] = useState<AccessSettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false
  });
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [ads, setAds] = useState<Ad[]>(MOCK_ADS);
  
  // Wallet View State
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [transferRecipientId, setTransferRecipientId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // Influencer View State
  const [influencerStory, setInfluencerStory] = useState('');

  // Messages View State
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [conversations] = useState(MOCK_CHATS);

  // Profile/Settings
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdContent, setNewAdContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Government/Denuncia Simulation
  const [cnpjInput, setCnpjInput] = useState('');

  // Follow/Block State
  const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(new Set(['u2'])); // Mock following u2

  // --- Handlers ---

  const handleCreatePost = (content: string, imageUrl?: string, isDenuncia?: boolean, denunciaDetails?: {agency: string, location: string}) => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      content,
      imageUrl,
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      isLiked: false,
      type: isDenuncia ? 'denuncia' : 'regular',
      denunciaDetails
    };
    setPosts([newPost, ...posts]);
    // Reward user for posting (more for complaints to encourage reporting?)
    setCurrentUser(prev => ({ ...prev, coins: prev.coins + (isDenuncia ? 10 : 5) }));
  };

  const handleOfficialResponse = (postId: string, responseText: string) => {
      if (currentUser.role !== 'Governo') return;

      setPosts(prevPosts => prevPosts.map(p => {
          if (p.id === postId) {
              return {
                  ...p,
                  officialResponse: {
                      text: responseText,
                      responderName: currentUser.name,
                      timestamp: new Date(),
                      verified: true
                  }
              };
          }
          return p;
      }));
  };

  const handleWatchVideo = () => {
    alert("Simulando exibição de vídeo recompensado...");
    setTimeout(() => {
      setCurrentUser(prev => ({ ...prev, coins: prev.coins + 10 }));
      alert("Você ganhou 10 Moedas Coração!");
    }, 2000);
  };

  const handleStartLive = () => {
      // In a real app, this would check permissions and start WebRTC
      alert("Iniciando configuração de transmissão ao vivo...");
      setCurrentView('lives');
  };

  const handleBlockUser = (userId: string) => {
    alert(`Usuário ${userId} bloqueado.`);
  };

  const handleReportUser = (userId: string) => {
    alert(`Usuário ${userId} denunciado para a moderação.`);
  };

  const handleToggleFollow = (userId: string) => {
    const newFollowed = new Set(followedUserIds);
    if (newFollowed.has(userId)) {
        newFollowed.delete(userId);
    } else {
        newFollowed.add(userId);
    }
    setFollowedUserIds(newFollowed);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };
  
  const handleEditPost = (post: Post) => {
      console.log('Editing', post);
  };

  const handleSubmitStory = () => {
      if (!influencerStory.trim()) return;
      alert("Sua história foi enviada para aprovação! Obrigado por inspirar.");
      setInfluencerStory('');
      // Reward
      setCurrentUser(prev => ({ ...prev, coins: prev.coins + 50 }));
  };

  const handleTransferCoins = () => {
      const amount = parseInt(transferAmount);
      if (isNaN(amount) || amount <= 0 || amount > currentUser.coins) {
          alert("Saldo insuficiente ou valor inválido.");
          return;
      }
      
      setCurrentUser(prev => ({ ...prev, coins: prev.coins - amount }));
      const newTransaction: Transaction = {
          id: `t${Date.now()}`,
          type: 'debit',
          amount: amount,
          description: `Transferência para usuário`,
          date: new Date()
      };
      setTransactions([newTransaction, ...transactions]);
      setTransferAmount('');
      setTransferRecipientId('');
      alert("Transferência realizada com sucesso!");
  };

  const handleSendMessage = () => {
      if (!messageInput.trim() || !activeChatId) return;
      
      const newMessage: Message = {
          id: `m${Date.now()}`,
          text: messageInput,
          senderId: currentUser.id,
          isMe: true,
          timestamp: new Date()
      };

      setChatMessages(prev => ({
          ...prev,
          [activeChatId]: [...(prev[activeChatId] || []), newMessage]
      }));
      setMessageInput('');
  };

  const handleCall = (type: 'audio' | 'video') => {
      alert(`Iniciando chamada de ${type === 'audio' ? 'voz' : 'vídeo'}...`);
  };

  const updateProfileField = (field: keyof User, value: any) => {
      setCurrentUser(prev => ({ ...prev, [field]: value }));
  };

  const handleRequestVerification = () => {
      alert("Solicitação enviada! Analisaremos seu perfil em até 5 dias úteis.");
  };

  const handleCreateAd = () => {
      if (!newAdTitle || !newAdContent) return;
      const newAd: Ad = {
          id: `ad${Date.now()}`,
          title: newAdTitle,
          content: newAdContent,
          imageUrl: 'https://picsum.photos/800/400'
      };
      setAds([...ads, newAd]);
      setNewAdTitle('');
      setNewAdContent('');
  };

  const handleDeleteAd = (id: string) => {
      setAds(ads.filter(a => a.id !== id));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  setCurrentUser(prev => ({ ...prev, avatarUrl: ev.target!.result as string }));
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };
  
  const handleToggleGovMode = () => {
      if (currentUser.role === 'Governo') {
          setCurrentUser(MOCK_USER); // Revert to normal
      } else {
          if (cnpjInput.length > 5) {
             setCurrentUser(MOCK_GOV_USER); // Switch to Gov
             setCnpjInput('');
             alert("CNPJ Validado! Você agora está logado como Entidade Governamental.");
          } else {
              alert("Digite um CNPJ válido (simulação)");
          }
      }
  }

  // --- Styles & Helpers ---
  const headerClass = `sticky top-0 z-40 border-b transition-colors ${
    accessSettings.highContrast 
      ? 'bg-black border-yellow-600 text-yellow-400 shadow-[0_4px_0_0_rgba(234,179,8,1)]' 
      : 'bg-white/80 backdrop-blur-md border-gray-100 shadow-sm text-gray-800'
  }`;

  const logoColors = ['text-red-500', 'text-blue-500', 'text-yellow-500', 'text-green-500', 'text-purple-500', 'text-orange-500'];
  
  const labelClass = `block text-xs font-bold uppercase tracking-wide mb-1 ${
      accessSettings.highContrast ? 'text-yellow-500' : 'text-gray-500'
  }`;

  const cleanInputClass = `w-full bg-transparent border-b-2 py-2 font-medium text-lg outline-none transition-colors ${
      accessSettings.highContrast 
        ? 'border-yellow-800 text-yellow-100 focus:border-yellow-400 placeholder-gray-700' 
        : 'border-gray-200 text-gray-900 focus:border-brand-blue placeholder-gray-300'
  }`;

  const activeChatUser = activeChatId ? conversations.find(c => c.id === activeChatId) : null;
  
  // Filter posts based on view. If 'denuncias', show only denuncia type. If 'feed', show regular + denuncia.
  const visiblePosts = currentView === 'denuncias' 
     ? posts.filter(p => p.type === 'denuncia')
     : posts;

  const profileUpdateStatus = { allowed: true }; // Mock status
  const userPosts = posts.filter(p => p.userId === currentUser.id);
  const totalLikes = userPosts.reduce((acc, curr) => acc + curr.likes, 0);

  // --- Render (Incorporating provided snippet) ---
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      accessSettings.highContrast ? 'bg-black text-yellow-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={headerClass}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
             <div className="flex flex-row items-center gap-3">
                 {/* New Art Logo */}
                 <div className="bg-white p-1 rounded-full shadow-sm">
                    <Puzzle size={32} className="text-brand-blue" fill="currentColor" fillOpacity={0.2} />
                 </div>
                 {accessSettings.highContrast ? (
                   <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-yellow-400">
                     AUTIST NETWORK
                   </span>
                 ) : (
                   <div className="flex flex-col leading-none justify-center">
                     <div className="flex tracking-tighter text-xl sm:text-2xl font-black">
                        {['A','u','t','i','s','t'].map((char, index) => (
                           <span key={index} className={logoColors[index % logoColors.length]}>
                             {char}
                           </span>
                        ))}
                     </div>
                     <div className="flex tracking-widest text-xs sm:text-sm font-bold text-gray-600 pl-0.5">
                        NETWORK
                     </div>
                   </div>
                 )}
             </div>
          </div>
          <div className="flex-1 max-w-xs mx-4 hidden sm:block">
            <div className="relative">
              <Search className={`absolute left-3 top-2.5 w-4 h-4 ${accessSettings.highContrast ? 'text-yellow-600' : 'text-gray-400'}`} />
              <input
                 type="text"
                 placeholder="Pesquisar..."
                 className={`w-full pl-10 pr-4 py-2 rounded-full text-sm outline-none focus:ring-2
                   ${accessSettings.highContrast ? 'bg-gray-900 border border-yellow-600 text-yellow-400 focus:ring-yellow-400' : 'bg-gray-100 border-transparent focus:bg-white focus:ring-brand-blue'}
                `}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Coins Display */}
            <div
                 onClick={() => setCurrentView('wallet')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold cursor-pointer transition-transform hover:scale-105 ${accessSettings.highContrast ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}
                 title="Suas Moedas Coração - Clique para ver carteira"
            >
                <Heart size={16} fill="currentColor" className="text-yellow-500" />
                <span>{currentUser?.coins}</span>
            </div>
            <button className="relative p-2 rounded-full hover:bg-gray-100/10">
              <Bell className={accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-600'} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <img
               src={currentUser?.avatarUrl}
               alt="Perfil"
               className="w-9 h-9 rounded-full border border-gray-200 cursor-pointer object-cover"
              onClick={() => setCurrentView('profile')}
            />
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row pt-6 min-h-[calc(100vh-64px)]">
        {/* Navigation Sidebar */}
        <Navigation currentView={currentView} onNavigate={setCurrentView} access={accessSettings} />
        {/* Main Content Area */}
        <main className="flex-1 px-4 md:pl-8 md:pr-4 pb-24 md:pb-8">
            
            {(currentView === 'feed' || currentView === 'denuncias') && (
            <div className="animate-fade-in">
               
               {currentView === 'denuncias' && (
                   <div className={`p-6 mb-6 rounded-xl border-l-4 ${accessSettings.highContrast ? 'bg-gray-900 border-red-500' : 'bg-red-50 border-red-500'}`}>
                       <h2 className={`text-xl font-bold mb-2 flex items-center gap-2 ${accessSettings.highContrast ? 'text-red-400' : 'text-red-700'}`}>
                           <Megaphone size={24} /> Canal de Denúncias Públicas
                       </h2>
                       <p className={`text-sm ${accessSettings.highContrast ? 'text-gray-300' : 'text-gray-700'}`}>
                           Espaço seguro para relatar falta de atendimento, preconceito ou negligência em serviços públicos de Saúde e Educação.
                           Os órgãos competentes responderão oficialmente através do selo verificado.
                       </p>
                   </div>
               )}

               {/* Meu Diário Section (Hidden in denuncias view to focus on feed/reporting) */}
               {currentView === 'feed' && (
                   <>
                       <div className="flex flex-col items-center mb-6" onClick={() => document.getElementById('create-post-textarea')?.focus()}>
                           <button
                              className="flex flex-col items-center gap-1 group transition-transform hover:scale-105"
                             title="Escrever no meu diário"
                           >
                               {/* DIARY IMAGE CHANGED TO CELLPHONE IMAGE */}
                               <img
                                    src="https://cdn-icons-png.flaticon.com/512/644/644458.png"
                                    alt="Ícone de Celular"
                                   className="w-16 h-16 object-contain drop-shadow-md mb-1"
                               />
                               <div className="relative">
                                  <h3 className={`text-xl font-bold ${logoColors[2]} font-handwriting`}>Meu Diário</h3>
                               </div>
                           </button>
                       </div>
                       {/* New Monetization & Live Features Section */}
                       <div className="grid grid-cols-2 gap-4 mb-6">
                           <button
                              onClick={handleWatchVideo}
                             className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm
                                ${accessSettings.highContrast ? 'bg-gray-900 border border-yellow-500 text-yellow-400' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-800'}`}
                           >
                               <div className="bg-white p-2 rounded-full shadow-sm">
                                   <PlayCircle size={24} className="text-yellow-500" />
                               </div>
                               <div className="text-center">
                                   <span className="block font-bold text-sm">Assistir Vídeos</span>
                                   <span className="text-xs opacity-80 flex items-center justify-center gap-1">Ganhe <Heart size={10} fill="currentColor"/> Coins</span>
                               </div>
                           </button>
                           <button
                              onClick={handleStartLive}
                             className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm
                                ${accessSettings.highContrast ? 'bg-gray-900 border border-red-500 text-red-400' : 'bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 text-red-800'}`}
                           >
                               <div className="bg-white p-2 rounded-full shadow-sm">
                                   <Radio size={24} className="text-red-500" />
                               </div>
                               <div className="text-center">
                                   <span className="block font-bold text-sm">Fazer Live</span>
                                   <span className="text-xs opacity-80">Ao Vivo</span>
                               </div>
                           </button>
                       </div>
                   </>
               )}
               
               <CreatePost user={currentUser!} onPostCreate={handleCreatePost} access={accessSettings} />
               
               <div className="flex gap-2 mb-6 overflow-x-auto py-2 no-scrollbar">
                  <button onClick={() => setCurrentView('feed')} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${currentView === 'feed' ? (accessSettings.highContrast ? 'bg-yellow-400 text-black' : 'bg-black text-white') : (accessSettings.highContrast ? 'border border-yellow-400' : 'bg-white text-gray-600 border border-gray-200')}`}>Todos</button>
                  <button className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${accessSettings.highContrast ? 'border border-yellow-400' : 'bg-white text-gray-600 border border-gray-200'}`}>Seguindo</button>
                  <button onClick={() => setCurrentView('denuncias')} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 ${currentView === 'denuncias' ? 'bg-red-600 text-white' : (accessSettings.highContrast ? 'border border-red-400 text-red-400' : 'bg-white text-red-600 border border-red-200')}`}>
                      <Megaphone size={14} /> Denúncias
                  </button>
               </div>
               
               {visiblePosts.length === 0 && currentView === 'denuncias' ? (
                   <div className="text-center py-10 opacity-60">
                       <Megaphone size={48} className="mx-auto mb-2 text-gray-300" />
                       <p>Nenhuma denúncia registrada.</p>
                   </div>
               ) : (
                   visiblePosts.map((post, index) => (
                     <React.Fragment key={post.id}>
                        {/* Inject Ad every 2 posts if ads available */}
                        {(index > 0 && index % 2 === 0 && ads.length > 0 && currentView !== 'denuncias') && (
                            <div className={`mb-6 rounded-xl overflow-hidden border ${accessSettings.highContrast ? 'border-yellow-600 bg-gray-900' : 'bg-white border-blue-100 shadow-sm'}`}>
                                 <div className="p-3 bg-gray-100 flex justify-between items-center">
                                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Patrocinado</span>
                                     <ExternalLink size={14} className="text-gray-400" />
                                 </div>
                                 <div className="p-4">
                                     {ads[index % ads.length].imageUrl && (
                                         <img src={ads[index % ads.length].imageUrl} className="w-full h-40 object-cover rounded-lg mb-3" alt="Anúncio" />
                                     )}
                                     <h4 className={`font-bold text-lg mb-1 ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>{ads[index % ads.length].title}</h4>
                                     <p className={`text-sm ${accessSettings.highContrast ? 'text-yellow-100' : 'text-gray-600'}`}>{ads[index % ads.length].content}</p>
                                     <button className="mt-3 w-full py-2 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700">Saiba Mais</button>
                                 </div>
                            </div>
                        )}
                        <PostCard
                           post={post}
                           access={accessSettings}
                           currentUserId={currentUser?.id}
                           currentUserRole={currentUser?.role}
                          onBlockUser={handleBlockUser}
                          onReportUser={handleReportUser}
                          onToggleFollow={handleToggleFollow}
                          onDeletePost={handleDeletePost}
                          onEditPost={handleEditPost}
                          onOfficialResponse={handleOfficialResponse}
                          isFollowing={followedUserIds.has(post.userId)}
                        />
                     </React.Fragment>
                   ))
               )}
               
               <div className="text-center py-8 text-gray-400 text-sm">
                 Você chegou ao fim das novidades de hoje. 💙
               </div>
            </div>
          )}
          {currentView === 'influencer' && (
              <div className="animate-fade-in space-y-6">
                  <div className={`p-8 rounded-2xl relative overflow-hidden ${accessSettings.highContrast ? 'bg-fuchsia-900 border-2 border-fuchsia-400' : 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg'}`}>
                      <div className="relative z-10 text-center">
                          <div className="flex justify-center mb-4">
                              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                                <Sparkles size={48} className="text-yellow-300 drop-shadow-md" fill="currentColor" />
                              </div>
                          </div>
                          <h2 className="text-3xl font-black mb-2 tracking-tight">Autist Influencer</h2>
                          <p className="text-lg opacity-90 max-w-lg mx-auto">
                              Compartilhe sua jornada, suas vitórias diárias e mostre ao mundo como o autismo é uma parte única da sua história. Você inspira!
                          </p>
                      </div>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
                  </div>
                  <div className={`p-6 rounded-xl border ${accessSettings.highContrast ? 'bg-gray-900 border-fuchsia-500' : 'bg-white border-fuchsia-100 shadow-sm'}`}>
                      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${accessSettings.highContrast ? 'text-fuchsia-400' : 'text-fuchsia-700'}`}>
                          <Palette size={20} /> Conte sua História
                      </h3>
                      <textarea
                          value={influencerStory}
                          onChange={(e) => setInfluencerStory(e.target.value)}
                          placeholder="Como foi o seu dia? O que você superou hoje? Como você vê o mundo de uma forma única? Escreva aqui..."
                          className={`w-full p-4 rounded-xl min-h-[150px] outline-none border focus:ring-2 transition-all
                              ${accessSettings.highContrast ? 'bg-black border-fuchsia-700 text-white placeholder-gray-500 focus:ring-fuchsia-500' : 'bg-fuchsia-50 border-fuchsia-200 text-gray-800 placeholder-fuchsia-300 focus:bg-white focus:ring-fuchsia-300'}
                          `}
                      />
                      <div className="flex justify-end mt-4">
                          <button
                             onClick={handleSubmitStory}
                            className={`px-8 py-3 rounded-full font-bold shadow-md transition-transform hover:scale-105
                                ${accessSettings.highContrast ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-500' : 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white hover:opacity-90'}
                            `}
                          >
                              Publicar Minha História
                          </button>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <h3 className={`text-xl font-bold ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>Histórias Inspiradoras</h3>
                      <div className={`p-4 rounded-xl border ${accessSettings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                          <div className="flex items-start gap-4">
                              <img src="https://picsum.photos/201" className="w-12 h-12 rounded-full object-cover" alt="Avatar"/>
                              <div>
                                  <h4 className="font-bold">João (Autista Adulto)</h4>
                                  <p className={`text-sm mt-1 ${accessSettings.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                                      "Ser autista influenciador não é sobre ter milhões de seguidores, é sobre influenciar uma pessoa a entender melhor o espectro. Hoje falei sobre minha coleção de trens e como ela me acalma."
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                      <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full font-bold">#Hiperfoco</span>
                                      <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full font-bold">#OrgulhoAutista</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${accessSettings.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                          <div className="flex items-start gap-4">
                              <img src="https://picsum.photos/205" className="w-12 h-12 rounded-full object-cover" alt="Avatar"/>
                              <div>
                                  <h4 className="font-bold">Lucas (12 anos)</h4>
                                  <p className={`text-sm mt-1 ${accessSettings.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                                      "Gosto de desenhar dinossauros. Minha mãe disse que minha arte pode ajudar outras crianças a desenharem também. Vou começar a postar meus tutoriais aqui!"
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                      <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full font-bold">#Arte</span>
                                      <span className="text-xs bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full font-bold">#FuturoInfluencer</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}
          {currentView === 'wallet' && currentUser && (
              <div className="animate-fade-in space-y-6">
                  <h2 className={`text-2xl font-bold ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>Minha Carteira</h2>
                  
                  {/* Balance Card */}
                  <div className={`p-8 rounded-2xl relative overflow-hidden ${accessSettings.highContrast ? 'bg-yellow-900 border-2 border-yellow-400' : 'bg-gradient-to-r from-orange-400 to-yellow-500 text-white shadow-lg'}`}>
                      <div className="relative z-10 flex flex-col items-center justify-center">
                          <span className="text-sm font-bold opacity-90 uppercase tracking-widest mb-2">Saldo Total</span>
                          <div className="flex items-center gap-3">
                              <Heart size={48} fill="currentColor" className="text-white drop-shadow-md" />
                              <span className="text-6xl font-extrabold drop-shadow-md">{currentUser.coins}</span>
                          </div>
                          <span className="text-lg font-medium mt-1">Moedas Coração</span>
                      </div>
                      {/* Decorative Circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>
                  </div>
                  {/* Transfer Section */}
                  <div className={`p-6 rounded-xl border ${accessSettings.highContrast ? 'bg-gray-900 border-yellow-500' : 'bg-white border-gray-200'}`}>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Send size={20} /> Transferir para Amigo
                      </h3>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-bold mb-1 opacity-70">Para quem?</label>
                              <select
                                   value={transferRecipientId}
                                  onChange={(e) => setTransferRecipientId(e.target.value)}
                                  className="w-full p-3 rounded-lg border outline-none bg-gray-50 focus:bg-white transition-colors"
                              >
                                  <option value="">Selecione um usuário...</option>
                                  {MOCK_FRIENDS.map(f => (
                                      <option key={f.id} value={f.id}>{f.name}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold mb-1 opacity-70">Quantidade</label>
                              <div className="relative">
                                  <Heart size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                  <input
                                       type="number"
                                      value={transferAmount}
                                      onChange={(e) => setTransferAmount(e.target.value)}
                                      placeholder="0"
                                      className="w-full p-3 pl-10 rounded-lg border outline-none bg-gray-50 focus:bg-white transition-colors"
                                  />
                              </div>
                          </div>
                          <button
                               onClick={handleTransferCoins}
                              disabled={!transferRecipientId || !transferAmount}
                              className={`w-full py-3 rounded-lg font-bold transition-colors ${!transferRecipientId || !transferAmount ? 'bg-gray-200 text-gray-400' : 'bg-brand-blue text-white hover:bg-blue-600'}`}
                          >
                              Enviar Moedas
                          </button>
                      </div>
                  </div>
                  {/* Transaction History */}
                  <div className={`rounded-xl overflow-hidden ${accessSettings.highContrast ? 'bg-gray-900 border border-yellow-600' : 'bg-white shadow-sm border border-gray-100'}`}>
                      <div className={`p-4 border-b font-bold flex items-center gap-2 ${accessSettings.highContrast ? 'border-yellow-600 text-yellow-400' : 'border-gray-100 text-gray-800'}`}>
                          <Wallet size={20} /> Histórico de Transações
                      </div>
                      <div className="divide-y divide-gray-100">
                          {transactions.length > 0 ? transactions.map(t => (
                              <div key={t.id} className={`p-4 flex justify-between items-center ${accessSettings.highContrast ? 'border-gray-800' : ''}`}>
                                  <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-full ${t.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                          {t.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                      </div>
                                      <div>
                                          <div className={`font-bold ${accessSettings.highContrast ? 'text-yellow-200' : 'text-gray-800'}`}>{t.description}</div>
                                          <div className={`text-xs ${accessSettings.highContrast ? 'text-yellow-100' : 'text-gray-500'}`}>
                                              {t.date.toLocaleDateString()} às {t.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                          </div>
                                      </div>
                                  </div>
                                  <div className={`font-bold text-lg ${t.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                      {t.type === 'credit' ? '+' : '-'}{t.amount}
                                  </div>
                              </div>
                          )) : (
                              <div className="p-8 text-center text-gray-500">Nenhuma transação ainda.</div>
                          )}
                      </div>
                  </div>
              </div>
          )}
          {currentView === 'rights' && (
              <div className="animate-fade-in space-y-6">
                  <h2 className={`text-2xl font-bold ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>Direitos & Ações Governamentais</h2>
                  
                  {/* Direitos Section */}
                  <div className={`p-6 rounded-xl border ${accessSettings.highContrast ? 'bg-gray-900 border-yellow-500' : 'bg-white border-blue-100 shadow-sm'}`}>
                      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${accessSettings.highContrast ? 'text-yellow-300' : 'text-brand-blue'}`}>
                          <Scale size={24} /> Direitos da Pessoa com Autismo
                      </h3>
                      <ul className={`space-y-4 list-disc pl-5 ${accessSettings.highContrast ? 'text-yellow-100' : 'text-gray-700'}`}>
                          <li>
                              <strong>Lei Berenice Piana (12.764/12):</strong> Considera o autismo como deficiência para todos os efeitos legais, garantindo acesso a direitos previstos em lei.
                          </li>
                          <li>
                              <strong>CIPTEA (Carteira de Identificação):</strong> Garante atenção integral, pronto atendimento e prioridade no acesso e atendimento aos serviços públicos e privados.
                          </li>
                          <li>
                              <strong>BPC/LOAS:</strong> Benefício de um salário mínimo mensal para pessoas com deficiência que comprovem não possuir meios de prover a própria manutenção (renda per capita familiar inferior a 1/4 do salário mínimo).
                          </li>
                          <li>
                              <strong>Atendimento Prioritário:</strong> Obrigatório em bancos, repartições públicas, empresas concessionárias de serviços públicos e hospitais.
                          </li>
                          <li>
                              <strong>Educação Inclusiva:</strong> Direito à matrícula em escolas regulares e, se necessário, acompanhante especializado sem custo adicional.
                          </li>
                          <li>
                              <strong>Vagas de Estacionamento:</strong> Direito ao cartão de estacionamento para vaga especial (PCD).
                          </li>
                      </ul>
                  </div>
                  {/* Governo Section */}
                  <div className={`p-6 rounded-xl border ${accessSettings.highContrast ? 'bg-gray-900 border-yellow-500' : 'bg-white border-green-100 shadow-sm'}`}>
                      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${accessSettings.highContrast ? 'text-yellow-300' : 'text-green-700'}`}>
                          <Landmark size={24} /> O que o Governo tem feito?
                      </h3>
                      <ul className={`space-y-4 list-disc pl-5 ${accessSettings.highContrast ? 'text-yellow-100' : 'text-gray-700'}`}>
                          <li>
                              <strong>Rede de Cuidados no SUS:</strong> Ampliação dos Centros Especializados em Reabilitação (CER) para diagnóstico precoce e terapias multidisciplinares.
                          </li>
                          <li>
                              <strong>Política Nacional de Educação Especial:</strong> Programas para formação de professores e adaptação de materiais didáticos.
                          </li>
                          <li>
                              <strong>Isenção de Impostos:</strong> Isenção de IPI, ICMS e IPVA na compra de veículos novos para transporte da pessoa autista (condutor ou não condutor).
                          </li>
                          <li>
                              <strong>Transporte Gratuito:</strong> Passe Livre Interestadual para pessoas carentes com deficiência.
                          </li>
                          <li>
                              <strong>Censo IBGE:</strong> Inclusão do autismo no Censo para melhor mapeamento e criação de políticas públicas direcionadas.
                          </li>
                      </ul>
                  </div>
              </div>
          )}
          {currentView === 'lives' && (
              <div className="animate-fade-in space-y-4">
                  <h2 className={`text-2xl font-bold mb-4 ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>Lives Ao Vivo</h2>
                  
                  <div className={`p-8 rounded-xl text-center border-2 border-dashed ${accessSettings.highContrast ? 'border-yellow-600 bg-gray-900' : 'border-gray-300 bg-gray-50'}`}>
                      <Radio size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-bold mb-2">Nenhuma transmissão agora</h3>
                      <p className="mb-4 text-gray-500">Que tal começar a sua?</p>
                      <button
                         onClick={handleStartLive}
                        className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600"
                      >
                          Iniciar Transmissão
                      </button>
                  </div>
              </div>
          )}
          {currentView === 'groups' && (
            <div className="animate-fade-in space-y-4">
               <h2 className={`text-2xl font-bold mb-4 ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>Grupos de Apoio</h2>
               {MOCK_GROUPS.map(group => (
                 <div key={group.id} className={`p-4 rounded-xl flex gap-4 items-center ${accessSettings.highContrast ? 'border border-yellow-400 bg-black' : 'bg-white shadow-sm border border-gray-100'}`}>
                    <img src={group.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-gray-200" alt={group.name}/>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{group.name}</h3>
                      <p className={`text-sm ${accessSettings.highContrast ? 'text-yellow-100' : 'text-gray-500'}`}>{group.description}</p>
                      <span className="text-xs mt-1 block opacity-70">{group.members} participantes</span>
                    </div>
                    <button className={`px-4 py-2 rounded-lg font-bold text-sm ${accessSettings.highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-brand-blue hover:bg-blue-200'}`}>
                      Entrar
                    </button>
                 </div>
               ))}
            </div>
          )}
          {currentView === 'messages' && (
             <div className={`h-[calc(100vh-140px)] flex flex-col md:flex-row rounded-xl shadow-sm border overflow-hidden ${accessSettings.highContrast ? 'bg-black border-yellow-400' : 'bg-white border-gray-200'}`}>
                 {/* Sidebar Contact List */}
                 <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 border-r ${accessSettings.highContrast ? 'border-yellow-900' : 'border-gray-100'}`}>
                     <div className={`p-4 border-b font-bold ${accessSettings.highContrast ? 'border-yellow-900 text-yellow-400' : 'border-gray-100 text-gray-800'}`}>Conversas</div>
                     <div className="flex-1 overflow-y-auto">
                         {conversations.map(chat => (
                             <button
                                key={chat.id}
                               onClick={() => setActiveChatId(chat.id)}
                               className={`w-full p-4 flex items-center gap-3 hover:bg-opacity-10 transition-colors text-left
                                   ${activeChatId === chat.id
                                      ? (accessSettings.highContrast ? 'bg-yellow-900' : 'bg-blue-50')
                                      : (accessSettings.highContrast ? 'hover:bg-yellow-900' : 'hover:bg-gray-50')}
                               `}
                             >
                                 <div className="relative">
                                     <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" alt={chat.name}/>
                                     {chat.unread > 0 && (
                                         <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                                             {chat.unread}
                                         </span>
                                     )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <div className={`font-bold truncate ${accessSettings.highContrast ? 'text-yellow-300' : 'text-gray-900'}`}>{chat.name}</div>
                                     <div className={`text-sm truncate ${accessSettings.highContrast ? 'text-yellow-100' : 'text-gray-500'}`}>{chat.lastMessage}</div>
                                 </div>
                             </button>
                         ))}
                     </div>
                 </div>
                 {/* Chat Area */}
                 {activeChatId && activeChatUser ? (
                     <div className="flex-1 flex flex-col h-full">
                         {/* Chat Header */}
                         <div className={`p-3 border-b flex justify-between items-center ${accessSettings.highContrast ? 'bg-gray-900 border-yellow-900' : 'bg-gray-50 border-gray-100'}`}>
                             <div className="flex items-center gap-3">
                                 <button onClick={() => setActiveChatId(null)} className="md:hidden p-1">
                                     <ArrowLeft size={20} className={accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-600'} />
                                 </button>
                                 <img src={activeChatUser.avatar} className="w-10 h-10 rounded-full object-cover" alt={activeChatUser.name} />
                                 <span className={`font-bold ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>{activeChatUser.name}</span>
                             </div>
                             <div className="flex gap-4 pr-2">
                                 <button
                                    onClick={() => handleCall('audio')}
                                   className={`p-2 rounded-full ${accessSettings.highContrast ? 'text-yellow-400 hover:bg-yellow-900' : 'text-brand-blue hover:bg-blue-100'}`}
                                   title="Chamada de Voz"
                                 >
                                     <Phone size={24} />
                                 </button>
                                 <button
                                    onClick={() => handleCall('video')}
                                   className={`p-2 rounded-full ${accessSettings.highContrast ? 'text-yellow-400 hover:bg-yellow-900' : 'text-brand-blue hover:bg-blue-100'}`}
                                   title="Chamada de Vídeo"
                                 >
                                     <Video size={24} />
                                 </button>
                             </div>
                         </div>
                         {/* Messages List */}
                         <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${accessSettings.highContrast ? 'bg-black' : 'bg-white'}`}>
                             {chatMessages[activeChatId]?.map(msg => (
                                 <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                     <div className={`max-w-[80%] p-3 rounded-2xl ${
                                         msg.isMe
                                            ? (accessSettings.highContrast ? 'bg-yellow-600 text-black' : 'bg-brand-blue text-white rounded-br-none')
                                            : (accessSettings.highContrast ? 'bg-gray-800 text-yellow-100' : 'bg-gray-100 text-gray-800 rounded-bl-none')
                                     }`}>
                                         <p>{msg.text}</p>
                                         <span className={`text-[10px] block mt-1 opacity-70 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                                             {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                         </span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         {/* Input Area */}
                         <div className={`p-3 border-t flex gap-2 items-center ${accessSettings.highContrast ? 'bg-gray-900 border-yellow-900' : 'bg-white border-gray-100'}`}>
                             <input
                                value={messageInput}
                               onChange={(e) => setMessageInput(e.target.value)}
                               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                               placeholder="Digite sua mensagem..."
                               className={`flex-1 p-2.5 rounded-full outline-none border ${
                                   accessSettings.highContrast
                                      ? 'bg-black border-yellow-600 text-yellow-400 placeholder-yellow-700'
                                      : 'bg-gray-100 border-transparent focus:bg-white focus:border-brand-blue'
                               }`}
                             />
                             <button
                                onClick={handleSendMessage}
                               disabled={!messageInput.trim()}
                               className={`p-3 rounded-full transition-all ${
                                   messageInput.trim()
                                      ? (accessSettings.highContrast ? 'bg-yellow-400 text-black' : 'bg-brand-blue text-white shadow-md')
                                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                               }`}
                             >
                                 <Send size={20} />
                             </button>
                         </div>
                     </div>
                 ) : (
                     <div className={`hidden md:flex flex-1 items-center justify-center flex-col gap-4 ${accessSettings.highContrast ? 'text-yellow-600' : 'text-gray-300'}`}>
                         <div className="bg-gray-100 p-6 rounded-full dark:bg-gray-800">
                            <Send size={48} />
                         </div>
                         <p className="text-lg font-medium">Selecione uma conversa para começar</p>
                     </div>
                 )}
             </div>
          )}
          {currentView === 'profile' && currentUser && (
             <div className={`p-6 rounded-xl text-center ${accessSettings.highContrast ? 'border border-yellow-400' : 'bg-white shadow-sm'}`}>
                <img src={currentUser.avatarUrl} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-brand-soft" alt="Profile" />
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    {currentUser.name}
                    {currentUser.isVerified && (
                        <div className="relative group">
                            <img
                             src="https://cdn-icons-png.flaticon.com/512/10696/10696383.png"
                             alt="Verificado"
                             title="Perfil Verificado (100k+)"
                            className="w-8 h-8 object-contain drop-shadow-md filter saturate-150 contrast-125"
                            />
                            <div className="absolute inset-0 rounded-full ring-2 ring-white ring-opacity-50"></div>
                        </div>
                    )}
                </h2>
                
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${accessSettings.highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-brand-blue'}`}>
                  {currentUser.role}
                </span>
                {/* Extended Profile Information Inputs - Clean Layout */}
                <div className="mt-8 mb-8 text-left max-w-lg mx-auto space-y-5">
                    <div>
                        <label className={labelClass}>Responsável</label>
                        <input
                           type="text"
                           value={currentUser.caregiverName || ''}
                           onChange={(e) => updateProfileField('caregiverName', e.target.value)}
                          placeholder="Digite o nome..."
                          className={cleanInputClass}
                        />
                    </div>
                    <div className="flex gap-6">
                        <div className="flex-1 relative">
                            <label className={labelClass}>Criança</label>
                            <div className="flex items-center gap-2">
                                <input
                                   type="text"
                                   value={currentUser.childName || ''}
                                   onChange={(e) => updateProfileField('childName', e.target.value)}
                                  placeholder="Nome"
                                  className={cleanInputClass}
                                  style={{ color: currentUser.childNameColor }}
                                />
                                <div className="relative group">
                                    <input
                                         type="color"
                                         value={currentUser.childNameColor || '#000000'}
                                        onChange={(e) => updateProfileField('childNameColor', e.target.value)}
                                        className="w-8 h-8 rounded-full border-none cursor-pointer overflow-hidden p-0"
                                        title="Escolha a cor do nome"
                                    />
                                    <Palette size={16} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white mix-blend-difference" />
                                </div>
                            </div>
                        </div>
                        <div className="w-24">
                            <label className={labelClass}>Idade</label>
                            <input
                               type="text"
                               value={currentUser.childAge || ''}
                               onChange={(e) => updateProfileField('childAge', e.target.value)}
                              placeholder="00"
                              className={cleanInputClass}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Cidade</label>
                            <input
                               type="text"
                               value={currentUser.city || ''}
                               onChange={(e) => updateProfileField('city', e.target.value)}
                              className={cleanInputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Estado</label>
                            <input
                               type="text"
                               value={currentUser.state || ''}
                               onChange={(e) => updateProfileField('state', e.target.value)}
                              className={cleanInputClass}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>País</label>
                        <input
                           type="text"
                           value={currentUser.country || ''}
                           onChange={(e) => updateProfileField('country', e.target.value)}
                              className={cleanInputClass}
                        />
                    </div>
                </div>
                <p className="mt-4 max-w-md mx-auto opacity-80">{currentUser.bio}</p>
                
                <div className="flex justify-center items-center gap-4 sm:gap-8 mt-6 border-t border-b py-4 opacity-80 border-gray-200 flex-wrap">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="font-bold text-xl">{currentUser.followers}</div>
                      <div className="text-xs uppercase text-gray-500 font-bold">Seguidores</div>
                    </div>
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="font-bold text-xl">{currentUser.following}</div>
                      <div className="text-xs uppercase text-gray-500 font-bold">Seguindo</div>
                    </div>
                    
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="font-bold text-xl">{userPosts.length}</div>
                      <div className="text-xs uppercase text-gray-500 font-bold">Posts</div>
                    </div>
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="flex items-center gap-1">
                         <span className="font-bold text-xl">{totalLikes}</span>
                         <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                      </div>
                      <div className="text-xs uppercase text-gray-500 font-bold">Curtidas</div>
                    </div>
                </div>
                {/* Verification Request Section */}
                {!currentUser.isVerified && (
                    <div className={`mt-8 p-4 rounded-xl text-left border ${accessSettings.highContrast ? 'bg-gray-900 border-yellow-600' : 'bg-gray-50 border-gray-100'}`}>
                        <h3 className={`font-bold mb-2 flex items-center gap-2 ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>
                            <Award size={20} className="text-brand-blue" />
                            Verificação de Perfil
                        </h3>
                        <p className={`text-sm mb-4 ${accessSettings.highContrast ? 'text-yellow-100' : 'text-gray-600'}`}>
                            Alcance 100.000 seguidores para solicitar o selo oficial "Coração Autista".
                        </p>
                        
                        <div className="mb-4">
                            <div className="flex justify-between text-xs font-bold mb-1 opacity-70">
                                <span>Progresso</span>
                                <span>{currentUser.followers.toLocaleString()} / 100.000</span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                     className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                                    style={{ width: `${Math.min((currentUser.followers / 100000) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        {currentUser.followers >= 100000 ? (
                            <button
                                 onClick={handleRequestVerification}
                                className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold shadow-md hover:opacity-90 transition-opacity"
                            >
                                Solicitar Selo Oficial
                            </button>
                        ) : (
                            <button
                                 disabled
                                className="w-full py-2 bg-gray-300 text-gray-500 rounded-lg font-bold cursor-not-allowed"
                            >
                                Complete a meta para solicitar
                            </button>
                        )}
                    </div>
                )}
             </div>
          )}
          {currentView === 'settings' && currentUser && (
              <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
                  <h2 className={`text-2xl font-bold mb-6 ${accessSettings.highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>Configurações da Conta</h2>
                  
                  {/* DEVELOPER MODE TOGGLE - SIMULATION */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-sm font-bold text-gray-600">Modo Desenvolvedor / Admin</span>
                      <button
                         onClick={() => setIsDeveloperMode(!isDeveloperMode)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${isDeveloperMode ? 'bg-black text-green-400' : 'bg-gray-200 text-gray-500'}`}
                      >
                          {isDeveloperMode ? 'ATIVADO' : 'DESATIVADO'}
                      </button>
                  </div>
                  {isDeveloperMode && (
                      <div className="p-6 rounded-xl border-2 border-indigo-100 bg-indigo-50">
                          <h3 className="text-lg font-bold mb-4 text-indigo-900 flex items-center gap-2">
                              <Megaphone size={20} /> Painel de Anúncios (Admin)
                          </h3>
                          
                          <div className="space-y-4 mb-6">
                              <input
                                   type="text"
                                   placeholder="Título do Anúncio (ex: Clínica ABC)"
                                  value={newAdTitle}
                                  onChange={(e) => setNewAdTitle(e.target.value)}
                                  className="w-full p-2 rounded border border-indigo-200"
                              />
                              <textarea
                                   placeholder="Texto do Anúncio..."
                                  value={newAdContent}
                                  onChange={(e) => setNewAdContent(e.target.value)}
                                  className="w-full p-2 rounded border border-indigo-200 h-20"
                              />
                              <button
                                   onClick={handleCreateAd}
                                  className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"
                              >
                                  <Plus size={16} /> Criar Anúncio
                              </button>
                          </div>
                          <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase text-indigo-400">Anúncios Ativos ({ads.length})</h4>
                              {ads.map(ad => (
                                  <div key={ad.id} className="bg-white p-3 rounded-lg border border-indigo-100 flex justify-between items-center">
                                      <span className="font-bold text-sm text-indigo-900">{ad.title}</span>
                                      <button onClick={() => handleDeleteAd(ad.id)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                                          <Trash2 size={16} />
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* GOVERNMENT SIMULATION SECTION */}
                  <div className={`p-6 rounded-xl border-2 ${accessSettings.highContrast ? 'bg-gray-900 border-green-500' : 'bg-green-50 border-green-200'}`}>
                      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${accessSettings.highContrast ? 'text-green-400' : 'text-green-800'}`}>
                          <Building2 size={20} /> Entidade Governamental
                      </h3>
                      <p className="text-sm mb-4 opacity-80">
                          Área exclusiva para órgãos públicos responderem a denúncias. Necessário validação via CNPJ.
                      </p>
                      
                      {currentUser.role === 'Governo' ? (
                          <div className="flex items-center justify-between">
                              <span className="font-bold text-green-600 flex items-center gap-2"><CheckCircle2 size={16}/> Conta Verificada (Governo)</span>
                              <button onClick={handleToggleGovMode} className="text-xs text-red-500 underline font-bold">Sair do Modo Governo</button>
                          </div>
                      ) : (
                          <div className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="Digite o CNPJ do Órgão"
                                value={cnpjInput}
                                onChange={(e) => setCnpjInput(e.target.value)}
                                className={`flex-1 p-2 rounded border outline-none ${accessSettings.highContrast ? 'bg-black border-green-700 text-white' : 'bg-white border-green-300'}`}
                              />
                              <button 
                                onClick={handleToggleGovMode}
                                className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
                              >
                                  Validar
                              </button>
                          </div>
                      )}
                  </div>


                  {/* Photo Section */}
                  <div className={`p-6 rounded-xl ${accessSettings.highContrast ? 'bg-gray-900 border border-yellow-600' : 'bg-white shadow-sm border border-gray-100'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${accessSettings.highContrast ? 'text-yellow-300' : 'text-gray-700'}`}>Foto do Perfil</h3>
                      <div className="flex items-center gap-6">
                          <img src={currentUser.avatarUrl} alt="Atual" className="w-20 h-20 rounded-full object-cover border-2 border-brand-soft" />
                          <div>
                              <input
                                   type="file"
                                   ref={fileInputRef}
                                   className="hidden"
                                   accept="image/*"
                                  onChange={handleAvatarUpload}
                                  disabled={!profileUpdateStatus.allowed}
                              />
                              <button
                                   onClick={() => fileInputRef.current?.click()}
                                  disabled={!profileUpdateStatus.allowed}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                                      !profileUpdateStatus.allowed
                                       ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                      : (accessSettings.highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-100 text-brand-blue hover:bg-blue-200')
                                  }`}
                              >
                                  Trocar Foto
                              </button>
                          </div>
                      </div>
                  </div>
                  
                  {/* Accessibility Settings */}
                  <div className={`p-6 rounded-xl ${accessSettings.highContrast ? 'bg-gray-900 border border-yellow-600' : 'bg-white shadow-sm border border-gray-100'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${accessSettings.highContrast ? 'text-yellow-300' : 'text-gray-700'}`}>Acessibilidade</h3>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                              <span className="font-medium">Alto Contraste</span>
                              <button
                                   onClick={() => setAccessSettings(prev => ({...prev, highContrast: !prev.highContrast}))}
                                  className={`w-12 h-6 rounded-full transition-colors relative ${accessSettings.highContrast ? 'bg-yellow-400' : 'bg-gray-300'}`}
                              >
                                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${accessSettings.highContrast ? 'left-7' : 'left-1'}`}></div>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;