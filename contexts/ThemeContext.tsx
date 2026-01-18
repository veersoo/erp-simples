import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeConfig } from '../types';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  toggleMode: () => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeConfig = {
  companyName: 'BusinessPro',
  logoUrl: null,
  primaryColor: '#1f737a',
  secondaryColor: '#004c8a',
  radius: 'md',
  mode: 'light'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('nexus_theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  // Função para escurecer cor (simples) para gerar o hover/dark variant
  const darkenColor = (color: string, percent: number) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(String(R * (100 - percent) / 100));
    G = parseInt(String(G * (100 - percent) / 100));
    B = parseInt(String(B * (100 - percent) / 100));

    R = (R < 255) ? R : 255;  
    G = (G < 255) ? G : 255;  
    B = (B < 255) ? B : 255;  

    const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  }

  // Efeito para aplicar as variáveis CSS e classes no HTML
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar Cores
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-primary-dark', darkenColor(theme.primaryColor, 15));
    root.style.setProperty('--color-secondary', theme.secondaryColor);

    // Aplicar Radius
    const radiusMap = {
      'none': '0px',
      'sm': '0.375rem', // 6px
      'md': '0.75rem',  // 12px (default)
      'lg': '1.5rem',   // 24px
      'full': '9999px'
    };
    root.style.setProperty('--radius', radiusMap[theme.radius]);

    // Aplicar Dark Mode
    if (theme.mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    localStorage.setItem('nexus_theme', JSON.stringify(theme));
  }, [theme]);

  const toggleMode = () => {
    setTheme(prev => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
