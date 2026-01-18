import React, { useState } from 'react';
import { Funcionario } from '../types';

const initialEmployees: Funcionario[] = [
  { id: 1, nome: "Roberto Almeida", cargo: "Desenvolvedor Sênior", departamento: "TI", email: "roberto.a@nexus.com", salario: 12500, status: 'Ativo', admissao: "10/02/2021", avatarUrl: "https://ui-avatars.com/api/?name=Roberto+Almeida&background=0D8ABC&color=fff" },
  { id: 2, nome: "Fernanda Costa", cargo: "Gerente de RH", departamento: "Recursos Humanos", email: "fernanda.c@nexus.com", salario: 9800, status: 'Ativo', admissao: "15/05/2020", avatarUrl: "https://ui-avatars.com/api/?name=Fernanda+Costa&background=E73108&color=fff" },
  { id: 3, nome: "Carlos Oliveira", cargo: "Analista Financeiro", departamento: "Financeiro", email: "carlos.o@nexus.com", salario: 6500, status: 'Férias', admissao: "22/08/2022", avatarUrl: "https://ui-avatars.com/api/?name=Carlos+Oliveira&background=1f737a&color=fff" },
];

const HR: React.FC = () => {
  const [employees, setEmployees] = useState<Funcionario[]>(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', cargo: '', departamento: '', email: '', salario: '', status: 'Ativo' });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee: Funcionario = {
      id: Date.now(),
      nome: formData.nome,
      cargo: formData.cargo,
      departamento: formData.departamento,
      email: formData.email,
      salario: parseFloat(formData.salario),
      status: formData.status as any,
      admissao: new Date().toLocaleDateString('pt-BR'),
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.nome)}&background=random&color=fff`
    };
    setEmployees([newEmployee, ...employees]);
    setIsModalOpen(false);
    setFormData({ nome: '', cargo: '', departamento: '', email: '', salario: '', status: 'Ativo' });
  };

  const handleDelete = (id: number) => {
    if (confirm("Deseja realmente remover este funcionário?")) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <header className="flex items-center justify-between border-b border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-background-dark px-8 py-4 sticky top-0 z-10">
        <div>
           <h2 className="text-[#121617] dark:text-white text-2xl font-extrabold tracking-tight">Gestão de Pessoas (RH)</h2>
           <p className="text-xs text-[#678183]">Gerencie sua equipe, cargos e salários.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-[#165a61] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Novo Funcionário
        </button>
      </header>

      <div className="p-8 space-y-8 flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col gap-1">
            <p className="text-[#678183] text-sm font-bold uppercase">Total Colaboradores</p>
            <p className="text-3xl font-black text-[#121617] dark:text-white">{employees.length}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col gap-1">
            <p className="text-[#678183] text-sm font-bold uppercase">Folha Salarial (Mensal)</p>
            <p className="text-3xl font-black text-[#121617] dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(employees.reduce((acc, curr) => acc + curr.salario, 0))}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col gap-1">
            <p className="text-[#678183] text-sm font-bold uppercase">Em Férias</p>
            <p className="text-3xl font-black text-[#121617] dark:text-white">{employees.filter(e => e.status === 'Férias').length}</p>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white dark:bg-zinc-900 border border-[#dde3e4] dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#dde3e4] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-800/50">
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Colaborador</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Cargo / Depto</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Admissão</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Salário</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#fafafa] dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatarUrl} alt={emp.nome} className="size-10 rounded-full border border-gray-200 dark:border-zinc-700" />
                        <div>
                          <p className="text-sm font-bold text-[#121617] dark:text-white">{emp.nome}</p>
                          <p className="text-xs text-[#678183]">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#121617] dark:text-white">{emp.cargo}</p>
                      <p className="text-xs text-[#678183]">{emp.departamento}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#678183]">{emp.admissao}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#121617] dark:text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emp.salario)}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        emp.status === 'Ativo' ? 'bg-green-100 text-green-700' :
                        emp.status === 'Férias' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="text-[#678183] hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button onClick={() => handleDelete(emp.id)} className="text-[#678183] hover:text-red-500 transition-colors">
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
      </div>

       {/* Add Employee Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg shadow-2xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#121617] dark:text-white">Cadastrar Funcionário</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded-full transition-colors text-[#678183]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Cargo</label>
                  <input 
                    type="text" 
                    value={formData.cargo}
                    onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Departamento</label>
                  <input 
                    type="text" 
                    value={formData.departamento}
                    onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Email Corporativo</label>
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
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Salário (R$)</label>
                  <input 
                    type="number" 
                    value={formData.salario}
                    onChange={(e) => setFormData({...formData, salario: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
                 <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Status</label>
                  <select 
                     value={formData.status}
                     onChange={(e) => setFormData({...formData, status: e.target.value})}
                     className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Férias">Férias</option>
                    <option value="Desligado">Desligado</option>
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

export default HR;