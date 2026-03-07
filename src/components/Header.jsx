import React, { useMemo } from "react";

function Header({ children }) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Leader";
    if (hour < 17) return "Good Afternoon, Achiever";
    return "Good Evening, Champion";
  }, []);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/20 dark:bg-primary-900/10 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
      <div className="z-10">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-xl shadow-lg shadow-primary-500/20">T</span>
          TaskMaster <span className="text-primary-600">Pro</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {greeting}! Ready to crush your goals today?
        </p>
      </div>
      <div className="mt-4 sm:mt-0 z-10">
        {children}
      </div>
    </header>
  );
}

export default Header;
