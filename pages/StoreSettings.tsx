import React, { useState, useRef } from 'react';
import { useStore } from '../contexts/StoreContext';
import StoreFront from './StoreFront';

const StoreSettings: React.FC = () => {
  const { storeConfig, setStoreConfig, products, setProducts } = useStore();
  const [successMsg, setSuccessMsg] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreConfig(prev => ({ ...prev, bannerUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDestaque = (id: number) => {
    setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, destaque: !p.destaque } : p
    ));
  };

  const handleSave = () => {
    setSuccessMsg('Configurações salvas com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openStoreInNewTab = () => {
    window.open('#/loja-publica', '_blank');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-full relative">
      <header className="flex items-center justify-between border-b border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-background-dark px-8 py-4 sticky top-0 z-10">
        <div>
           <h2 className="text-[#121617] dark:text-white text-2xl font-extrabold tracking-tight">Gestão da Loja Online</h2>
           <p className="text-xs text-[#678183]">Configure sua vitrine virtual e integração com WhatsApp.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 rounded-lg text-sm font-bold transition-colors"
             >
                <span className="material-symbols-outlined text-[20px]">visibility</span>
                Pré-visualizar
             </button>
             <button 
                onClick={openStoreInNewTab}
                className="flex items-center gap-2 px-4 py-2 border border-[#dde3e4] dark:border-zinc-700 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
             >
                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                Ver Loja (Aba)
             </button>
             <button 
                onClick={handleSave}
                className="bg-primary hover:bg-[#165a61] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-sm"
             >
                <span className="material-symbols-outlined text-[20px]">save</span>
                Salvar
             </button>
        </div>
      </header>

      {successMsg && (
        <div className="mx-8 mt-6 p-4 bg-green-100 text-green-800 rounded-lg font-bold flex items-center gap-2 animate-fade-in">
             <span className="material-symbols-outlined">check_circle</span>
             {successMsg}
        </div>
      )}

      <div className="p-8 space-y-8">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* General Settings */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm p-6 space-y-6">
                <h3 className="font-bold text-lg border-b border-[#dde3e4] dark:border-zinc-800 pb-2">Informações Gerais</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-1">Nome da Loja</label>
                        <input 
                            type="text" 
                            name="nomeLoja"
                            value={storeConfig.nomeLoja}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border-transparent rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                     <div>
                        <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-1">WhatsApp para Pedidos (apenas números)</label>
                        <div className="flex items-center">
                             <span className="px-3 py-2.5 bg-gray-200 dark:bg-zinc-700 rounded-l-lg border-r border-gray-300 dark:border-zinc-600 font-mono text-sm">+</span>
                             <input 
                                type="text" 
                                name="whatsapp"
                                value={storeConfig.whatsapp}
                                onChange={handleChange}
                                placeholder="5511999999999"
                                className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border-transparent rounded-r-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-1">Mensagem de Boas-vindas (WhatsApp)</label>
                        <textarea 
                            name="mensagemBoasVindas"
                            value={storeConfig.mensagemBoasVindas}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border-transparent rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Visual Settings */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm p-6 space-y-6">
                <h3 className="font-bold text-lg border-b border-[#dde3e4] dark:border-zinc-800 pb-2">Aparência</h3>
                
                <div>
                     <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-2">Banner da Loja</label>
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 rounded-xl bg-gray-100 dark:bg-zinc-800 overflow-hidden relative cursor-pointer group border-2 border-dashed border-[#dde3e4] dark:border-zinc-700 hover:border-primary transition-colors"
                     >
                        <img src={storeConfig.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white text-3xl">edit</span>
                        </div>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange}
                        />
                     </div>
                </div>
                
                <div>
                     <label className="text-xs font-bold text-[#678183] uppercase tracking-wider block mb-2">Cor Principal</label>
                     <div className="flex items-center gap-3">
                        <input 
                            type="color" 
                            name="corPrincipal"
                            value={storeConfig.corPrincipal}
                            onChange={handleChange}
                            className="h-10 w-20 rounded cursor-pointer border-none"
                        />
                        <span className="text-sm font-mono">{storeConfig.corPrincipal}</span>
                     </div>
                </div>
            </div>
         </div>

         {/* Featured Products */}
         <div className="bg-white dark:bg-zinc-900 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-[#dde3e4] dark:border-zinc-800">
                <h3 className="font-bold text-lg">Produtos em Destaque</h3>
                <p className="text-xs text-[#678183]">Selecione os produtos que aparecerão no carrossel da página inicial.</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafa] dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-[#678183] uppercase">Produto</th>
                            <th className="px-6 py-3 text-xs font-bold text-[#678183] uppercase">Categoria</th>
                            <th className="px-6 py-3 text-xs font-bold text-[#678183] uppercase text-right">Preço</th>
                            <th className="px-6 py-3 text-xs font-bold text-[#678183] uppercase text-center">Destaque</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
                        {products.map(prod => (
                            <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-lg bg-gray-100 overflow-hidden">
                                            <img src={prod.imagemUrl} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-bold text-sm text-[#121617] dark:text-white">{prod.nome}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#678183]">{prod.categoria}</td>
                                <td className="px-6 py-4 text-sm font-bold text-right">R$ {prod.preco.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => toggleDestaque(prod.id)}
                                        className={`size-8 rounded-full flex items-center justify-center transition-colors ${prod.destaque ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[18px] ${prod.destaque ? 'filled' : ''}`}>star</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
         </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
         <div className="fixed inset-0 z-[100] bg-white dark:bg-[#121212] overflow-hidden flex flex-col animate-fade-in">
             <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-purple-400">visibility</span>
                    <span className="font-bold">Modo de Pré-visualização</span>
                    <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">As alterações são refletidas em tempo real</span>
                 </div>
                 <button 
                    onClick={() => setShowPreview(false)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold transition-colors"
                 >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    Fechar Preview
                 </button>
             </div>
             <div className="flex-1 overflow-y-auto">
                 <StoreFront />
             </div>
         </div>
      )}
    </div>
  );
};

export default StoreSettings;