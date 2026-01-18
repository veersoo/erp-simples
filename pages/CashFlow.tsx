import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Transacao } from '../types';

const financialData = [
  { name: 'Jan', entrada: 15000, saida: 10000 },
  { name: 'Fev', entrada: 25000, saida: 12000 },
  { name: 'Mar', entrada: 18000, saida: 15000 },
  { name: 'Abr', entrada: 30000, saida: 11000 },
  { name: 'Mai', entrada: 22000, saida: 18000 },
  { name: 'Jun', entrada: 40000, saida: 20000 },
];

const initialTransactions: Transacao[] = [
  { id: 1, data: "24 Mar, 2024", descricao: "Infraestrutura Cloud", tipo: 'Débito', valor: 12450.00 },
  { id: 2, data: "22 Mar, 2024", descricao: "Licenciamento Software", tipo: 'Crédito', valor: 28400.00 },
  { id: 3, data: "20 Mar, 2024", descricao: "Pagamento Fornecedores", tipo: 'Débito', valor: 5200.00 },
  { id: 4, data: "18 Mar, 2024", descricao: "Venda #8821 - ACME", tipo: 'Crédito', valor: 15000.00 },
];

const CashFlow: React.FC = () => {
  const [transactions, setTransactions] = useState<Transacao[]>(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ descricao: '', valor: '', tipo: 'Crédito' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Calcular KPIs Dinamicamente
  const kpis = useMemo(() => {
    const totalEntradas = transactions
      .filter(t => t.tipo === 'Crédito')
      .reduce((acc, curr) => acc + curr.valor, 0);
    
    const totalSaidas = transactions
      .filter(t => t.tipo === 'Débito')
      .reduce((acc, curr) => acc + curr.valor, 0);

    const saldo = totalEntradas - totalSaidas;

    return { totalEntradas, totalSaidas, saldo };
  }, [transactions]);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch(name) {
        case 'descricao':
            if (!value.trim()) error = 'Descrição é obrigatória';
            break;
        case 'valor':
            if (!value) error = 'Valor é obrigatório';
            else if (parseFloat(value) <= 0) error = 'Valor deve ser positivo';
            break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched({ descricao: true, valor: true, tipo: true });

    if (Object.keys(newErrors).length === 0) {
        const newTransaction: Transacao = {
          id: Date.now(),
          data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
          descricao: formData.descricao,
          tipo: formData.tipo as 'Crédito' | 'Débito',
          valor: parseFloat(formData.valor)
        };

        setTransactions([newTransaction, ...transactions]);
        setIsModalOpen(false);
        setFormData({ descricao: '', valor: '', tipo: 'Crédito' });
        setTouched({});
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <header className="h-16 border-b border-[#dae1e7] dark:border-zinc-800 bg-white dark:bg-background-dark flex items-center justify-between px-8 shrink-0">
        <h2 className="text-xl font-bold tracking-tight">Fluxo de Caixa</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Adicionar Transação
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dae1e7] dark:border-zinc-800 shadow-sm relative overflow-hidden">
              <p className="text-[#5e788d] text-sm font-semibold mb-1">Entradas Totais</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-[#121617] dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.totalEntradas)}
                </p>
                <span className="text-emerald-500 text-xs font-bold">+12%</span>
              </div>
           </div>
           <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dae1e7] dark:border-zinc-800 shadow-sm relative overflow-hidden">
              <p className="text-[#5e788d] text-sm font-semibold mb-1">Saídas Totais</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black text-[#121617] dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.totalSaidas)}
                </p>
                <span className="text-rose-500 text-xs font-bold">+5%</span>
              </div>
           </div>
           <div className={`bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dae1e7] dark:border-zinc-800 shadow-sm relative overflow-hidden border-l-4 ${kpis.saldo >= 0 ? 'border-l-primary' : 'border-l-red-500'}`}>
              <p className="text-[#5e788d] text-sm font-semibold mb-1">Saldo Líquido</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-black ${kpis.saldo >= 0 ? 'text-primary' : 'text-red-500'}`}>
                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.saldo)}
                </p>
                <span className="text-primary text-xs font-bold">Atual</span>
              </div>
           </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dae1e7] dark:border-zinc-800 shadow-sm">
           <h3 className="text-base font-bold mb-4">Análise Mensal</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="gradEntrada" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradSaida" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <Tooltip />
                <Area type="monotone" dataKey="entrada" stroke="#10b981" fillOpacity={1} fill="url(#gradEntrada)" />
                <Area type="monotone" dataKey="saida" stroke="#ef4444" fillOpacity={1} fill="url(#gradSaida)" />
              </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Transactions */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-[#dae1e7] dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#dae1e7] dark:border-zinc-800">
            <h3 className="text-base font-bold">Transações Recentes</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#f8fafa] dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-[#5e788d] uppercase">Data</th>
                <th className="px-6 py-3 text-xs font-bold text-[#5e788d] uppercase">Descrição</th>
                <th className="px-6 py-3 text-xs font-bold text-[#5e788d] uppercase">Tipo</th>
                <th className="px-6 py-3 text-xs font-bold text-[#5e788d] uppercase text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dae1e7] dark:divide-zinc-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-semibold">{t.data}</td>
                  <td className="px-6 py-4 text-xs font-bold">{t.descricao}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-[10px] ${t.tipo === 'Crédito' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.tipo.toUpperCase()}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-xs font-black text-right ${t.tipo === 'Crédito' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.tipo === 'Débito' ? '-' : '+'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#121617] dark:text-white">Nova Transação</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded-full transition-colors text-[#678183]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Descrição</label>
                <input 
                  type="text" 
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.descricao && touched.descricao ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Ex: Pagamento Fornecedor"
                />
                 {errors.descricao && touched.descricao && <p className="text-red-500 text-xs font-bold mt-1">{errors.descricao}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Tipo</label>
                  <select 
                    name="tipo" 
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  >
                    <option value="Crédito">Crédito (Entrada)</option>
                    <option value="Débito">Débito (Saída)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Valor (R$)</label>
                  <input 
                    type="number" 
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    step="0.01"
                    className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.valor && touched.valor ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                    placeholder="0.00"
                  />
                   {errors.valor && touched.valor && <p className="text-red-500 text-xs font-bold mt-1">{errors.valor}</p>}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-[#f1f4f4] dark:bg-zinc-800 text-[#121617] dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlow;