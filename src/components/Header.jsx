import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserPlus } from "lucide-react";

function Header({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Leader";
    if (hour < 17) return "Good Afternoon, Achiever";
    return "Good Evening, Champion";
  }, []);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass p-8 rounded-[2.5rem] relative overflow-hidden group/header transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/5 mb-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/10 dark:bg-primary-900/5 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover/header:translate-x-24 transition-transform duration-1000"></div>

      <div className="z-10 relative">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter flex items-center gap-3">
          <div className="relative group/logo">
            <div className="absolute -inset-2 bg-primary-600/20 rounded-2xl blur-xl group-hover/logo:bg-primary-600/40 transition-colors duration-500"></div>
            <span className="relative bg-primary-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-2xl shadow-primary-500/40 transform group-hover/logo:-rotate-6 transition-transform duration-500">
              T
            </span>
          </div>
          <div className="flex flex-col -gap-1">
            <span className="leading-none">TaskMaster <span className="text-primary-600">Pro</span></span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black mt-1">Enterprise Edition</span>
          </div>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {greeting}! Ready to orchestrate your success?
        </p>
      </div>

      <div className="mt-6 sm:mt-0 z-10 flex items-center gap-4 relative">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Authenticated</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.name}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/auth");
              }}
              className="group flex items-center gap-2 px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-black rounded-2xl border border-rose-100 dark:border-rose-900/30 hover:bg-rose-600 hover:text-white transition-all duration-300 active:scale-95 shadow-lg shadow-rose-500/10"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Link
              to="/auth"
              state={{ mode: 'login' }}
              className="flex items-center gap-2 px-5 py-2.5 text-slate-600 dark:text-slate-400 font-black rounded-xl hover:text-primary-600 dark:hover:text-primary-400 transition-all text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/auth"
              state={{ mode: 'register' }}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-black rounded-xl shadow-xl shadow-primary-500/25 hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>
        )}
        {children}
      </div>
    </header>
  );
}

export default Header;
