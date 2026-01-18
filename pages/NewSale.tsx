import React, { useState, useMemo } from 'react';
import { CarrinhoItem, Produto } from '../types';

// Interfaces locais para o PDV
interface VendaRealizada {
  id: string;
  data: Date;
  itens: CarrinhoItem[];
  subtotal: number;
  desconto: number;
  total: number;
  metodoPagamento: string;
  status: 'Concluída' | 'Cancelada';
}

const products: Produto[] = [
  { id: 101, nome: "Headphones Sem Fio", sku: "WH-102", categoria: "Eletrônicos", estoque: 12, custo: 80, preco: 159.99, fornecedor: "", statusEstoque: "Normal", imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSeLkCn8UIqDTLCka4ETojBHqrv4MJyJ6RgnPZEACcxT9ObDvBabMWK73w-9PceRXntg5WLGTBLbx3nWxFeNY3nFINAbgqxHCI9WLXajUssGn2NcWebZLT-WFgGhYRHP8bK40KysILZhrs9ocXRksQs_bVGTU3XKLKcUQarEOUeZ5EUOhDAkT_zY0TEu-5cNudRa66whVQkSMzzyRb3c2BXfkGDT37A_U1kHuJ2nklC-b4V8-aDacEV4LA2Xa45GgQe63Fb0MM-NI" },
  { id: 102, nome: "Teclado Mecânico", sku: "KB-900", categoria: "Eletrônicos", estoque: 5, custo: 40, preco: 89.00, fornecedor: "", statusEstoque: "Baixo", imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQmYKUFsYUlxcakB0tMbJ59Fn_aXHsGDJemQsStG4Yeyi5_yOkDIFdKm6RQMWbZkTDZFNukZG4GakPewWMspyx68YY6Snwtd3e9azPpS3vu5Br6oXhHZ42JZQUPrpdXw38VhnNBeBfEJ67xFo4WPWfZYxCw2xySNGanuaJLytVmlx9OnrSvYOSrvsciA9sPcVZfNeMuOV9XJxyr5UB0cVX6De9XH_J9BAiSTC847mLSXINWpgtRz0FcYKlfn-thnMDBsoekDw-Fhc" },
  { id: 103, nome: "Cafeteira Express", sku: "CF-500", categoria: "Casa", estoque: 2, custo: 20, preco: 45.50, fornecedor: "", statusEstoque: "Crítico", imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkirkCsKOcFB5n9Ao-v4FUIMEt7qO3uUs99JLFk7nBgTNZOju1vMKtDkTZaI26sAP7wqb7naO7NnCGQLEUVwT-Bm3tQVq7QSimFQkZq0tIeZ57-gTaRaW7Q2UC5Sed8EDAP-iUS1UaaxopYYWoK1yHFnpOgSXk2JurJtbbYCOKbg2QmkM41nbDYrbI61uVraBlzC15ukpQQt4kNbtw40po2TlsSx18QFVWxNVe2TmqAseIxHzm4P0PLGqZHCr97uddBrb5Z_4bN9w" },
  { id: 104, nome: "Tênis Esportivo", sku: "RS-400", categoria: "Moda", estoque: 18, custo: 60, preco: 120.00, fornecedor: "", statusEstoque: "Normal", imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9XhwjY3M6L6N3k0Z5PytLGOJEpZ0qWICrpHo4TmFWWQvT4rCRLDkZPmgx2oyjuoFvjj6CmZYYwEjGlNJJArjI9MCoFtkJg8CgAt-9mTn7vRWTSH1OUnWCv3Kpp_tJztC3r6iTIqFteKbPQLbkp9BKWADmgZmIg5gX8PG0ykyPG8oxVtgm6ZY_uozP5QpDDhcYmT5oOSP7EczstutmvRBsnWt2v4s56M2P_XNt3GSemfjdZ7duWNa3ii_-rC7YkMZqgp-AX7vXZMg" },
  { id: 105, nome: "Carteira Couro", sku: "LW-200", categoria: "Acessórios", estoque: 25, custo: 10, preco: 35.00, fornecedor: "", statusEstoque: "Normal", imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTLD1CxWt9fr1FSEOjIHLkTpS3aSAsRWLgcnW6p9h7SXjPlFHPL2bW8TW4k0BI8rs2OMQDNDugta07EFGqEbbBTrEXb5NK_L_AeM58QqfQjJY0hnAKkw5YU5SFfDEiQpVQCR2-Yb-_QJhZiaMbtTnRJhwpW-bUCcmpL8JCPhbBEoZGDa2TAeg2JLHvIlH3FRiuP-bmb2X8CDGIS-JTlO8F-WMZyA5o0vyecTp-jmfpUwgzGcNbiehot4T31yp9n9EWMr6VLvUoKM8" },
];

const NewSale: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<'pos' | 'history'>('pos');
  const [cart, setCart] = useState<CarrinhoItem[]>([]);
  const [salesHistory, setSalesHistory] = useState<VendaRealizada[]>([]);
  
  // Checkout & Payment State
  const [discount, setDiscount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Crédito');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState<VendaRealizada | null>(null);
  
  // Payment Processing State
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'approved' | 'error'>('idle');
  const [cashReceived, setCashReceived] = useState<string>('');

  // Report State
  const [showDailyReport, setShowDailyReport] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  // Logic
  const addToCart = (product: Produto) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...prev, { ...product, quantidade: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantidade: Math.max(1, item.quantidade + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const discountVal = parseFloat(discount) || 0;
  const total = subtotal * (1 - (Math.min(discountVal, 100) / 100));
  const troco = paymentMethod === 'Dinheiro' && cashReceived ? Math.max(0, parseFloat(cashReceived) - total) : 0;

  // Daily Report Data Calculation
  const dailyReportData = useMemo(() => {
    const today = new Date().toDateString();
    const todaysSales = salesHistory.filter(
      s => s.data.toDateString() === today && s.status === 'Concluída'
    );

    const totalRevenue = todaysSales.reduce((acc, s) => acc + s.total, 0);
    const totalTransactions = todaysSales.length;
    const ticketAverage = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Payment Methods Aggregation
    const paymentMethods: Record<string, number> = {};
    todaysSales.forEach(s => {
      paymentMethods[s.metodoPagamento] = (paymentMethods[s.metodoPagamento] || 0) + s.total;
    });

    // Product Aggregation
    const soldProducts: Record<string, { qty: number, total: number }> = {};
    todaysSales.forEach(s => {
      s.itens.forEach(item => {
        if (!soldProducts[item.nome]) {
          soldProducts[item.nome] = { qty: 0, total: 0 };
        }
        soldProducts[item.nome].qty += item.quantidade;
        soldProducts[item.nome].total += item.preco * item.quantidade; // Considering original price for report simplicity
      });
    });

    const sortedProducts: { name: string; qty: number; total: number }[] = Object.entries(soldProducts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);

    return {
      totalRevenue,
      totalTransactions,
      ticketAverage,
      paymentMethods,
      sortedProducts
    };
  }, [salesHistory, showDailyReport]);

  const handleInitiateCheckout = () => {
    if (cart.length === 0) return;
    setPaymentStatus('idle');
    setCashReceived('');
    setShowPaymentModal(true);
    
    // Auto-start processing for Cards/Pix simulations
    if (paymentMethod !== 'Dinheiro') {
      setTimeout(() => setPaymentStatus('processing'), 500);
    }
  };

  const confirmPayment = () => {
    const newSale: VendaRealizada = {
      id: `#VN-${Math.floor(Math.random() * 10000)}`,
      data: new Date(),
      itens: [...cart],
      subtotal,
      desconto: discountVal,
      total,
      metodoPagamento: paymentMethod,
      status: 'Concluída'
    };

    setSalesHistory(prev => [newSale, ...prev]);
    setCart([]);
    setDiscount('');
    setShowPaymentModal(false);
    setShowReceipt(newSale);
  };

  const handleVoidSale = (id: string) => {
    if(confirm('Deseja realmente cancelar esta venda? O estoque será reposto.')) {
        setSalesHistory(prev => prev.map(sale => 
            sale.id === id ? { ...sale, status: 'Cancelada' } : sale
        ));
    }
  };

  // Filter Products
  const filteredProducts = products.filter(p => 
    (categoryFilter === 'Todos' || p.categoria === categoryFilter) &&
    (p.nome.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full gap-6 p-6 overflow-hidden relative">
      
      {/* Left Panel: Product Grid OR Sales History */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-2xl font-bold">{viewMode === 'pos' ? 'Nova Venda' : 'Histórico de Vendas'}</h2>
             <div className="bg-[#f1f4f4] dark:bg-zinc-800 p-1 rounded-lg flex">
                <button 
                  onClick={() => setViewMode('pos')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'pos' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-gray-500'}`}
                >
                  PDV
                </button>
                <button 
                  onClick={() => setViewMode('history')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'history' ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-gray-500'}`}
                >
                  Histórico
                </button>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-sm opacity-60 font-mono hidden md:inline">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
             </span>
             <button 
                onClick={() => setShowDailyReport(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-bold text-xs transition-colors"
             >
                <span className="material-symbols-outlined text-sm">assignment</span>
                Relatório do Dia
             </button>
          </div>
        </div>

        {viewMode === 'pos' ? (
          <>
            {/* Filters */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm space-y-4 shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#f1f4f4] dark:bg-zinc-800 border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm" 
                  placeholder="Buscar produtos por nome ou SKU..." 
                  type="text" 
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Todos', 'Eletrônicos', 'Moda', 'Casa', 'Acessórios'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${categoryFilter === cat ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-2 content-start">
              {filteredProducts.map(prod => (
                <div key={prod.id} onClick={() => addToCart(prod)} className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm border border-transparent hover:border-primary/30 transition-all cursor-pointer group h-fit">
                  <div className="relative aspect-square rounded-lg bg-gray-100 dark:bg-zinc-800 mb-3 overflow-hidden">
                    <img src={prod.imagemUrl} alt={prod.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button className="absolute bottom-2 right-2 size-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <h3 className="text-sm font-bold truncate text-[#121617] dark:text-white">{prod.nome}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary font-bold text-sm">R$ {prod.preco.toFixed(2)}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${prod.estoque < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {prod.estoque} un
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // History View
          <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden flex flex-col">
            {salesHistory.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">history</span>
                    <p>Nenhuma venda registrada nesta sessão.</p>
                </div>
            ) : (
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-[#dde3e4] dark:border-zinc-800 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Horário</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Itens</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Pagamento</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
                            {salesHistory.map(sale => (
                                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                                    <td className="px-6 py-4 text-xs font-bold font-mono">{sale.id}</td>
                                    <td className="px-6 py-4 text-xs">{sale.data.toLocaleTimeString()}</td>
                                    <td className="px-6 py-4 text-xs">{sale.itens.reduce((acc, i) => acc + i.quantidade, 0)} itens</td>
                                    <td className="px-6 py-4 text-xs">{sale.metodoPagamento}</td>
                                    <td className="px-6 py-4 text-xs font-bold">R$ {sale.total.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sale.status === 'Concluída' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {sale.status === 'Concluída' && (
                                            <button onClick={() => handleVoidSale(sale.id)} className="text-red-500 hover:bg-red-50 p-1 rounded text-xs font-bold">
                                                Cancelar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel: Cart & Checkout */}
      <div className="w-[380px] shrink-0 bg-white dark:bg-zinc-900 rounded-xl shadow-lg flex flex-col border border-[#dde3e4] dark:border-zinc-800 h-full">
        <div className="p-5 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            <h3 className="text-lg font-bold">Carrinho Atual</h3>
          </div>
          <button onClick={() => setCart([])} className="text-xs text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors" disabled={cart.length === 0}>
            Limpar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                <span className="material-symbols-outlined text-5xl mb-2">remove_shopping_cart</span>
                <p className="font-semibold text-sm">Seu carrinho está vazio</p>
                <p className="text-xs">Adicione produtos para começar</p>
            </div>
          ) : (
            cart.map(item => (
                <div key={item.id} className="flex gap-3 bg-[#f8fafa] dark:bg-zinc-800/50 p-3 rounded-lg group animate-fade-in">
                <div className="size-12 rounded-md bg-cover bg-center shrink-0 border border-gray-200 dark:border-zinc-700" style={{ backgroundImage: `url('${item.imagemUrl}')` }}></div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs font-bold truncate max-w-[120px] text-[#121617] dark:text-white">{item.nome}</p>
                        <p className="text-xs font-bold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                         <p className="text-[10px] opacity-60 font-mono">{item.sku}</p>
                        <div className="flex items-center bg-white dark:bg-zinc-900 rounded border border-[#dde3e4] dark:border-zinc-700 h-6">
                            <button onClick={(e) => {e.stopPropagation(); updateQuantity(item.id, -1)}} className="w-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"><span className="material-symbols-outlined text-[14px]">remove</span></button>
                            <span className="w-6 text-center text-[10px] font-bold border-x border-[#dde3e4] dark:border-zinc-700 leading-6">{item.quantidade}</span>
                            <button onClick={(e) => {e.stopPropagation(); updateQuantity(item.id, 1)}} className="w-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"><span className="material-symbols-outlined text-[14px]">add</span></button>
                        </div>
                    </div>
                </div>
                </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-[#dde3e4] dark:border-zinc-800 bg-[#f8fafa]/50 dark:bg-zinc-800/20 rounded-b-xl shrink-0">
          
          {/* Discount & Payment Method */}
          <div className="space-y-4 mb-4">
             <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Método de Pagamento</label>
                <div className="grid grid-cols-4 gap-2">
                    {[
                      {id: 'Crédito', icon: 'credit_card'},
                      {id: 'Débito', icon: 'credit_card'},
                      {id: 'Dinheiro', icon: 'payments'},
                      {id: 'Pix', icon: 'qr_code_2'}
                    ].map(method => (
                        <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${paymentMethod === method.id ? 'bg-primary border-primary text-white shadow-md' : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-primary/50 text-gray-600 dark:text-gray-300'}`}
                        >
                            <span className="material-symbols-outlined text-[18px] mb-1">{method.icon}</span>
                            <span className="text-[10px] font-bold">{method.id}</span>
                        </button>
                    ))}
                </div>
             </div>
             
             <div className="flex gap-3">
                 <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Desconto (%)</label>
                    <input 
                        type="number" 
                        value={discount} 
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-[#dde3e4] dark:border-zinc-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="0" 
                        min="0"
                        max="100"
                    />
                 </div>
                 <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Subtotal</label>
                    <div className="w-full px-3 py-2 bg-gray-100 dark:bg-zinc-800 border border-transparent rounded-lg text-sm font-bold text-gray-500 truncate">
                        R$ {subtotal.toFixed(2)}
                    </div>
                 </div>
             </div>
          </div>
          
          <div className="flex justify-between items-end border-t border-dashed border-gray-300 dark:border-zinc-700 pt-4 mb-4">
            <div>
                <p className="text-xs text-gray-500">Total a Pagar</p>
                <p className="text-xs text-green-600 font-bold">{paymentMethod}</p>
            </div>
            <span className="text-3xl font-black text-[#121617] dark:text-white tracking-tight">R$ {total.toFixed(2)}</span>
          </div>

          <button 
            onClick={handleInitiateCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-gray-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed text-white rounded-xl font-extrabold shadow-lg shadow-primary/20 disabled:shadow-none transition-all flex items-center justify-center gap-2 group"
          >
            <span>FINALIZAR VENDA</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
              <div className="p-6 border-b border-[#dde3e4] dark:border-zinc-800 flex justify-between items-center">
                 <h3 className="font-bold text-lg">Processamento de Pagamento</h3>
                 <button onClick={() => setShowPaymentModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                    <span className="material-symbols-outlined text-gray-500">close</span>
                 </button>
              </div>
              
              <div className="p-8 flex flex-col items-center">
                 <div className="text-center mb-8">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">Total a Receber</p>
                    <p className="text-4xl font-black text-primary">R$ {total.toFixed(2)}</p>
                 </div>

                 {/* Payment Logic based on Method */}
                 
                 {/* PIX / MERCADO PAGO SIMULATION */}
                 {(paymentMethod === 'Pix') && (
                    <div className="w-full flex flex-col items-center animate-fade-in">
                       <div className="size-64 bg-white p-2 rounded-xl shadow-inner border border-gray-200 mb-4 flex items-center justify-center relative">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=NexusERP-Pagamento-${total.toFixed(2)}`} alt="QR Code" className="w-full h-full opacity-90" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg/2560px-Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg.png" className="w-16 drop-shadow-lg" />
                          </div>
                       </div>
                       {paymentStatus === 'processing' && (
                         <div className="flex items-center gap-2 text-gray-500 animate-pulse mb-4">
                           <span className="material-symbols-outlined animate-spin">sync</span>
                           <span className="text-sm font-bold">Aguardando pagamento do banco...</span>
                         </div>
                       )}
                       {paymentStatus === 'approved' && (
                         <div className="flex items-center gap-2 text-green-600 mb-4 animate-bounce">
                           <span className="material-symbols-outlined">check_circle</span>
                           <span className="text-sm font-bold">Pagamento Recebido!</span>
                         </div>
                       )}
                       <button onClick={() => setPaymentStatus('approved')} className="text-xs text-primary underline hover:text-primary-dark">
                         Simular Recebimento (Webhook)
                       </button>
                    </div>
                 )}

                 {/* CARD MACHINE SIMULATION */}
                 {(paymentMethod === 'Crédito' || paymentMethod === 'Débito') && (
                    <div className="w-full flex flex-col items-center animate-fade-in">
                       <div className="size-48 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex flex-col items-center justify-center mb-6 relative overflow-hidden border border-[#dde3e4] dark:border-zinc-700">
                          {paymentStatus === 'processing' ? (
                            <>
                              <span className="material-symbols-outlined text-4xl text-blue-500 animate-spin mb-2">contactless</span>
                              <p className="text-sm font-bold animate-pulse">Aproxime ou insira...</p>
                              <p className="text-xs text-gray-500 mt-2">Conectando Maquininha...</p>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-6xl text-green-500 mb-2">check_circle</span>
                              <p className="text-lg font-bold text-green-600">Aprovado</p>
                            </>
                          )}
                       </div>
                       <div className="w-full flex gap-2">
                          <button onClick={() => setPaymentStatus('approved')} className="flex-1 py-2 bg-gray-200 dark:bg-zinc-700 rounded text-xs font-bold hover:bg-green-100 hover:text-green-700 transition-colors">Simular Aprovado</button>
                          <button onClick={() => setPaymentStatus('processing')} className="flex-1 py-2 bg-gray-200 dark:bg-zinc-700 rounded text-xs font-bold hover:bg-red-100 hover:text-red-700 transition-colors">Simular Erro</button>
                       </div>
                    </div>
                 )}

                 {/* CASH CALCULATOR */}
                 {paymentMethod === 'Dinheiro' && (
                    <div className="w-full space-y-4 animate-fade-in">
                       <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-gray-500">Valor Recebido</label>
                          <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">R$</span>
                             <input 
                                type="number" 
                                autoFocus
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value)}
                                className="w-full pl-10 py-3 bg-[#f1f4f4] dark:bg-zinc-800 border-2 border-primary/20 focus:border-primary rounded-xl text-xl font-bold outline-none transition-colors"
                             />
                          </div>
                       </div>
                       
                       <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                          <span className="font-bold text-gray-500">Troco</span>
                          <span className={`text-xl font-black ${troco < 0 ? 'text-red-500' : 'text-green-600'}`}>R$ {troco.toFixed(2)}</span>
                       </div>

                       <div className="grid grid-cols-4 gap-2">
                          {[5, 10, 20, 50, 100].map(val => (
                             <button key={val} onClick={() => setCashReceived(val.toString())} className="py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-bold hover:border-primary transition-colors">
                                R$ {val}
                             </button>
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-6 border-t border-[#dde3e4] dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                 <button 
                    onClick={confirmPayment}
                    disabled={paymentMethod === 'Dinheiro' ? (parseFloat(cashReceived) < total) : paymentStatus !== 'approved'}
                    className="w-full py-4 bg-primary disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                 >
                    <span>CONFIRMAR PAGAMENTO</span>
                    <span className="material-symbols-outlined">verified</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
                <div className="bg-success p-6 text-center text-white">
                    <div className="size-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">check</span>
                    </div>
                    <h3 className="text-xl font-bold">Venda Concluída!</h3>
                    <p className="text-white/80 text-sm">Transação registrada com sucesso</p>
                </div>
                <div className="p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative">
                    <div className="text-center mb-6">
                        <p className="text-3xl font-black text-[#121617] dark:text-white">R$ {showReceipt.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">{showReceipt.metodoPagamento}</p>
                    </div>
                    <div className="border-t border-dashed border-gray-300 dark:border-zinc-700 my-4"></div>
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">ID da Transação</span>
                            <span className="font-mono font-bold">{showReceipt.id}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Data</span>
                            <span className="font-bold">{showReceipt.data.toLocaleDateString()} {showReceipt.data.toLocaleTimeString()}</span>
                        </div>
                         <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Itens</span>
                            <span className="font-bold">{showReceipt.itens.length}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowReceipt(null)}
                        className="w-full py-3 bg-[#f1f4f4] dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-[#121617] dark:text-white rounded-xl font-bold text-sm transition-colors"
                    >
                        Nova Venda
                    </button>
                </div>
            </div>
        </div>
      )}

       {/* Daily Report Modal */}
       {showDailyReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-up max-h-[90vh]">
            <div className="p-6 border-b border-[#dde3e4] dark:border-zinc-800 flex justify-between items-center bg-[#f8fafa] dark:bg-zinc-800/50">
               <div>
                  <h3 className="font-bold text-xl text-[#121617] dark:text-white">Relatório de Vendas</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
               </div>
               <button onClick={() => setShowDailyReport(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
                  <span className="material-symbols-outlined text-gray-600">close</span>
               </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-8">
               {/* Financial Summary */}
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-center">
                     <p className="text-xs font-bold text-primary uppercase mb-1">Faturamento Total</p>
                     <p className="text-2xl font-black text-[#121617] dark:text-white">R$ {dailyReportData.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl text-center">
                     <p className="text-xs font-bold text-gray-500 uppercase mb-1">Transações</p>
                     <p className="text-2xl font-black text-[#121617] dark:text-white">{dailyReportData.totalTransactions}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl text-center">
                     <p className="text-xs font-bold text-gray-500 uppercase mb-1">Ticket Médio</p>
                     <p className="text-2xl font-black text-[#121617] dark:text-white">R$ {dailyReportData.ticketAverage.toFixed(2)}</p>
                  </div>
               </div>

               {/* Payment Methods */}
               <div>
                  <h4 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100 dark:border-zinc-800">Por Método de Pagamento</h4>
                  <div className="grid grid-cols-2 gap-3">
                     {Object.entries(dailyReportData.paymentMethods).map(([method, amount]) => (
                        <div key={method} className="flex justify-between items-center p-3 rounded-lg bg-[#f8fafa] dark:bg-zinc-800/30">
                           <span className="text-sm font-semibold">{method}</span>
                           <span className="text-sm font-bold text-[#121617] dark:text-white">R$ {(amount as number).toFixed(2)}</span>
                        </div>
                     ))}
                     {Object.keys(dailyReportData.paymentMethods).length === 0 && <p className="text-sm text-gray-400 italic">Nenhum dado disponível.</p>}
                  </div>
               </div>

               {/* Products Sold */}
               <div>
                  <h4 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3 pb-2 border-b border-gray-100 dark:border-zinc-800">Produtos Vendidos</h4>
                  <div className="border border-[#dde3e4] dark:border-zinc-800 rounded-lg overflow-hidden">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-800/80">
                           <tr>
                              <th className="px-4 py-2 font-bold text-gray-500">Produto</th>
                              <th className="px-4 py-2 font-bold text-gray-500 text-right">Qtd</th>
                              <th className="px-4 py-2 font-bold text-gray-500 text-right">Total</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
                           {dailyReportData.sortedProducts.map((prod, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                                 <td className="px-4 py-2">{prod.name}</td>
                                 <td className="px-4 py-2 text-right font-mono">{prod.qty}</td>
                                 <td className="px-4 py-2 text-right font-bold">R$ {prod.total.toFixed(2)}</td>
                              </tr>
                           ))}
                           {dailyReportData.sortedProducts.length === 0 && (
                              <tr>
                                 <td colSpan={3} className="px-4 py-6 text-center text-gray-400 italic">Nenhum produto vendido hoje.</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-zinc-800 border-t border-[#dde3e4] dark:border-zinc-800 flex justify-end gap-3">
               <button onClick={() => window.print()} className="px-4 py-2 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  Imprimir
               </button>
               <button onClick={() => setShowDailyReport(false)} className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors">
                  Fechar
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewSale;