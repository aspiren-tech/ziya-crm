import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { Globe, X, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside
        className={`w-72 bg-sidebar text-slate-300 flex flex-col fixed inset-y-0 left-0 z-40 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:translate-x-0 lg:static lg:z-auto border-r border-slate-800 shadow-2xl shadow-purple-900/20 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-24 flex items-center justify-between px-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight leading-none mb-1">ZIYA <span className="text-cyan-400">CRM</span></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Intelligence First</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 overflow-y-auto scrollbar-hide">
          <div className="space-y-6">
            <div>
              <p className="px-3 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Platform</p>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${isActive
                          ? 'bg-purple-600/10 text-white shadow-sm border-l-4 border-cyan-400'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40 border-l-4 border-transparent'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <link.icon className={`w-[20px] h-[20px] mr-3 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'
                            }`} />
                          <span className="flex-1">{link.name}</span>
                          {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center gap-3 mb-4 p-3 bg-indigo-600/5 rounded-xl border border-indigo-500/10">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Trial Account</p>
              <p className="text-[10px] text-slate-500">14 days remaining</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 font-medium tracking-wide">&copy; 2025 ZIYA CRM INC. ALL RIGHTS RESERVED.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;