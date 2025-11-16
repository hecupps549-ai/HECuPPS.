
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { UserPages } from './pages/UserPages';
import { AdminPages } from './pages/AdminPages';

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { admin } = useAppContext();
  return admin ? children : <Navigate to="/admin/login" />;
};

const AppCore: React.FC = () => {
    const { theme } = useAppContext();
    React.useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);
    
    return (
        <HashRouter>
            <Routes>
                <Route path="/admin/*" element={<AdminPages />} />
                <Route path="/*" element={<UserPages />} />
            </Routes>
        </HashRouter>
    );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppCore />
    </AppProvider>
  );
};

export default App;
