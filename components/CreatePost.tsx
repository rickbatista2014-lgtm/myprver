import React, { useState } from 'react';
import { User, AccessSettings } from '../types';
import { Image, Send, Sparkles, X, Megaphone, MapPin, Building2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface CreatePostProps {
  user: User;
  onPostCreate: (content: string, imageUrl?: string, isDenuncia?: boolean, denunciaDetails?: { agency: string, location: string }) => void;
  access: AccessSettings;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onPostCreate, access }) => {
  const [content, setContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhancePreview, setShowEnhancePreview] = useState(false);
  const [enhancedText, setEnhancedText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Denuncia State
  const [isDenunciaMode, setIsDenunciaMode] = useState(false);
  const [agencyName, setAgencyName] = useState('');
  const [locationName, setLocationName] = useState('');

  const handleEnhanceText = async () => {
    if (!content.trim() || !process.env.API_KEY) return;
    
    setIsEnhancing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = isDenunciaMode 
        ? `Reescreva o seguinte relato de denúncia para que seja formal, respeitoso, objetivo e transmita a gravidade da situação de mau atendimento a uma pessoa autista. Evite xingamentos, foque nos fatos: "${content}"`
        : `Reescreva o seguinte texto para que fique mais claro, empático e amigável para uma rede social focada em autismo. Mantenha o sentido original, apenas melhore a comunicação: "${content}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      setEnhancedText(response.text.trim());
      setShowEnhancePreview(true);
    } catch (error) {
      console.error("Error enhancing text:", error);
      alert("Não foi possível melhorar o texto agora. Verifique sua conexão.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const applyEnhanced = () => {
    setContent(enhancedText);
    setShowEnhancePreview(false);
    setEnhancedText('');
  };

  const handleSubmit = () => {
    if (content.trim()) {
      if (isDenunciaMode && (!agencyName.trim() || !locationName.trim())) {
          alert("Para denúncias, informe o local e o nome do órgão.");
          return;
      }

      onPostCreate(
          content, 
          selectedImage || undefined, 
          isDenunciaMode, 
          isDenunciaMode ? { agency: agencyName, location: locationName } : undefined
      );
      
      // Reset
      setContent('');
      setSelectedImage(null);
      setIsDenunciaMode(false);
      setAgencyName('');
      setLocationName('');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) setSelectedImage(ev.target.result as string);
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  }

  const toggleDenunciaMode = () => {
      setIsDenunciaMode(!isDenunciaMode);
      if (!isDenunciaMode) {
          // If turning on, clear enhancements to avoid confusion
          setShowEnhancePreview(false);
      }
  };

  const containerClass = isDenunciaMode
      ? (access.highContrast ? 'bg-red-950 border-red-500' : 'bg-red-50 border-red-200 shadow-md')
      : (access.highContrast ? 'bg-gray-900 border-yellow-500' : 'bg-white border-blue-100 shadow-sm');

  return (
    <div className={`p-4 rounded-xl mb-6 border transition-colors duration-300 ${containerClass}`}>
      <div className="flex gap-4">
        <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full border border-gray-200" />
        <div className="flex-1">
          {/* Post Type Toggles */}
          <div className="flex gap-2 mb-3">
             <button 
                onClick={() => isDenunciaMode && toggleDenunciaMode()}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${!isDenunciaMode 
                    ? (access.highContrast ? 'bg-yellow-400 text-black' : 'bg-brand-blue text-white') 
                    : 'bg-transparent border border-gray-400 opacity-60'}`}
             >
                 Diário / Post
             </button>
             <button 
                onClick={() => !isDenunciaMode && toggleDenunciaMode()}
                className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 transition-all ${isDenunciaMode 
                    ? 'bg-red-600 text-white' 
                    : 'bg-transparent border border-gray-400 opacity-60'}`}
             >
                 <Megaphone size={12} /> Denúncia Pública
             </button>
          </div>

          {isDenunciaMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 animate-fade-in">
                  <div className={`flex items-center gap-2 p-2 rounded-lg border ${access.highContrast ? 'bg-black border-red-700' : 'bg-white border-red-100'}`}>
                      <Building2 size={16} className="text-red-500" />
                      <input 
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="Nome do Órgão (ex: Posto de Saúde)"
                        className="bg-transparent outline-none text-sm w-full"
                      />
                  </div>
                  <div className={`flex items-center gap-2 p-2 rounded-lg border ${access.highContrast ? 'bg-black border-red-700' : 'bg-white border-red-100'}`}>
                      <MapPin size={16} className="text-red-500" />
                      <input 
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder="Cidade / Estado"
                        className="bg-transparent outline-none text-sm w-full"
                      />
                  </div>
              </div>
          )}

          <textarea
            id="create-post-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isDenunciaMode ? "Descreva o ocorrido com detalhes. O que foi negado? Como foi o atendimento?" : "No que você está pensando hoje?"}
            className={`w-full p-3 rounded-xl resize-none outline-none text-base min-h-[100px] transition-all
              ${access.highContrast 
                ? 'bg-black text-yellow-100 placeholder-gray-600 border border-gray-800 focus:border-yellow-500' 
                : 'bg-gray-50 text-gray-800 placeholder-gray-400 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-blue/20'
              } ${isDenunciaMode && !access.highContrast ? 'focus:ring-red-500/20 bg-white' : ''}`}
          />
          
          {selectedImage && (
              <div className="relative mt-2 inline-block">
                  <img src={selectedImage} alt="Preview" className="h-32 rounded-lg object-cover" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                  >
                      <X size={14} />
                  </button>
              </div>
          )}

          {showEnhancePreview && (
            <div className={`mt-3 p-3 rounded-lg text-sm border ${access.highContrast ? 'bg-yellow-900/30 border-yellow-600 text-yellow-100' : 'bg-indigo-50 border-indigo-100 text-indigo-800'}`}>
              <div className="font-bold mb-1 flex items-center gap-2">
                <Sparkles size={14} /> Sugestão da IA:
              </div>
              <p className="italic mb-2">"{enhancedText}"</p>
              <div className="flex gap-2">
                <button 
                  onClick={applyEnhanced}
                  className={`text-xs px-3 py-1 rounded font-bold ${access.highContrast ? 'bg-yellow-500 text-black' : 'bg-indigo-600 text-white'}`}
                >
                  Usar Sugestão
                </button>
                <button 
                  onClick={() => setShowEnhancePreview(false)}
                  className={`text-xs px-3 py-1 rounded font-bold ${access.highContrast ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2">
              <label className={`p-2 rounded-full cursor-pointer transition-colors ${access.highContrast ? 'hover:bg-gray-800 text-yellow-500' : 'hover:bg-blue-50 text-brand-blue'}`}>
                <Image size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>
              
              {process.env.API_KEY && (
                <button 
                  onClick={handleEnhanceText}
                  disabled={isEnhancing || !content}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                    ${access.highContrast 
                      ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' 
                      : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:shadow-sm'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Sparkles size={14} />
                  {isEnhancing ? 'Melhorando...' : 'Melhorar Texto'}
                </button>
              )}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-transform hover:scale-105 active:scale-95
                ${!content.trim() 
                  ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' 
                  : (isDenunciaMode 
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                        : (access.highContrast ? 'bg-yellow-400 text-black' : 'bg-brand-blue text-white shadow-md hover:bg-blue-600')
                    )
                }`}
            >
              {isDenunciaMode ? <Megaphone size={16} /> : <Send size={16} />}
              <span>{isDenunciaMode ? 'Denunciar' : 'Publicar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;