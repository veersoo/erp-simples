import React, { useState } from 'react';
import { Usuario } from '../types';

const initialUsers: Usuario[] = [
  { id: 1, nome: "Admin User", email: "admin@nexus.com", funcao: "Administrador", status: "Ativo", avatarUrl: "https://ui-avatars.com/api/?name=Admin+User&background=1f737a&color=fff", ultimoAcesso: "Hoje, 10:30" },
  { id: 2, nome: "João Vendedor", email: "joao@nexus.com", funcao: "Vendedor", status: "Ativo", avatarUrl: "https://ui-avatars.com/api/?name=Joao+Vendedor&background=E73108&color=fff", ultimoAcesso: "Ontem, 18:00" },
  { id: 3, nome: "Maria Gerente", email: "maria@nexus.com", funcao: "Gerente", status: "Bloqueado", avatarUrl: "https://ui-avatars.com/api/?name=Maria+Gerente&background=004c8a&color=fff", ultimoAcesso: "20 Out, 2023" },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    funcao: 'Vendedor',
    status: 'Ativo'
  });

  const handleOpenModal = (user?: Usuario) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        nome: user.nome,
        email: user.email,
        funcao: user.funcao,
        status: user.status
      });
    } else {
      setEditingId(null);
      setFormData({ nome: '', email: '', funcao: 'Vendedor', status: 'Ativo' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: Usuario = {
      id: editingId || Date.now(),
      nome: formData.nome,
      email: formData.email,
      funcao: formData.funcao as any,
      status: formData.status as any,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.nome)}&background=random&color=fff`,
      ultimoAcesso: 'Nunca'
    };

    if (editingId) {
      setUsers(prev => prev.map(u => u.id === editingId ? { ...newUser, ultimoAcesso: u.ultimoAcesso } : u));
    } else {
      setUsers(prev => [newUser, ...prev]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <header className="flex items-center justify-between border-b border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-background-dark px-8 py-4 sticky top-0 z-10">
        <div>
           <h2 className="text-[#121617] dark:text-white text-2xl font-extrabold tracking-tight">Usuários do Sistema</h2>
           <p className="text-xs text-[#678183]">Gerencie o acesso e permissões da equipe.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-[#165a61] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Novo Usuário
        </button>
      </header>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-zinc-900 border border-[#dde3e4] dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafa] dark:bg-zinc-800/50 border-b border-[#dde3e4] dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Função</th>
                <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Último Acesso</th>
                <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} alt={user.nome} className="size-10 rounded-full border border-gray-200 dark:border-zinc-700" />
                      <div>
                        <p className="text-sm font-bold text-[#121617] dark:text-white">{user.nome}</p>
                        <p className="text-xs text-[#678183]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                      user.funcao === 'Administrador' ? 'bg-purple-100 text-purple-700' :
                      user.funcao === 'Gerente' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.funcao}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#678183]">{user.ultimoAcesso}</td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(user)} className="p-1.5 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded text-[#678183] hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded text-[#678183] hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#121617] dark:text-white">{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded-full transition-colors text-[#678183]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                  className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Função</label>
                  <select 
                     value={formData.funcao}
                     onChange={(e) => setFormData({...formData, funcao: e.target.value})}
                     className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Vendedor">Vendedor</option>
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

export default Users;
