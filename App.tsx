
import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import CaptainForm from './pages/CaptainForm';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

const App = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();
    
    const handleLogin = () => setIsAdmin(true);
    const handleLogout = () => setIsAdmin(false);

    const isLoginPage = location.pathname === '/login';

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
             {!isLoginPage && (
                <header className="bg-white dark:bg-gray-800 shadow-md">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">DVOC Roster Collector</Link>
                             <div className="flex items-center gap-4">
                                <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500">Captain Form</Link>
                                {isAdmin ? (
                                    <>
                                        <Link to="/admin" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500">Admin Panel</Link>
                                        <Link to="/" onClick={handleLogout} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500">Logout</Link>
                                    </>
                                ) : (
                                    <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500">Admin Login</Link>
                                )}
                             </div>
                        </div>
                    </nav>
                </header>
            )}

            <main className={isLoginPage ? '' : 'py-10'}>
                <style>{`
                  .input-field, .select-field {
                    @apply block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white text-sm;
                  }
                `}</style>
                <Routes>
                    <Route path="/" element={<CaptainForm />} />
                    <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />
                    <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/login" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
