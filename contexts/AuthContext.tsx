import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dados Mockados para Login
const MOCK_USER: Usuario = {
  id: 1,
  nome: "Admin User",
  email: "admin@nexus.com",
  funcao: "Administrador",
  status: "Ativo",
  avatarUrl: "https://ui-avatars.com/api/?name=Admin+User&background=1f737a&color=fff",
  ultimoAcesso: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de sessão ao carregar
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Login Hardcoded para demonstração
    // Email: admin@nexus.com / Senha: 123
    if (email === 'admin@nexus.com' && pass === '123') {
      const userData = { ...MOCK_USER, ultimoAcesso: new Date().toISOString() };
      setUser(userData);
      localStorage.setItem('nexus_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
