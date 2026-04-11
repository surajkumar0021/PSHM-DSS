import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  History, 
  Info, 
  Menu, 
  X,
  ShieldAlert,
  Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Chatbot from './Chatbot';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Text Analysis', path: '/text', icon: FileText },
  { name: 'Image Analysis', path: '/image', icon: ImageIcon },
  { name: 'Link Analysis', path: '/link', icon: LinkIcon },
  { name: 'Reports', path: '/reports', icon: History },
  { name: 'About Developer', path: '/about', icon: Info },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gov-bg">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gov-navy text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gov-blue/20 flex items-center justify-center border border-white/10">
              <ShieldAlert className="w-6 h-6 text-gov-blue" />
            </div>
            {isSidebarOpen && (
              <span className="font-serif font-bold text-xl tracking-tight text-white">PSHM-DSS</span>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "nav-item-active" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-all duration-300", isActive ? "text-gov-blue scale-110" : "text-white/40 group-hover:text-white group-hover:scale-110")} />
                  {isSidebarOpen && <span className="text-sm font-medium tracking-wide">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gov-border flex items-center justify-between px-10 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-gov-navy uppercase tracking-[0.2em] font-serif">
              {navItems.find(i => i.path === location.pathname)?.name || 'System'}
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              <span className="w-2 h-2 bg-gov-success rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              System Online
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2.5 text-gov-text-muted hover:text-gov-navy hover:bg-gov-bg rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-gov-danger rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-4 pl-8 border-l border-gov-border">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gov-navy tracking-tight">Suraj Kumar</p>
                  <p className="text-[10px] text-gov-text-muted font-bold uppercase tracking-widest mt-0.5">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gov-navy flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-gov-navy/20 border border-white/10">
                  SK
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}
