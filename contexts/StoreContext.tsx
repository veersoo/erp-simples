import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Produto, LojaConfig } from '../types';

const initialProducts: Produto[] = [
  {
    id: 1,
    nome: "Cadeira Ergonômica",
    sku: "CH-001",
    categoria: "Móveis",
    estoque: 15,
    custo: 85.00,
    preco: 150.00,
    fornecedor: "Office Solutions",
    statusEstoque: "Normal",
    destaque: true,
    imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLU7-ruxRL4luSBlfDMzs2e6zGc76P4jEiGsvlXPKBePybs14bUSRXy02f1l-15bchgmdTxc4xZhBmtikOzEXsFFQL9xd-nS5p_Wn3Wpo5vZUr7dBG99enkSWPBZ1IWwnRyhP8ThSUGeVM034PYB0MKNoyHDX1UC8wQM6i3Axtu5WrxFjoATtk0MNMbHOtWsY2gw8WyZ8cGfgFQf2RMiMbHi5mek07Ijmq8sSiqpKpg_LVziuiC1xleRrmORhMGrWT0wj0cr2ZdSs"
  },
  {
    id: 2,
    nome: "Mouse Sem Fio",
    sku: "MS-442",
    categoria: "Eletrônicos",
    estoque: 4,
    custo: 12.00,
    preco: 25.00,
    fornecedor: "Tech Supply",
    statusEstoque: "Crítico",
    destaque: false,
    imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDp_ruufuDzCIUCY7AAUSFW3tgSaGQw1p5PgTENWSAgNTJQhnxm-Gs7D8iYITIeVRqVz7jkQ5acpt6Nf-yyvXerEMh9z7qMbj6dFbdqoW8g3nKg3Yd_AIE6qQ2WuvWp6LWRYkdsxf0nWjl3UnBspfHBZa7D2Fvbzo30lTuMoT-xVP3F5ahyhircYfq0inP0Pi_1hifjm5ct_X1qLqpApOtd1vgUSsozLLSncnYAe8UMUBcqnBknj5YvhwSSjXRY3Sr6HatJwy1lKV8"
  },
  {
    id: 3,
    nome: "Cabo USB-C (2m)",
    sku: "CB-110",
    categoria: "Eletrônicos",
    estoque: 120,
    custo: 2.50,
    preco: 9.00,
    fornecedor: "Tech Supply",
    statusEstoque: "Normal",
    destaque: false,
    imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi5JATkkDQ89IBIQOqWbnzlaqRFnMm0XOA6av6IqDf2GIRiOPPsQ67xXudHjnlTPUkXNftxWrnlVTW3V7_f3VQcb5tLFGm4l4WpOxuw-JEszccoL-R4hQMuxjkpSZVbLh6HlMsYKgu8K7FqZ52-f2wcM8YbkVlU6uC8tMaS9O0aumMhd8nFfgTYRaGim097Vh2prPctuZPhYKuk1panS2YLoVKV_5ku2B4mrJS885EC7M7XIu2AyK9K0HvkG7ZJJzsvfd8QsQI4SA"
  },
  {
    id: 4,
    nome: "Suporte Monitor",
    sku: "ST-552",
    categoria: "Escritório",
    estoque: 0,
    custo: 15.00,
    preco: 35.00,
    fornecedor: "Office Solutions",
    statusEstoque: "Esgotado",
    destaque: false,
    imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBirW9DN2hAREdxmLhuPkDpP5Gw0WP5BWza_j1nhBJ454xpern5G5uCAnQeak2tKxmZ6ktm_okiHkV5SH_69atp-jLKvxF2SVHy9b3x3_g1kJGGx0MxfYpVpzXTahwXbe7bQ0xPa2NI_y-P6_3ErZtOy5Xpu0g5Ty-7o1kcAQwhIzrpd5i-26x8eNdTW3Ui-WwkNEZ5nG144ps-d0feC2dh0_z8kBa7R2szcOG7YgWUuBQ01zWVicYi_BhYexKw6vU-lUe_I2vUYko"
  },
  { id: 101, nome: "Headphones Sem Fio", sku: "WH-102", categoria: "Eletrônicos", estoque: 12, custo: 80, preco: 159.99, fornecedor: "", statusEstoque: "Normal", destaque: true, imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSeLkCn8UIqDTLCka4ETojBHqrv4MJyJ6RgnPZEACcxT9ObDvBabMWK73w-9PceRXntg5WLGTBLbx3nWxFeNY3nFINAbgqxHCI9WLXajUssGn2NcWebZLT-WFgGhYRHP8bK40KysILZhrs9ocXRksQs_bVGTU3XKLKcUQarEOUeZ5EUOhDAkT_zY0TEu-5cNudRa66whVQkSMzzyRb3c2BXfkGDT37A_U1kHuJ2nklC-b4V8-aDacEV4LA2Xa45GgQe63Fb0MM-NI" },
  { id: 104, nome: "Tênis Esportivo", sku: "RS-400", categoria: "Moda", estoque: 18, custo: 60, preco: 120.00, fornecedor: "", statusEstoque: "Normal", destaque: true, imagemUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9XhwjY3M6L6N3k0Z5PytLGOJEpZ0qWICrpHo4TmFWWQvT4rCRLDkZPmgx2oyjuoFvjj6CmZYYwEjGlNJJArjI9MCoFtkJg8CgAt-9mTn7vRWTSH1OUnWCv3Kpp_tJztC3r6iTIqFteKbPQLbkp9BKWADmgZmIg5gX8PG0ykyPG8oxVtgm6ZY_uozP5QpDDhcYmT5oOSP7EczstutmvRBsnWt2v4s56M2P_XNt3GSemfjdZ7duWNa3ii_-rC7YkMZqgp-AX7vXZMg" },
];

interface StoreContextType {
  products: Produto[];
  setProducts: React.Dispatch<React.SetStateAction<Produto[]>>;
  storeConfig: LojaConfig;
  setStoreConfig: React.Dispatch<React.SetStateAction<LojaConfig>>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Produto[]>(initialProducts);
  const [storeConfig, setStoreConfig] = useState<LojaConfig>({
    nomeLoja: "Minha Loja Online",
    whatsapp: "5511999999999",
    mensagemBoasVindas: "Olá! Gostaria de fazer um pedido dos seguintes itens:",
    bannerUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070",
    corPrincipal: "#1f737a",
    ativo: true
  });

  return (
    <StoreContext.Provider value={{ products, setProducts, storeConfig, setStoreConfig }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};