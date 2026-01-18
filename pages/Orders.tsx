import React, { useState } from 'react';
import { Pedido } from '../types';

const initialPedidos: Pedido[] = [
  { id: "#ORD-7721", cliente: "Alice Thompson", clienteAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFW2e3MKik45ZOgzEeKOEnRgDc1jWiSK2IpSjJTuV4AU1FDvPz5LrSuoqAtsXj0-oWFA2jtmz3YDpcibBfKAmeBVQk2gWW4dsjeBh8uZFSeQufYh-K0tEAMZhuKXnUb7wVEQyd1VLiLhQWgPnttmPufznDjkWwsrwh7HQ0b2oWPSMc1XUiWRJ2bQJ0_bEDFZD8XbYeaSQqX8XqPFXUbVYUKmzY9W2s4_K8WExm9EfIB1XsNMKEB4tk6PPyjxiAcVjara9TgTDk4C0", data: "24 Out, 2023", valor: 1240.00, status: "Pago" },
  { id: "#ORD-7722", cliente: "Marcus Sterling", clienteAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDU-pa_9piXkvCvdOaSdazhYBRKmrbEWzQgSm0lmcviBX3HzMpvHlmFhOF_ba9UZfw6y1SW6IWXNd3dFgZIRwzNF1z-9zi40kpM3IQ6ThHhVOT4-bzv3kH2ZLdD3Hb1n6d2-IVv_csvn26-NhoogATA3k5oXK258VlEjp0Kos62bvSndlhLVUQ_Oh5WKrq5aQxb60ZCaEOeLVgNK5LG4IrfH43pyeJR10grkskwgMof5J9Ffq9M8H5c8dt7T0HrYetbOSHhG5a_lI8", data: "23 Out, 2023", valor: 450.50, status: "Pendente" },
  { id: "#ORD-7723", cliente: "James K. Wilson", clienteAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCxkuQ3KaKgp5qtico07spMB9CDL28bnICBr4kfgWEQAseWJ8u_QkVCHgDhmz6QZWBbBhAtBbY4L3QBicFxmG_W6FvpntdkJuCHOMCE0zd4IsJuRVYA7f17pomlkPaW3ZO5U3KOBft2coH9XGd2a_PqZd0-UAYNawj10RPfuV0H7mEFnBPhb434RQ3xNhj6aXurz5TSWA8TZNBdbdKGFOQjlOVdbj4-WceXRYfrjTr_K2h7y4ODKNdv2PR8vdGzNKZM73gkFTOyAs", data: "22 Out, 2023", valor: 3100.00, status: "Pago" },
  { id: "#ORD-7724", cliente: "Elena Rodriguez", clienteAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBak4DTd4C-zyiXOkwHZqgcnLa8N77Wmu67J7lYnCEuSv9HVfrhCXqBe-2oQP54rm6Xsxu8KewjK60ccEOL00yjeLecZjBno4LQZGzpwlK4TL80XhjKt0eOEr7cWDugtrGvsO7viLOqoxguaAAI85x74U7XBf8FwIu9FexwJpHs2Yv9sPijOfQWc02-lNAqZKhtr7YJi2ADb-WeGAIemkITmu3S5ET8YRLtykqkdN21mUi5rOMlS8FO3BwQnj-p07LRr6eVbQ3kErk", data: "22 Out, 2023", valor: 89.99, status: "Cancelado" },
];

const Orders: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>(initialPedidos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ cliente: '', valor: '', status: 'Pendente' });

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Pedido = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      cliente: formData.cliente || "Cliente Balcão",
      clienteAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.cliente || "C")}&background=random`,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      valor: parseFloat(formData.valor) || 0,
      status: formData.status as any,
    };
    setPedidos([newOrder, ...pedidos]);
    setIsModalOpen(false);
    setFormData({ cliente: '', valor: '', status: 'Pendente' });
  };

  const cycleStatus = (id: string) => {
    setPedidos(pedidos.map(p => {
      if (p.id === id) {
        const statuses: Pedido['status'][] = ['Pendente', 'Processando', 'Enviado', 'Pago', 'Cancelado'];
        const nextIndex = (statuses.indexOf(p.status) + 1) % statuses.length;
        return { ...p, status: statuses[nextIndex] };
      }
      return p;
    }));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-full">
      <header className="flex items-center justify-between border-b border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-background-dark px-8 py-4 sticky top-0 z-10">
        <h2 className="text-[#121617] dark:text-white text-2xl font-extrabold tracking-tight">Gerenciamento de Pedidos</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-[#165a61] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Novo Pedido Manual
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Orders Table */}
        <div className="bg-white dark:bg-zinc-900 border border-[#dde3e4] dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#dde3e4] dark:border-zinc-800 bg-[#fafafa] dark:bg-zinc-800/50">
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">ID Pedido</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider text-right">Valor</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-extrabold text-[#678183] uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-[#fafafa] dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-primary">{pedido.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gray-200 overflow-hidden">
                          <img src={pedido.clienteAvatar} alt={pedido.cliente} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-semibold text-[#121617] dark:text-white">{pedido.cliente}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#678183]">{pedido.data}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#121617] dark:text-white text-right">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valor)}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => cycleStatus(pedido.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105 ${
                        pedido.status === 'Pago' ? 'bg-green-100 text-green-700' :
                        pedido.status === 'Pendente' ? 'bg-amber-100 text-amber-700' :
                        pedido.status === 'Processando' ? 'bg-blue-100 text-blue-700' :
                        pedido.status === 'Enviado' ? 'bg-purple-100 text-purple-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {pedido.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#678183] hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

       {/* Add Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#121617] dark:text-white">Novo Pedido Manual</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded-full transition-colors text-[#678183]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddOrder} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Nome do Cliente</label>
                <input 
                  type="text" 
                  value={formData.cliente}
                  onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                  required
                  className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  placeholder="Nome do Cliente"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Valor (R$)</label>
                  <input 
                    type="number" 
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    required
                    step="0.01"
                    className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Status Inicial</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Processando">Processando</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-[#f1f4f4] dark:bg-zinc-800 text-[#121617] dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                  Criar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;