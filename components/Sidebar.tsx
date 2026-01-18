import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const { theme, toggleMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-[#678183] hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium'
    }`;

  // Helper for normal links to match style
  const normalLinkClass = `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] transition-colors text-[#678183] hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium`;

  return (
    <aside className="w-64 border-r border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0 h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6 flex flex-col gap-8 flex-1 overflow-hidden">
        {/* Dynamic Logo/Brand */}
        <div className="flex items-center gap-3 shrink-0">
          {theme.logoUrl ? (
            <img src={theme.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-[var(--radius)] bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-2xl">rocket_launch</span>
            </div>
          )}
          <div>
            <h1 className="text-base font-bold leading-none text-[#121617] dark:text-white">{theme.companyName}</h1>
            <p className="text-xs text-[#678183] mt-1 font-medium uppercase tracking-wider">Enterprise ERP</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto pr-2">
          <NavLink to="/" className={getLinkClass}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </NavLink>
          <NavLink to="/clientes" className={getLinkClass}>
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm">Clientes</span>
          </NavLink>
          <NavLink to="/estoque" className={getLinkClass}>
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-sm">Estoque</span>
          </NavLink>
          <NavLink to="/vendas" className={getLinkClass}>
            <span className="material-symbols-outlined">point_of_sale</span>
            <span className="text-sm">PDV / Vendas</span>
          </NavLink>
           <NavLink to="/pedidos" className={getLinkClass}>
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-sm">Pedidos</span>
          </NavLink>
          <NavLink to="/financeiro" className={getLinkClass}>
            <span className="material-symbols-outlined">account_balance</span>
            <span className="text-sm">Financeiro</span>
          </NavLink>
          <NavLink to="/fornecedores" className={getLinkClass}>
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="text-sm">Fornecedores</span>
          </NavLink>
          <NavLink to="/rh" className={getLinkClass}>
            <span className="material-symbols-outlined">badge</span>
            <span className="text-sm">RH & Pessoas</span>
          </NavLink>
          
          <div className="my-2 border-t border-[#dde3e4] dark:border-zinc-800"></div>
          
          <div className="px-3 py-1 text-xs font-bold text-[#678183] uppercase tracking-wider mb-1">Loja Online</div>
          
          <NavLink to="/loja-config" className={getLinkClass}>
            <span className="material-symbols-outlined">settings_storefront</span>
            <span className="text-sm">Configuração</span>
          </NavLink>
          
          <a href="#/loja-publica" target="_blank" rel="noopener noreferrer" className={normalLinkClass}>
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-sm">Ver Loja Pública</span>
             <span className="material-symbols-outlined text-xs ml-auto">open_in_new</span>
          </a>

          <div className="my-2 border-t border-[#dde3e4] dark:border-zinc-800"></div>

          <div className="px-3 py-1 text-xs font-bold text-[#678183] uppercase tracking-wider mb-1">Sistema</div>

          <NavLink to="/usuarios" className={getLinkClass}>
            <span className="material-symbols-outlined">manage_accounts</span>
            <span className="text-sm">Usuários</span>
          </NavLink>

          <NavLink to="/configuracoes" className={getLinkClass}>
            <span className="material-symbols-outlined">tune</span>
            <span className="text-sm">Identidade Visual</span>
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-[#dde3e4] dark:border-zinc-800 bg-[#f8fafa] dark:bg-zinc-800/30">
        <div className="flex items-center gap-3 mb-3">
          <img src={user?.avatarUrl} alt="User" className="size-9 rounded-full border border-gray-200" />
          <div className="flex-1 min-w-0">
             <p className="text-sm font-bold truncate text-[#121617] dark:text-white">{user?.nome}</p>
             <p className="text-[10px] text-[#678183] truncate">{user?.funcao}</p>
          </div>
          <button 
            onClick={toggleMode}
            className="p-2 rounded-full hover:bg-white dark:hover:bg-zinc-700 text-[#678183] dark:text-yellow-400 transition-colors"
            title={theme.mode === 'light' ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme.mode === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[var(--radius)] transition-colors text-xs font-bold border border-transparent hover:border-red-100">
          <span className="material-symbols-outlined text-sm">logout</span>
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;