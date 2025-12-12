import React, { useState } from 'react';
import { Post, User, AccessSettings } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, ShieldAlert, UserMinus, Trash, Megaphone, CheckCircle2, Building2 } from 'lucide-react';
import { MOCK_USER, MOCK_FRIENDS } from '../constants';

interface PostCardProps {
  post: Post;
  access: AccessSettings;
  currentUserId?: string;
  currentUserRole?: string; // Need role to verify if government
  isFollowing: boolean;
  onBlockUser: (userId: string) => void;
  onReportUser: (userId: string) => void;
  onToggleFollow: (userId: string) => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (post: Post) => void;
  onOfficialResponse?: (postId: string, response: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
    post, access, currentUserId, currentUserRole, isFollowing, 
    onBlockUser, onReportUser, onToggleFollow, onDeletePost, onEditPost, onOfficialResponse
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [responseInput, setResponseInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  // Author Resolution
  let author: { name: string; avatarUrl: string; role?: string; isVerified?: boolean } = {
      name: 'Usuário',
      avatarUrl: 'https://picsum.photos/id/10/50/50'
  };

  if (post.userId === MOCK_USER.id) {
      author = MOCK_USER;
  } else {
      const friend = MOCK_FRIENDS.find(f => f.id === post.userId);
      if (friend) {
          author = { ...friend, avatarUrl: `https://picsum.photos/seed/${friend.id}/50/50` };
      }
  }

  const isDenuncia = post.type === 'denuncia';
  
  const cardBorder = isDenuncia 
      ? (access.highContrast ? 'border-red-600' : 'border-red-200') 
      : (access.highContrast ? 'border-yellow-600' : 'border-gray-100');

  const cardBg = isDenuncia
      ? (access.highContrast ? 'bg-gray-900' : 'bg-red-50/30')
      : (access.highContrast ? 'bg-gray-900' : 'bg-white');

  const handleSendResponse = () => {
      if (responseInput.trim() && onOfficialResponse) {
          onOfficialResponse(post.id, responseInput);
          setIsResponding(false);
          setResponseInput('');
      }
  };

  return (
    <div className={`p-4 rounded-xl mb-4 border transition-all hover:shadow-md ${cardBg} ${cardBorder} shadow-sm`}>
      {isDenuncia && (
          <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${access.highContrast ? 'border-red-900 text-red-400' : 'border-red-100 text-red-600'}`}>
              <Megaphone size={18} />
              <span className="font-bold text-xs uppercase tracking-wider">Denúncia de Serviço Público</span>
          </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
          <div>
            <div className="flex items-center gap-1">
              <h4 className={`font-bold text-sm ${access.highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>{author.name}</h4>
              {author.isVerified && (
                 <img src="https://cdn-icons-png.flaticon.com/512/10696/10696383.png" className="w-4 h-4" alt="Verified" />
              )}
            </div>
            <span className={`text-xs ${access.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
              {post.timestamp.toLocaleDateString()} • {author.role || 'Membro'}
            </span>
          </div>
        </div>
        
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className={`p-1 rounded-full ${access.highContrast ? 'hover:bg-gray-800 text-yellow-500' : 'hover:bg-gray-100 text-gray-400'}`}>
            <MoreHorizontal size={20} />
          </button>
          
          {showMenu && (
            <div className={`absolute right-0 top-8 w-48 rounded-lg shadow-xl z-10 overflow-hidden border ${access.highContrast ? 'bg-black border-yellow-600' : 'bg-white border-gray-100'}`}>
              {currentUserId === post.userId ? (
                <>
                  <button onClick={() => onDeletePost(post.id)} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 text-red-500 hover:bg-red-50">
                    <Trash size={16} /> Excluir Post
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => onToggleFollow(post.userId)} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 ${access.highContrast ? 'hover:bg-gray-800 text-yellow-100' : 'hover:bg-gray-50 text-gray-700'}`}>
                    {isFollowing ? <UserMinus size={16} /> : <UserMinus size={16} />} {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
                  </button>
                  <button onClick={() => onBlockUser(post.userId)} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 ${access.highContrast ? 'hover:bg-gray-800 text-yellow-100' : 'hover:bg-gray-50 text-gray-700'}`}>
                    <ShieldAlert size={16} /> Bloquear
                  </button>
                  <button onClick={() => onReportUser(post.userId)} className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 ${access.highContrast ? 'hover:bg-gray-800 text-yellow-100' : 'hover:bg-gray-50 text-gray-700'}`}>
                    <ShieldAlert size={16} /> Denunciar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Post Content */}
      <div className="mb-4">
          {isDenuncia && post.denunciaDetails && (
              <div className={`mb-3 p-3 rounded-lg text-sm font-medium flex flex-col gap-1 ${access.highContrast ? 'bg-red-900/40 text-red-100' : 'bg-red-50 text-red-800'}`}>
                  <div className="flex items-center gap-2">
                      <Building2 size={16} /> <strong>Órgão:</strong> {post.denunciaDetails.agency}
                  </div>
                  <div className="flex items-center gap-2 ml-6 text-xs opacity-80">
                      Local: {post.denunciaDetails.location}
                  </div>
              </div>
          )}
          <p className={`text-base leading-relaxed whitespace-pre-line ${access.highContrast ? 'text-white font-medium' : 'text-gray-800'}`}>
            {post.content}
          </p>
      </div>
      
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post attachment" className="w-full h-auto rounded-xl mb-4 border border-gray-100" />
      )}
      
      {/* Official Response Section for Denúncias */}
      {isDenuncia && (
          <div className={`mt-4 pt-4 border-t ${access.highContrast ? 'border-gray-800' : 'border-gray-100'}`}>
              {post.officialResponse ? (
                  <div className={`p-4 rounded-xl border-l-4 ${access.highContrast ? 'bg-gray-800 border-green-500' : 'bg-gray-50 border-green-500'}`}>
                      <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 size={18} className="text-green-500" />
                          <span className="font-bold text-sm text-green-600 uppercase">Resposta Oficial do Governo</span>
                      </div>
                      <p className={`text-sm mb-2 ${access.highContrast ? 'text-white' : 'text-gray-700'}`}>
                          {post.officialResponse.text}
                      </p>
                      <div className="text-xs text-gray-500 flex justify-between">
                          <span>{post.officialResponse.responderName}</span>
                          <span>{post.officialResponse.timestamp.toLocaleDateString()}</span>
                      </div>
                  </div>
              ) : (
                  <div className="flex flex-col gap-3">
                      <div className="text-center text-xs font-bold text-gray-400 italic py-2">
                          Aguardando manifestação oficial do órgão responsável.
                      </div>
                      
                      {/* Interaction for Government User */}
                      {currentUserRole === 'Governo' && !isResponding && (
                          <button 
                            onClick={() => setIsResponding(true)}
                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                          >
                             <CheckCircle2 size={16} /> Responder como Governo (CNPJ verificado)
                          </button>
                      )}

                      {/* Response Form */}
                      {isResponding && (
                          <div className="animate-fade-in">
                              <textarea
                                value={responseInput}
                                onChange={(e) => setResponseInput(e.target.value)}
                                placeholder="Escreva a resposta oficial do órgão..."
                                className={`w-full p-3 rounded-lg border text-sm min-h-[100px] mb-2 ${access.highContrast ? 'bg-black text-white border-green-600' : 'bg-white border-green-200'}`}
                              />
                              <div className="flex gap-2 justify-end">
                                  <button onClick={() => setIsResponding(false)} className="text-gray-500 text-sm font-bold px-3">Cancelar</button>
                                  <button onClick={handleSendResponse} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Enviar Resposta</button>
                              </div>
                          </div>
                      )}
                  </div>
              )}
          </div>
      )}

      {/* Standard Actions (Only standard posts allow comments, everyone can like/share) */}
      <div className={`flex items-center justify-between pt-3 mt-2 ${!isDenuncia ? 'border-t' : ''} ${access.highContrast ? 'border-gray-800' : 'border-gray-50'}`}>
        <button className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${post.isLiked ? 'text-red-500' : (access.highContrast ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500')}`}>
          <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
          <span>{post.likes}</span>
        </button>
        
        {/* Disable comments for Denúncias unless logic changes, focusing on Govt response */}
        {!isDenuncia && (
            <button className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${access.highContrast ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-brand-blue'}`}>
              <MessageCircle size={18} />
              <span>{post.comments}</span>
            </button>
        )}
        
        <button className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${access.highContrast ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-brand-blue'}`}>
          <Share2 size={18} />
          <span>Compartilhar</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;