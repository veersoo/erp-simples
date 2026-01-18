import React, { useState } from 'react';
import { Fornecedor } from '../types';

const initialSuppliers: Fornecedor[] = [
  { id: 1, nome: "Global Tech Solutions", categoria: "Eletrônicos", contato: "John Smith", email: "contact@globaltech.com", telefone: "+1 (555) 010-2344", performance: 5, status: 'Ativo', uid: "G" },
  { id: 2, nome: "Pacific Raw Materials", categoria: "Matéria Prima", contato: "Sarah Chen", email: "sarah@pacificraw.com", telefone: "+1 (555) 020-4491", performance: 4, status: 'Ativo', uid: "P" },
  { id: 3, nome: "LogiLink Corp", categoria: "Logística", contato: "Michael Ross", email: "m.ross@logilink.io", telefone: "+1 (555) 030-8822", performance: 3, status: 'Inativo', uid: "L" },
  { id: 4, nome: "Apex Wholesale", categoria: "Atacado", contato: "Emma Wilson", email: "sales@apexwholesale.com", telefone: "+1 (555) 040-3300", performance: 4, status: 'Ativo', uid: "A" },
];

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Fornecedor[]>(initialSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    contato: '',
    email: '',
    telefone: '',
    performance: 5,
    status: 'Ativo'
  });

  const handleOpenModal = (supplier?: Fornecedor) => {
    if (supplier) {
      setEditingId(supplier.id);
      setFormData({
        nome: supplier.nome,
        categoria: supplier.categoria,
        contato: supplier.contato,
        email: supplier.email,
        telefone: supplier.telefone,
        performance: supplier.performance,
        status: supplier.status
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        categoria: '',
        contato: '',
        email: '',
        telefone: '',
        performance: 5,
        status: 'Ativo'
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este fornecedor?')) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSupplier: Fornecedor = {
      id: editingId || Date.now(),
      nome: formData.nome,
      categoria: formData.categoria,
      contato: formData.contato,
      email: formData.email,
      telefone: formData.telefone,
      performance: Number(formData.performance),
      status: formData.status as any,
      uid: formData.nome.charAt(0).toUpperCase()
    };

    if (editingId) {
      setSuppliers(prev => prev.map(s => s.id === editingId ? newSupplier : s));
    } else {
      setSuppliers(prev => [newSupplier, ...prev]);
    }

    setIsModalOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.nome.toLowerCase().includes(search.toLowerCase()) ||
    s.categoria.toLowerCase().includes(search.toLowerCase()) ||
    s.contato.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <header className="flex items-center justify-between border-b border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-background-dark px-8 py-4 sticky top-0 z-10">
        <div className="flex-1 flex items-center gap-6">
           <div>
              <h2 className="text-[#121617] dark:text-white text-2xl font-extrabold tracking-tight">Fornecedores</h2>
              <p className="text-xs text-[#678183]">Gerencie contratos e parceiros.</p>
           </div>
           <div className="max-w-md w-full relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#678183] text-lg">search</span>
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border-none bg-[#f1f4f4] dark:bg-zinc-800 rounded-lg text-sm placeholder-[#678183] focus:ring-2 focus:ring-primary/50" 
                placeholder="Buscar fornecedor..." 
                type="text" 
              />
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-[#165a61] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add_business</span>
          <span>Adicionar</span>
        </button>
      </header>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-bold text-[#678183] uppercase mb-1">Total Fornecedores</p>
            <p className="text-2xl font-black text-[#121617] dark:text-white">{suppliers.length}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-bold text-[#678183] uppercase mb-1">Contratos Ativos</p>
            <p className="text-2xl font-black text-[#121617] dark:text-white">{suppliers.filter(s => s.status === 'Ativo').length}</p>
          </div>
           <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-bold text-[#678183] uppercase mb-1">Alta Performance (5★)</p>
            <p className="text-2xl font-black text-[#121617] dark:text-white">{suppliers.filter(s => s.performance === 5).length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafa] dark:bg-zinc-800/50 border-b border-[#dde3e4] dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
                {filteredSuppliers.map(sup => (
                  <tr key={sup.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-lg shadow-sm border border-primary/20">
                            {sup.uid}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#121617] dark:text-white">{sup.nome}</p>
                          <p className="text-xs text-[#678183]">{sup.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase rounded-md tracking-wide">{sup.categoria}</span></td>
                    <td className="px-6 py-4">
                         <p className="text-sm font-semibold text-[#121617] dark:text-white">{sup.contato}</p>
                         <p className="text-xs text-[#678183] font-mono">{sup.telefone}</p>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                             <span key={i} className={`material-symbols-outlined text-[18px] ${i < Math.floor(sup.performance) ? 'filled' : 'opacity-30'}`}>star</span>
                          ))}
                       </div>
                    </td>
                     <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        sup.status === 'Ativo' ? 'bg-green-100 text-green-700' :
                        sup.status === 'Inativo' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {sup.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenModal(sup)} className="p-1.5 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded text-[#678183] hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">edit_square</span>
                            </button>
                            <button onClick={() => handleDelete(sup.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-[#678183] hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

       {/* Add/Edit Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg shadow-2xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#121617] dark:text-white">{editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded-full transition-colors text-[#678183]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Nome da Empresa</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                  className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Categoria</label>
                  <input 
                    type="text" 
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    required
                    placeholder="Ex: Logística"
                    className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Contato Principal</label>
                  <input 
                    type="text" 
                    value={formData.contato}
                    onChange={(e) => setFormData({...formData, contato: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Email</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Telefone</label>
                    <input 
                        type="tel" 
                        value={formData.telefone}
                        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        required
                        className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                    />
                </div>
               </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Performance (1-5)</label>
                  <select 
                     value={formData.performance}
                     onChange={(e) => setFormData({...formData, performance: Number(e.target.value)})}
                     className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  >
                    <option value="1">1 - Ruim</option>
                    <option value="2">2 - Regular</option>
                    <option value="3">3 - Bom</option>
                    <option value="4">4 - Ótimo</option>
                    <option value="5">5 - Excelente</option>
                  </select>
                </div>
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Status</label>
                  <select 
                     value={formData.status}
                     onChange={(e) => setFormData({...formData, status: e.target.value})}
                     className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-[#f1f4f4] dark:bg-zinc-800 text-[#121617] dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Suppliers;