import React from "react";
import { HeartIcon, GithubIcon, TwitterIcon, LinkedinIcon } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 pb-12 border-t border-slate-200 dark:border-slate-800 pt-12 bg-white/30 dark:bg-slate-950/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand & Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary-600 dark:text-primary-400 mb-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="text-xl font-bold tracking-tight">TaskMaster Pro</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm italic">
              "The best way to predict the future is to create it."
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/DestaShewa/Task-Manager"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
              title="GitHub"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href="#"
              className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary-400 hover:text-white transition-all shadow-sm"
            >
              <TwitterIcon size={20} />
            </a>
            <a
              href="#"
              className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary-700 hover:text-white transition-all shadow-sm"
            >
              <LinkedinIcon size={20} />
            </a>
          </div>

          {/* Credits */}
          <div className="text-center md:text-right space-y-1">
            <div className="flex items-center justify-center md:justify-end gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400">
              <span>Made by</span>
              <HeartIcon size={16} className="text-rose-500 fill-rose-500 animate-pulse" />
              <span>Desta</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
