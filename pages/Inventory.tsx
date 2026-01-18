import React, { useState, useRef } from 'react';
import { Produto } from '../types';
import { useStore } from '../contexts/StoreContext';

const Inventory: React.FC = () => {
  // Use Global State
  const { products, setProducts } = useStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ 
    nome: '', 
    sku: '', 
    categoria: '', 
    preco: '', 
    estoque: '', 
    fornecedor: '',
    custo: '',
    destaque: false
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to calculate status based on quantity
  const calculateStatus = (qty: number): Produto['statusEstoque'] => {
    if (qty === 0) return 'Esgotado';
    if (qty < 5) return 'Crítico';
    if (qty < 15) return 'Baixo';
    return 'Normal';
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'nome':
        if (!value.trim()) error = 'Nome do produto é obrigatório';
        break;
      case 'sku':
        if (!value.trim()) error = 'SKU é obrigatório';
        else if (value.length < 3) error = 'SKU deve ter min. 3 caracteres';
        break;
      case 'categoria':
        if (!value.trim()) error = 'Categoria é obrigatória';
        break;
      case 'preco':
        if (!value) error = 'Preço é obrigatório';
        else if (parseFloat(value) <= 0) error = 'Preço deve ser positivo';
        break;
      case 'estoque':
        if (value === '') error = 'Estoque é obrigatório';
        else if (parseInt(value) < 0) error = 'Estoque não pode ser negativo';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox separately
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const openModal = (produto?: Produto) => {
    setErrors({});
    setTouched({});
    if (produto) {
      setEditingId(produto.id);
      setFormData({
        nome: produto.nome,
        sku: produto.sku,
        categoria: produto.categoria,
        preco: produto.preco.toString(),
        estoque: produto.estoque.toString(),
        fornecedor: produto.fornecedor,
        custo: produto.custo.toString(),
        destaque: produto.destaque || false
      });
      setImagePreview(produto.imagemUrl);
    } else {
      setEditingId(null);
      setFormData({ nome: '', sku: '', categoria: '', preco: '', estoque: '', fornecedor: '', custo: '', destaque: false });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'destaque') {
        const error = validateField(key, formData[key as keyof typeof formData] as string);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({ nome: true, sku: true, categoria: true, preco: true, estoque: true });

    if (Object.keys(newErrors).length === 0) {
      const estoqueNum = parseInt(formData.estoque);
      const precoNum = parseFloat(formData.preco);
      const custoNum = parseFloat(formData.custo) || 0;

      const productData: Produto = {
        id: editingId ? editingId : Date.now(),
        nome: formData.nome,
        sku: formData.sku,
        categoria: formData.categoria,
        preco: precoNum,
        estoque: estoqueNum,
        custo: custoNum,
        fornecedor: formData.fornecedor || 'N/A',
        statusEstoque: calculateStatus(estoqueNum),
        imagemUrl: imagePreview || 'https://via.placeholder.com/150',
        destaque: formData.destaque
      };

      if (editingId) {
        setProducts(prev => prev.map(p => p.id === editingId ? productData : p));
      } else {
        setProducts(prev => [...prev, productData]);
      }

      setIsModalOpen(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.nome.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()) || 
    p.fornecedor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
      <header className="h-16 border-b border-[#dde3e4] dark:border-zinc-800 bg-white dark:bg-background-dark px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6 flex-1">
          <h2 className="text-[#121617] dark:text-white text-xl font-bold tracking-tight">Controle de Estoque</h2>
          <div className="max-w-md w-full relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#678183] text-lg">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border-none bg-[#f1f4f4] dark:bg-zinc-800 rounded-lg text-sm placeholder-[#678183] focus:ring-2 focus:ring-primary/50" 
              placeholder="Buscar SKU, Produto ou Fornecedor..." 
              type="text" 
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Novo Produto</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-background-dark p-5 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <span className="text-[#678183] text-sm font-medium">Total SKUs</span>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-xl">inventory_2</span>
            </div>
            <p className="text-2xl font-bold text-[#121617] dark:text-white">{products.length}</p>
          </div>
           <div className="bg-white dark:bg-background-dark p-5 rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <span className="text-[#678183] text-sm font-medium">Estoque Baixo</span>
              <span className="material-symbols-outlined text-warning bg-warning/10 p-1.5 rounded-lg text-xl">priority_high</span>
            </div>
            <p className="text-2xl font-bold text-[#121617] dark:text-white">
              {products.filter(p => p.estoque < 15).length}
            </p>
             <p className="text-warning text-xs font-bold">Requer atenção</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-background-dark rounded-xl border border-[#dde3e4] dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-[#dde3e4] dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider text-right">Estoque</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider text-right">Preço</th>
                  <th className="px-6 py-4 text-xs font-bold text-[#678183] uppercase tracking-wider">Loja</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3e4] dark:divide-zinc-800">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className={`hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors ${prod.statusEstoque === 'Crítico' || prod.statusEstoque === 'Esgotado' ? 'bg-warning/5' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 bg-slate-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 border border-[#dde3e4] dark:border-zinc-700">
                          <img className="w-full h-full object-cover" src={prod.imagemUrl} alt={prod.nome} />
                        </div>
                        <span className="text-sm font-bold text-[#121617] dark:text-white">{prod.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-[#678183]">{prod.sku}</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-[#678183]">{prod.categoria}</span></td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex flex-col items-end">
                          <span className={`text-sm font-bold ${prod.estoque < 5 ? 'text-warning' : 'text-success'}`}>{prod.estoque}</span>
                          <span className={`text-[10px] uppercase font-bold ${prod.statusEstoque === 'Esgotado' ? 'text-red-500' : 'text-[#678183]'}`}>{prod.statusEstoque}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">R$ {prod.preco.toFixed(2)}</td>
                    <td className="px-6 py-4">
                        {prod.destaque ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase border border-yellow-200">
                                <span className="material-symbols-outlined text-[14px]">star</span> Destaque
                            </span>
                        ) : (
                            <span className="text-[#678183] text-xs">-</span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openModal(prod)} className="p-1.5 hover:bg-primary/10 rounded text-[#678183] hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                         <button onClick={() => handleDelete(prod.id)} className="p-1.5 hover:bg-red-50 rounded text-[#678183] hover:text-red-500 transition-colors">
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

       {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-[#dde3e4] dark:border-zinc-800 overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#dde3e4] dark:border-zinc-800 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-lg text-[#121617] dark:text-white">
                {editingId ? 'Editar Produto' : 'Cadastrar Produto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 rounded-full transition-colors text-[#678183]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload Section */}
                <div className="flex gap-6 items-start">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="size-32 rounded-xl bg-[#f1f4f4] dark:bg-zinc-800 border-2 border-dashed border-[#dde3e4] dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors shrink-0 overflow-hidden relative group"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="material-symbols-outlined text-white">edit</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[#678183] text-3xl">add_photo_alternate</span>
                        <span className="text-[10px] font-bold text-[#678183] mt-2 uppercase">Adicionar Foto</span>
                      </>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                     <div className="space-y-1">
                      <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Nome do Produto <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.nome && touched.nome ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                        placeholder="Ex: Cadeira de Escritório"
                      />
                      {errors.nome && touched.nome && <p className="text-red-500 text-xs font-bold mt-1">{errors.nome}</p>}
                    </div>
                     <div className="space-y-1">
                      <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Categoria <span className="text-red-500">*</span></label>
                       <select 
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.categoria && touched.categoria ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                       >
                         <option value="">Selecione...</option>
                         <option value="Eletrônicos">Eletrônicos</option>
                         <option value="Móveis">Móveis</option>
                         <option value="Acessórios">Acessórios</option>
                         <option value="Escritório">Escritório</option>
                         <option value="Moda">Moda</option>
                         <option value="Casa">Casa</option>
                         <option value="Outros">Outros</option>
                       </select>
                       {errors.categoria && touched.categoria && <p className="text-red-500 text-xs font-bold mt-1">{errors.categoria}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">SKU <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.sku && touched.sku ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                      placeholder="PROD-001"
                    />
                    {errors.sku && touched.sku && <p className="text-red-500 text-xs font-bold mt-1">{errors.sku}</p>}
                  </div>

                  <div className="space-y-1">
                     <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Fornecedor</label>
                     <input 
                      type="text" 
                      name="fornecedor"
                      value={formData.fornecedor}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                      placeholder="Nome do Fornecedor"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Preço Venda (R$) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      step="0.01"
                      className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.preco && touched.preco ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                      placeholder="0.00"
                    />
                    {errors.preco && touched.preco && <p className="text-red-500 text-xs font-bold mt-1">{errors.preco}</p>}
                  </div>
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Custo (R$)</label>
                    <input 
                      type="number" 
                      name="custo"
                      value={formData.custo}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border border-transparent focus:ring-primary/20 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-[#678183] uppercase tracking-wider">Estoque <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      name="estoque"
                      value={formData.estoque}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2.5 bg-[#f1f4f4] dark:bg-zinc-800 border ${errors.estoque && touched.estoque ? 'border-red-500 focus:ring-red-200' : 'border-transparent focus:ring-primary/20'} rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
                      placeholder="0"
                    />
                    {errors.estoque && touched.estoque && <p className="text-red-500 text-xs font-bold mt-1">{errors.estoque}</p>}
                  </div>
                </div>

                <div className="bg-[#f8fafa] dark:bg-zinc-800/50 p-4 rounded-xl border border-[#dde3e4] dark:border-zinc-700">
                     <div className="flex items-center gap-3">
                        <input 
                            type="checkbox" 
                            id="destaque" 
                            name="destaque"
                            checked={formData.destaque}
                            onChange={handleChange}
                            className="size-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div>
                            <label htmlFor="destaque" className="font-bold text-sm block">Produto em Destaque</label>
                            <p className="text-xs text-[#678183]">Este produto aparecerá no carrossel da loja pública.</p>
                        </div>
                     </div>
                </div>
                
                 <div className="pt-2 flex gap-3 border-t border-[#dde3e4] dark:border-zinc-800 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-[#f1f4f4] dark:bg-zinc-800 text-[#121617] dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors mt-4">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 mt-4">
                    {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;