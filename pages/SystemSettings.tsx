import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SystemSettings: React.FC = () => {
  const { theme, setTheme, resetTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTheme(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTheme(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <header className="flex items-center justify-between border-b border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-background-dark px-8 py-4 sticky top-0 z-10">
        <div>
           <h2 className="text-[#121617] dark:text-white text-2xl font-extrabold tracking-tight">Identidade Visual do Sistema</h2>
           <p className="text-xs text-[#678183]">Personalize a aparência do ERP para corresponder à sua marca.</p>
        </div>
        <button 
          onClick={resetTheme}
          className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[var(--radius)] text-sm font-bold transition-colors border border-transparent hover:border-red-200"
        >
          Restaurar Padrão
        </button>
      </header>

      <div className="p-8 flex-1 overflow-y-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Branding Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-[var(--radius)] border border-[#dde3e4] dark:border-zinc-800 shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-[#dde3e4] dark:border-zinc-800 pb-3 mb-4">
                    <span className="material-symbols-outlined text-primary">branding_watermark</span>
                    <h3 className="font-bold text-lg text-[#121617] dark:text-white">Marca & Logo</h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-2">Nome da Empresa (Sistema)</label>
                        <input 
                            type="text" 
                            name="companyName"
                            value={theme.companyName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#f1f4f4] dark:bg-zinc-800 border-transparent rounded-[var(--radius)] text-sm font-semibold focus:ring-2 focus:ring-primary/20 transition-all text-[#121617] dark:text-white"
                        />
                    </div>
                    
                    <div>
                         <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-2">Logotipo do Sistema</label>
                         <div className="flex items-center gap-6">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="size-24 rounded-[var(--radius)] bg-[#f1f4f4] dark:bg-zinc-800 border-2 border-dashed border-[#dde3e4] dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors relative group overflow-hidden"
                            >
                                {theme.logoUrl ? (
                                    <img src={theme.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <span className="material-symbols-outlined text-[#678183] text-3xl">add_photo_alternate</span>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">edit</span>
                                </div>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleLogoUpload}
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-[#121617] dark:text-white">Upload do Logo</p>
                                <p className="text-xs text-[#678183] mt-1">Recomendado: PNG Transparente. <br/>Este logo aparecerá na barra lateral e na tela de login.</p>
                                {theme.logoUrl && (
                                    <button 
                                        onClick={() => setTheme(prev => ({...prev, logoUrl: null}))}
                                        className="mt-3 text-xs font-bold text-red-500 hover:text-red-600"
                                    >
                                        Remover Logo
                                    </button>
                                )}
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Colors Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-[var(--radius)] border border-[#dde3e4] dark:border-zinc-800 shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-[#dde3e4] dark:border-zinc-800 pb-3 mb-4">
                    <span className="material-symbols-outlined text-primary">palette</span>
                    <h3 className="font-bold text-lg text-[#121617] dark:text-white">Paleta de Cores</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-2">Cor Primária (Destaques, Botões)</label>
                        <div className="flex items-center gap-3">
                            <div className="relative size-12 rounded-[var(--radius)] overflow-hidden shadow-sm border border-[#dde3e4] dark:border-zinc-700">
                                <input 
                                    type="color" 
                                    name="primaryColor"
                                    value={theme.primaryColor}
                                    onChange={handleInputChange}
                                    className="absolute -top-2 -left-2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
                                />
                            </div>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    value={theme.primaryColor}
                                    onChange={handleInputChange}
                                    name="primaryColor"
                                    className="w-full px-3 py-2 bg-[#f1f4f4] dark:bg-zinc-800 border-transparent rounded-[var(--radius)] text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-2">Cor Secundária (Detalhes)</label>
                        <div className="flex items-center gap-3">
                            <div className="relative size-12 rounded-[var(--radius)] overflow-hidden shadow-sm border border-[#dde3e4] dark:border-zinc-700">
                                <input 
                                    type="color" 
                                    name="secondaryColor"
                                    value={theme.secondaryColor}
                                    onChange={handleInputChange}
                                    className="absolute -top-2 -left-2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
                                />
                            </div>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    value={theme.secondaryColor}
                                    onChange={handleInputChange}
                                    name="secondaryColor"
                                    className="w-full px-3 py-2 bg-[#f1f4f4] dark:bg-zinc-800 border-transparent rounded-[var(--radius)] text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Section */}
             <div className="bg-white dark:bg-zinc-900 rounded-[var(--radius)] border border-[#dde3e4] dark:border-zinc-800 shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-2 border-b border-[#dde3e4] dark:border-zinc-800 pb-3 mb-4">
                    <span className="material-symbols-outlined text-primary">dashboard</span>
                    <h3 className="font-bold text-lg text-[#121617] dark:text-white">Interface & Layout</h3>
                </div>
                
                <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-3">Arredondamento (Bordas)</label>
                        <div className="flex gap-2">
                            {['none', 'sm', 'md', 'lg', 'full'].map((radius) => (
                                <button
                                    key={radius}
                                    onClick={() => setTheme(prev => ({ ...prev, radius: radius as any }))}
                                    className={`flex-1 py-3 border border-[#dde3e4] dark:border-zinc-700 bg-[#f1f4f4] dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 transition-all font-bold text-xs uppercase ${theme.radius === radius ? 'ring-2 ring-primary border-transparent bg-white dark:bg-zinc-700 text-primary' : 'text-[#678183]'}`}
                                    style={{ borderRadius: radius === 'none' ? '0' : radius === 'sm' ? '6px' : radius === 'md' ? '12px' : radius === 'lg' ? '24px' : '999px' }}
                                >
                                    {radius}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#dde3e4] dark:border-zinc-800">
                        <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-3">Modo Padrão</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setTheme(prev => ({ ...prev, mode: 'light' }))}
                                className={`flex items-center justify-center gap-2 py-3 rounded-[var(--radius)] border transition-all ${theme.mode === 'light' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-[#dde3e4] text-[#678183] hover:bg-gray-50'}`}
                            >
                                <span className="material-symbols-outlined">light_mode</span>
                                <span className="font-bold text-sm">Claro</span>
                            </button>
                             <button 
                                onClick={() => setTheme(prev => ({ ...prev, mode: 'dark' }))}
                                className={`flex items-center justify-center gap-2 py-3 rounded-[var(--radius)] border transition-all ${theme.mode === 'dark' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-zinc-800 border-zinc-700 text-[#678183] hover:bg-zinc-700'}`}
                            >
                                <span className="material-symbols-outlined">dark_mode</span>
                                <span className="font-bold text-sm">Escuro</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

             {/* Preview Card */}
             <div className="bg-white dark:bg-zinc-900 rounded-[var(--radius)] border border-[#dde3e4] dark:border-zinc-800 shadow-sm p-6 space-y-6 flex flex-col justify-center items-center text-center">
                 <h3 className="font-bold text-lg text-[#121617] dark:text-white mb-2">Pré-visualização de Componentes</h3>
                 
                 <div className="flex gap-4">
                     <button className="px-6 py-2.5 bg-primary text-white rounded-[var(--radius)] font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark">
                        Botão Primário
                     </button>
                     <button className="px-6 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 text-[#121617] dark:text-white rounded-[var(--radius)] font-bold text-sm transition-all hover:bg-gray-200 dark:hover:bg-zinc-700">
                        Botão Secundário
                     </button>
                 </div>

                 <div className="w-full mt-6 p-4 bg-primary/10 rounded-[var(--radius)] border border-primary/20 flex items-center gap-3 text-left">
                     <div className="size-10 rounded-[var(--radius)] bg-primary flex items-center justify-center text-white shrink-0">
                         <span className="material-symbols-outlined">star</span>
                     </div>
                     <div>
                         <p className="font-bold text-primary text-sm">Componente de Destaque</p>
                         <p className="text-xs text-[#678183]">Este elemento herda as cores e o arredondamento definidos.</p>
                     </div>
                 </div>
             </div>

         </div>
      </div>
    </div>
  );
};

export default SystemSettings;
