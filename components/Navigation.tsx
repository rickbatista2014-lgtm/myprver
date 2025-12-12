import React from 'react';
import { Home, User, Heart, Radio, Users, MessageCircle, Settings, Scale, Star, Megaphone } from 'lucide-react';
import { AccessSettings } from '../types';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  access: AccessSettings;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, access }) => {
  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'denuncias', label: 'Denúncias', icon: Megaphone },
    { id: 'influencer', label: 'Influencer', icon: Star },
    { id: 'wallet', label: 'Carteira', icon: Heart },
    { id: 'lives', label: 'Lives', icon: Radio },
    { id: 'groups', label: 'Grupos', icon: Users },
    { id: 'messages', label: 'Mensagens', icon: MessageCircle },
    { id: 'rights', label: 'Direitos', icon: Scale },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 px-4 mb-4 md:mb-0 hidden md:block">
      <div className={`rounded-xl overflow-hidden sticky top-24 ${access.highContrast ? 'bg-gray-900 border border-yellow-500' : 'bg-white shadow-sm border border-gray-100'}`}>
        <nav className="flex flex-col p-2 gap-1">
          {menuItems.map(item => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all
                  ${isActive 
                    ? (access.highContrast ? 'bg-yellow-400 text-black' : 'bg-brand-blue text-white shadow-md transform scale-105') 
                    : (access.highContrast ? 'text-yellow-100 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-blue')}
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Mobile Navigation (Bottom Bar) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex justify-around items-center p-2 
          ${access.highContrast ? 'bg-black border-yellow-600' : 'bg-white border-gray-200'}`}>
         {menuItems.slice(0, 5).map(item => {
             const Icon = item.icon;
             const isActive = currentView === item.id;
             return (
               <button 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`p-2 rounded-full flex flex-col items-center gap-1 ${isActive ? (access.highContrast ? 'text-yellow-400' : 'text-brand-blue') : (access.highContrast ? 'text-gray-500' : 'text-gray-400')}`}
               >
                 <Icon size={24} />
                 <span className="text-[10px] font-bold">{item.label}</span>
               </button>
             )
         })}
      </div>
    </aside>
  );
};

export default Navigation;