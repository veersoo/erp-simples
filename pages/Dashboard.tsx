import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', receita: 4000, despesa: 2400 },
  { name: 'Fev', receita: 3000, despesa: 1398 },
  { name: 'Mar', receita: 2000, despesa: 9800 },
  { name: 'Abr', receita: 2780, despesa: 3908 },
  { name: 'Mai', receita: 1890, despesa: 4800 },
  { name: 'Jun', receita: 2390, despesa: 3800 },
  { name: 'Jul', receita: 3490, despesa: 4300 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      <h2 className="text-[#121617] dark:text-white text-2xl font-bold">Visão Geral</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[#678183] text-sm font-medium">Receita Total</p>
            <span className="material-symbols-outlined text-primary">payments</span>
          </div>
          <p className="text-[#121617] dark:text-white text-2xl font-bold tracking-tight">R$ 128.430</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-success text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
            </span>
            <span className="text-[#678183] text-[11px]">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[#678183] text-sm font-medium">Lucro Mensal</p>
            <span className="material-symbols-outlined text-primary">analytics</span>
          </div>
          <p className="text-[#121617] dark:text-white text-2xl font-bold tracking-tight">R$ 42.150</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-success text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +5.2%
            </span>
            <span className="text-[#678183] text-[11px]">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[#678183] text-sm font-medium">Pedidos Pendentes</p>
            <span className="material-symbols-outlined text-[#678183]">shopping_cart</span>
          </div>
          <p className="text-[#121617] dark:text-white text-2xl font-bold tracking-tight">18</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-warning text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">error</span> Requer Atenção
            </span>
          </div>
        </div>

        <div className="bg-accent-alert/10 dark:bg-accent-alert/5 p-6 rounded-xl border border-accent-alert/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-accent-alert text-sm font-bold">Estoque Baixo</p>
            <span className="material-symbols-outlined text-accent-alert">warning</span>
          </div>
          <p className="text-[#121617] dark:text-white text-2xl font-bold tracking-tight">5</p>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-accent-alert text-xs font-medium">Itens críticos identificados</p>
          </div>
        </div>
      </div>

      {/* Main Analytical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Container */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[#121617] dark:text-white text-lg font-bold">Desempenho Financeiro</h3>
              <p className="text-[#678183] text-sm">Receita vs Despesas (Últimos 6 Meses)</p>
            </div>
          </div>
          <div className="h-64 relative w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f737a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1f737a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#678183', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="receita" stroke="#1f737a" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" />
                <Area type="monotone" dataKey="despesa" stroke="#dde3e4" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#121617] dark:text-white text-lg font-bold">Atividades Recentes</h3>
            <button className="text-primary text-xs font-bold hover:underline">Ver Todas</button>
          </div>
          <div className="space-y-6 flex-1">
            <div className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-success shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-[#121617] dark:text-white">Fatura #902 paga por Acme Corp</p>
                <p className="text-xs text-[#678183]">10 minutos atrás</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-[#121617] dark:text-white">Atualização de estoque: Macbook Pro</p>
                <p className="text-xs text-[#678183]">1 hora atrás</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 w-2 h-2 rounded-full bg-warning shrink-0"></div>
              <div>
                <p className="text-sm font-semibold text-[#121617] dark:text-white">Alerta de estoque: Tinta Epson</p>
                <p className="text-xs text-[#678183]">5 horas atrás</p>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 rounded-lg text-sm font-bold text-[#121617] dark:text-white hover:bg-primary hover:text-white transition-all">
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;