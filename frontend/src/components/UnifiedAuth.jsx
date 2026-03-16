import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, UserCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const UnifiedAuth = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const loginRef = useRef(null);
    const registerRef = useRef(null);
    const [mode, setMode] = useState('login'); // 'login' or 'register'

    useEffect(() => {
        if (location.state?.mode) {
            setMode(location.state.mode);
            const targetRef = location.state.mode === 'login' ? loginRef : registerRef;
            if (targetRef.current) {
                targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [location.state]);

    if (user) {
        return (
            <div className="relative min-h-[90vh] flex items-center justify-center px-4">
                <div className="bg-mesh-gradient">
                    <div className="mesh-ball mesh-ball-1 opacity-20"></div>
                    <div className="mesh-ball mesh-ball-2 opacity-20"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-premium w-full max-w-2xl text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 mb-8 rotate-3 hover:rotate-6 transition-transform duration-500">
                            <UserCheck className="w-10 h-10" />
                        </div>

                        <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tighter">
                            Welcome Back, <span className="text-primary-600">{user.name}</span>
                        </h2>

                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
                            Your workspace is ready. Would you like to manage your tasks or sign out of this session?
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-3xl transition-all shadow-2xl shadow-primary-500/30 active:scale-[0.97] flex items-center justify-center gap-3 group"
                            >
                                <Home className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
                                Go to Dashboard
                            </button>
                            <button
                                onClick={logout}
                                className="px-8 py-5 bg-white dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-100 dark:hover:border-rose-900/30 font-bold rounded-3xl transition-all active:scale-[0.97] flex items-center justify-center gap-3"
                            >
                                <LogOut className="w-6 h-6" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-[90vh] py-16 px-4">
            <div className="bg-mesh-gradient">
                <div className="mesh-ball mesh-ball-1 opacity-10"></div>
                <div className="mesh-ball mesh-ball-2 opacity-10"></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-800 dark:text-white tracking-tighter mb-6">
                        The Future of <span className="text-primary-600">Productivity</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        TaskMaster Pro empowers leaders with advanced task orchestration and real-time collaboration.
                    </p>
                </div>

                <div className="flex flex-col xl:flex-row items-stretch justify-center gap-10">
                    <motion.div
                        ref={loginRef}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1"
                    >
                        <div className={`h-full card-premium p-1 !rounded-[3rem] transition-all duration-700 ${mode === 'login' ? 'ring-2 ring-primary-500 shadow-2xl shadow-primary-500/20' : 'opacity-80'}`}>
                            <div className="p-2 h-full">
                                <Login />
                            </div>
                        </div>
                    </motion.div>

                    <div className="hidden xl:flex items-center">
                        <div className="h-64 w-px bg-slate-200 dark:bg-slate-800"></div>
                    </div>

                    <motion.div
                        ref={registerRef}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex-1"
                    >
                        <div className={`h-full card-premium p-1 !rounded-[3rem] transition-all duration-700 ${mode === 'register' ? 'ring-2 ring-emerald-500 shadow-2xl shadow-emerald-500/20' : 'opacity-80'}`}>
                            <div className="p-2 h-full">
                                <Register />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedAuth;
