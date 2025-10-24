import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import CaptainForm from './pages/CaptainForm';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

const App = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const isLoginPage = location.pathname === '/login';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-300">Loading application...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
             {!isLoginPage && (
                <header className="bg-white dark:bg-gray-800 shadow-md">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">DVOC Roster Collector</Link>
                             <div className="flex items-center gap-4">
                                <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500">Captain Form</Link>
                                {session ? (
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
                <Routes>
                    <Route path="/" element={<CaptainForm />} />
                    <Route path="/login" element={!session ? <AdminLogin /> : <Navigate to="/admin" replace />} />
                    <Route path="/admin" element={session ? <AdminPanel /> : <Navigate to="/login" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;