import React, { useState } from 'react';
import { Cliente } from '../types';

const initialClientes: Cliente[] = [
  { id: 1, nome: "Jane Cooper", empresa: "Acme Corp", email: "jane.cooper@acme.com", telefone: "(555) 012-3456", status: "Ativo", totalGasto: 12450.00, avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuArDU9xg8X98VGtxoV-T0qwI2DI1bhtxpgHYj_3oAQeJMAf4CK_iagVGXRJd6FpVf2_x9_HrujnHHPa82xsQ4Vxibhp_iTSrx3AVI2YZjB916JrJoBqclwb-wnDYYZsc73jLA1j_b6ZZvL_MJQvtxoZfQKTQAJ2xCtfMEdEnxS_HL7FJNAz-ggGlw0zRGkh-_rHyvt7Itvoxedkm0lm3uBw4vdOUhCYGj8vmeILkvxsffBmaLnhLG6J3enHaYixfWn75VFTHA0kLnA" },
  { id: 2, nome: "Cody Fisher", empresa: "Global Tech", email: "cody.f@gtech.io", telefone: "(555) 012-7890", status: "Lead", totalGasto: 8200.50, avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZgUaoqPNMPIYHu8WIN3-8M5LYOWsPmWqwESDkkhhEGUSLgEO3_hYUUl8Zq_JFHOV7hBBh7nJ-IiKU1hpjVYYlwNOGG0P5oSqIUZ4ZALOOaQvYrk2wJBnWgKT9OnopMxfI_AAQtyY3hQhuPe6LsJgN1zNXrVbQfe46cYyvLV_RUzklUTG8K2ypFVgsQt2JrdmbKLtMbkr3NgmgHy9XJ2hjk8M3AbIiY215r4AGIuQ3W3p0OIWtpWp3gcmBLo4gUMZceFi-M5tIiU0" },
  { id: 3, nome: "Esther Howard", empresa: "Silver Lining", email: "esther.h@sl.com", telefone: "(555) 012-1122", status: "Ativo", totalGasto: 45100.00, avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUzsRRkO1BAPB9Ei7WrOfSHt0ECAYDslPkbPgc0attvXD1YTy_pz49hb5t0wj0DzjQjtAP0phcRtaiaSYHkSEFx2fBBD6mrzeOrHf4da4BIEN5AGPOkqcdiFeMNix_jkz4_wefHdxmQ5WXMHMwPfH8Z8L9RC8GzplPkcCJJcnsWxTbPp_ssP33zMQU6DnGc9qrNVy_FuGZix2CehW5pPkMxCJxROHLvZAvf3Rb9T_90a2z2QqBRfuVpXEc_Ky0dexFG8-kAlXEAsQ" },
  { id: 4, nome: "Jenny Wilson", empresa: "Starlight Inc", email: "jenny.w@starlight.com", telefone: "(555) 012-3344", status: "Inativo", totalGasto: 2150.00, avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7dxMZDZwk2QmiUxM-yPWXnBerxP8lpK0SlsBxBaOgoZ2HDdOC8Tn1ubTSyj1mwL_j0fOYvYYBcpZIhu54Y4NeXE0jtWFEZgUd2KQjXrd04dSqQiLWdhaSuPX719I3ZOogPuRn3uOq2-ZclhKBym5DS1pw1W9l8I8K1TqCstl4xJd4x94lOtIaJJHowH7k5FYWdlbBZCdmbmWBONaMCH3wGNNt526FWbLDIaCFVUCc2x3K11EC2krhEJYnfV_eio7RjdDh6vipWJE" },
  { id: 5, nome: "Cameron Williamson", empresa: "Vertex Systems", email: "cam.w@vertex.com", telefone: "(555) 012-5566", status: "Ativo", totalGasto: 15000.00, avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxSonNgWIupVC8zPKxBrwSXkki4Upnw7HstsW5gTPgxzQksMmoHd_byJPpCJFS3euCYIADa624-HHg2ZoNgTjmQ1V1XRSCWrkXa9lG90wBSKsrELNTBekiY2KzGngbNrM9rBjxiWDE8JEbEH9OBtYJ1__7Ch6wohdRPuS0fx51q6EyetynbbnW9X3gQHP0IcjRT5R2_9mPjRyVusRVAMd7VXknEsIBpsiFcoLSnkLB7fheZkWvdRXRmb-NB3-ODYCLN5WQ5SgFoVM" },
];

const Customers: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({ nome: '', email: '', empresa: '', telefone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'nome':
        if (!value.trim()) error = 'O nome completo é obrigatório';
        else if (value.length < 3) error = 'O nome deve ter pelo menos 3 caracteres';
        break;
      case 'email':
        if (!value.trim()) error = 'O email é obrigatório';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Insira um endereço de email válido';
        break;
      case 'empresa':
        if (!value.trim()) error = 'A empresa é obrigatória';
        break;
      case 'telefone':
        if (!value.trim()) error = 'O telefone é obrigatório';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleOpenModal = (cliente?: Cliente) => {
    setErrors({});
    setTouched({});
    if (cliente) {
      setEditingId(cliente.id);
      setFormData({
        nome: cliente.nome,
        email: cliente.email,
        empresa: cliente.empresa,
        telefone: cliente.telefone
      });
    } else {
      setEditingId(null);
      setFormData({ nome: '', email: '', empresa: '', telefone: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ nome: true, email: true, empresa: true, telefone: true });

    if (Object.keys(newErrors).length === 0) {
      if (editingId) {
        // Edit Mode
        const updatedClientes = clientes.map(c => {
          if (c.id === editingId) {
            const updated = {
              ...c,
              nome: formData.nome,
              empresa: formData.empresa,
              email: formData.email,
              telefone: formData.telefone
            };
            // Se o cliente editado for o selecionado no drawer, atualiza ele também
            if (selectedCustomer?.id === editingId) {
              setSelectedCustomer(updated);
            }
            return updated;
          }
          return c;
        });
        setClientes(updatedClientes);
      } else {
        // Create Mode
        const newCliente: Cliente = {
          id: Date.now(),
          nome: formData.nome,
          empresa: formData.empresa,
          email: formData.email,
          telefone: formData.telefone,
          status: 'Lead',
          totalGasto: 0,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.nome)}&background=random`
        };
        setClientes([newCliente, ...clientes]);
      }

      setIsModalOpen(false);
      setFormData({ nome: '', email: '', empresa: '', telefone: '' });
      setTouched({});
    }
  };

  return (
    <div className="flex h-full relative">
      <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="h-16 border-b border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-2xl font-bold">folder_shared</span>
              <h2 className="text-lg font-bold tracking-tight text-[#121617] dark:text-white">Diretório de Clientes</h2>
            </div>
            <div className="max-w-md w-full relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#678183] text-xl">search</span>
              <input 
                className="w-full bg-[#f1f4f4] dark:bg-zinc-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-[#678183]" 
                placeholder="Buscar por nome, empresa ou email..." 
                type="text" 
              />
            </div>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Adicionar Cliente</span>
          </button>
        </header>

        {/* List */}
        <div className="flex-1 px-8 py-8 overflow-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafa] dark:bg-zinc-800/50 border-b border-[#dde3e4] dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider">Nome & Empresa</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider text-right">Total Gasto</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
                {clientes.map((cliente) => (
                  <tr 
                    key={cliente.id} 
                    onClick={() => setSelectedCustomer(cliente)}
                    className={`hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer group transition-colors ${selectedCustomer?.id === cliente.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 border border-[#dde3e4] dark:border-zinc-700" 
                          style={{ backgroundImage: `url('${cliente.avatarUrl}')` }}
                        ></div>
                        <div>
                          <p className="text-sm font-bold text-[#121617] dark:text-white">{cliente.nome}</p>
                          <p className="text-xs text-[#678183]">{cliente.empresa}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#678183]">{cliente.email}</td>
                    <td className="px-6 py-4 text-sm text-[#678183]">{cliente.telefone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        cliente.status === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        cliente.status === 'Inativo' ? 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {cliente.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#121617] dark:text-white text-right">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cliente.totalGasto)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal(cliente); }} className="text-[#678183] hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg shadow-2xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#121617] dark:text-white">
                {editingId ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded-full transition-colors text-[#678183]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Nome Completo</label>
                <input 
                  type="text" 
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.nome && touched.nome ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Ex: Ana Silva"
                />
                {errors.nome && touched.nome && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">{errors.nome}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.email && touched.email ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                    placeholder="ana@exemplo.com"
                  />
                  {errors.email && touched.email && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Telefone</label>
                  <input 
                    type="tel" 
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.telefone && touched.telefone ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                    placeholder="(00) 00000-0000"
                  />
                   {errors.telefone && touched.telefone && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">{errors.telefone}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Empresa</label>
                <input 
                  type="text" 
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.empresa && touched.empresa ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Nome da Empresa"
                />
                 {errors.empresa && touched.empresa && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">{errors.empresa}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#f1f4f4] dark:bg-zinc-800 text-[#121617] dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                  {editingId ? 'Salvar Alterações' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedCustomer && (
        <aside className="absolute top-0 right-0 bottom-0 w-[420px] bg-white dark:bg-zinc-900 border-l border-[#dde3e4] dark:border-zinc-800 shadow-2xl z-20 flex flex-col animate-slide-in-right">
          <div className="p-6 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-lg">Perfil do Cliente</h3>
            <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-24 h-24 rounded-2xl bg-cover bg-center border-4 border-[#f1f4f4] dark:border-zinc-800 mb-4" 
                style={{ backgroundImage: `url('${selectedCustomer.avatarUrl}')` }}
              ></div>
              <h4 className="text-xl font-bold">{selectedCustomer.nome}</h4>
              <p className="text-primary font-semibold text-sm">{selectedCustomer.empresa}</p>
              <div className="flex gap-4 mt-6 w-full">
                <button 
                  onClick={() => handleOpenModal(selectedCustomer)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Editar Perfil
                </button>
                <button className="px-4 py-2 bg-[#f1f4f4] dark:bg-zinc-800 rounded-lg text-xs font-bold hover:bg-[#e2e8e9] dark:hover:bg-zinc-700">
                  <span className="material-symbols-outlined text-sm">more_horiz</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-background-light dark:bg-zinc-800/50 rounded-xl border border-[#dde3e4] dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-[#678183] uppercase tracking-wider mb-1">Lifetime Value</p>
                  <p className="text-lg font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedCustomer.totalGasto)}</p>
               </div>
               <div className="p-4 bg-background-light dark:bg-zinc-800/50 rounded-xl border border-[#dde3e4] dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-[#678183] uppercase tracking-wider mb-1">Total Pedidos</p>
                  <p className="text-lg font-bold">14</p>
               </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs font-bold text-[#678183] uppercase tracking-widest border-b border-[#dde3e4] dark:border-zinc-800 pb-2">Contato</h5>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-[#f1f4f4] dark:bg-zinc-800 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#678183]">Email</p>
                  <p className="text-sm font-semibold truncate">{selectedCustomer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-[#f1f4f4] dark:bg-zinc-800 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">phone</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#678183]">Telefone</p>
                  <p className="text-sm font-semibold">{selectedCustomer.telefone}</p>
                </div>
              </div>
            </div>
          </div>
           <div className="p-6 bg-[#f8fafa] dark:bg-zinc-800/50 border-t border-[#dde3e4] dark:border-zinc-800 mt-auto">
            <button className="w-full py-3 bg-white dark:bg-zinc-900 border border-[#dde3e4] dark:border-zinc-700 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">mail</span>
              Enviar Email
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Customers;