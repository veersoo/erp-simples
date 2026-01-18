import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import NewSale from './pages/NewSale';
import Orders from './pages/Orders';
import CashFlow from './pages/CashFlow';
import Suppliers from './pages/Suppliers';
import HR from './pages/HR';
import StoreSettings from './pages/StoreSettings';
import StoreFront from './pages/StoreFront';
import Login from './pages/Login';
import Users from './pages/Users';
import SystemSettings from './pages/SystemSettings';
import { StoreProvider } from './contexts/StoreContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Componente para proteger rotas privadas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
         <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isStoreFront = location.pathname.startsWith('/loja-publica');
  const isLoginPage = location.pathname === '/login';

  // Rota pública: Loja
  if (isStoreFront) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] font-display w-full">
        {children}
      </div>
    );
  }

  // Rota pública: Login
  if (isLoginPage) {
    return <div className="font-display w-full h-screen">{children}</div>;
  }

  // Layout Administrativo (Sidebar + Conteúdo)
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-[#121617] dark:text-gray-100 font-display transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/loja-publica" element={<StoreFront />} />

        {/* Rotas Protegidas */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><Customers /></PrivateRoute>} />
        <Route path="/estoque" element={<PrivateRoute><Inventory /></PrivateRoute>} />
        <Route path="/vendas" element={<PrivateRoute><NewSale /></PrivateRoute>} />
        <Route path="/pedidos" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/financeiro" element={<PrivateRoute><CashFlow /></PrivateRoute>} />
        <Route path="/fornecedores" element={<PrivateRoute><Suppliers /></PrivateRoute>} />
        <Route path="/rh" element={<PrivateRoute><HR /></PrivateRoute>} />
        <Route path="/loja-config" element={<PrivateRoute><StoreSettings /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><Users /></PrivateRoute>} />
        <Route path="/configuracoes" element={<PrivateRoute><SystemSettings /></PrivateRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <Router>
            <AppRoutes />
          </Router>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
