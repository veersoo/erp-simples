import React, { useState, useMemo } from 'react';
import { useStore } from '../contexts/StoreContext';
import { CarrinhoItem, Produto } from '../types';

const StoreFront: React.FC = () => {
  const { products, storeConfig } = useStore();
  const [cart, setCart] = useState<CarrinhoItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Categories Calculation
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.categoria));
    return ['Todos', ...Array.from(cats)];
  }, [products]);

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || p.categoria === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured Products
  const featuredProducts = products.filter(p => p.destaque);

  // Cart Logic
  const addToCart = (product: Produto) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      setIsCartOpen(true);
      return [...prev, { ...product, quantidade: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantidade: Math.max(1, item.quantidade + delta) };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  const handleCheckout = () => {
    const itemsList = cart.map(item => `• ${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2)})`).join('%0A');
    const totalMsg = `*Total: R$ ${cartTotal.toFixed(2)}*`;
    const message = `${storeConfig.mensagemBoasVindas}%0A%0A*Meu Pedido:*%0A${itemsList}%0A%0A${totalMsg}`;
    
    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] overflow-y-auto">
      
      {/* Navbar */}
      <nav style={{ backgroundColor: storeConfig.corPrincipal }} className="text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight">{storeConfig.nomeLoja}</div>
            <div className="flex items-center gap-4">
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold size-4 flex items-center justify-center rounded-full">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>
        </div>
      </nav>

      {/* Hero / Banner */}
      <div className="h-[300px] w-full bg-gray-200 relative overflow-hidden">
        <img src={storeConfig.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="max-w-6xl mx-auto px-4 w-full pb-8">
                <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-2 shadow-sm">{storeConfig.nomeLoja}</h1>
                <p className="text-white/80 text-lg">Os melhores produtos, selecionados para você.</p>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 pb-24">
        
        {/* Featured Carousel (Simplified as Grid for Reliability without external libs) */}
        {featuredProducts.length > 0 && (
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-yellow-500 filled">star</span>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white uppercase tracking-wide">Destaques</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {featuredProducts.map(prod => (
                        <div key={prod.id} className="min-w-[240px] w-[240px] bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden snap-center hover:-translate-y-1 transition-transform duration-300">
                             <div className="h-40 overflow-hidden relative">
                                <img src={prod.imagemUrl} className="w-full h-full object-cover" />
                                <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">Oferta</span>
                             </div>
                             <div className="p-4">
                                <h3 className="font-bold text-gray-800 dark:text-white truncate">{prod.nome}</h3>
                                <p className="text-sm text-gray-500 mb-3">{prod.categoria}</p>
                                <div className="flex items-center justify-between">
                                    <span style={{ color: storeConfig.corPrincipal }} className="font-black text-lg">R$ {prod.preco.toFixed(2)}</span>
                                    <button onClick={() => addToCart(prod)} style={{ backgroundColor: storeConfig.corPrincipal }} className="size-8 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Filters & Search */}
        <section id="shop">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                 <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input 
                        type="text" 
                        placeholder="Buscar produtos..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-gray-800 text-white dark:bg-white dark:text-black' : 'bg-white text-gray-600 dark:bg-zinc-900 dark:text-gray-400 border border-gray-200 dark:border-zinc-800'}`}
                        >
                            {cat}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(prod => (
                    <div key={prod.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                         <div className="aspect-square overflow-hidden bg-gray-100 relative">
                            <img src={prod.imagemUrl} alt={prod.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {prod.estoque <= 0 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold uppercase">Esgotado</span>
                                </div>
                            )}
                         </div>
                         <div className="p-4">
                            <p className="text-xs text-gray-500 mb-1">{prod.categoria}</p>
                            <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-2 line-clamp-2 min-h-[40px]">{prod.nome}</h3>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 line-through">R$ {(prod.preco * 1.2).toFixed(2)}</p>
                                    <p style={{ color: storeConfig.corPrincipal }} className="font-black text-lg leading-none">R$ {prod.preco.toFixed(2)}</p>
                                </div>
                                <button 
                                    onClick={() => addToCart(prod)}
                                    disabled={prod.estoque <= 0}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1 ${prod.estoque <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'hover:opacity-90'}`}
                                    style={{ backgroundColor: prod.estoque > 0 ? storeConfig.corPrincipal : undefined }}
                                >
                                    Comprar
                                </button>
                            </div>
                         </div>
                    </div>
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                    <p>Nenhum produto encontrado.</p>
                </div>
            )}
        </section>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col animate-slide-in-right">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50 dark:bg-zinc-800">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        Seu Carrinho
                    </h3>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                             <span className="material-symbols-outlined text-6xl mb-4 opacity-20">remove_shopping_cart</span>
                             <p>Seu carrinho está vazio</p>
                             <button onClick={() => setIsCartOpen(false)} className="mt-4 text-primary font-bold text-sm hover:underline">Continuar Comprando</button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
                                <div className="size-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    <img src={item.imagemUrl} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1">{item.nome}</h4>
                                        <p className="text-xs text-gray-500">{item.sku}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-sm">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                                        <div className="flex items-center bg-gray-100 dark:bg-zinc-900 rounded-lg h-8">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-l-lg text-gray-600">
                                                {item.quantidade === 1 ? <span className="material-symbols-outlined text-[16px] text-red-500">delete</span> : '-'}
                                            </button>
                                            <span className="w-8 text-center text-xs font-bold">{item.quantidade}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-r-lg text-gray-600">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-sm font-bold text-gray-500 uppercase">Total</span>
                            <span className="text-2xl font-black text-gray-800 dark:text-white">R$ {cartTotal.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                            style={{ backgroundColor: '#25D366' }} // WhatsApp Green
                        >
                            <span className="material-symbols-outlined text-white">chat</span>
                            Finalizar no WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
};

export default StoreFront;