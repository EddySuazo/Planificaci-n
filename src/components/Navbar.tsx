import React, { useState } from 'react';
import { School, Search, PlusCircle, BookOpen, CheckSquare, BarChart3, Settings, LogOut, User, Sparkles, ChevronDown, Bot } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onSwitchUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
  onToggleAiDrawer: () => void;
  isAiDrawerOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onLogout,
  onSwitchUser,
  allUsers,
  onToggleAiDrawer,
  isAiDrawerOpen
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case 'administrador':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full">Administrador</span>;
      case 'director':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full">Director</span>;
      case 'coordinador':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold px-2 py-0.5 rounded-full">Coordinador</span>;
      default:
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold px-2 py-0.5 rounded-full">Docente</span>;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Dominican Flag institutional ribbon */}
      <div className="h-1 flex w-full">
        <div className="flex-1 bg-[#002B49]"></div>
        <div className="w-12 bg-white"></div>
        <div className="flex-1 bg-[#CE1126]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-[#002B49] flex items-center justify-center text-white shadow-md border border-white/20">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-[#002B49]">PlanificaRD</span>
                <span className="text-[10px] font-bold bg-[#CE1126] text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                  MINERD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-tight truncate max-w-sm">
                Planifica mejor, enseña con propósito y transforma los aprendizajes
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 rounded-lg transition ${
                currentTab === 'dashboard'
                  ? 'bg-blue-50 text-[#002B49] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Panel Principal
            </button>

            <button
              onClick={() => onSelectTab('search')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition ${
                currentTab === 'search'
                  ? 'bg-blue-50 text-[#002B49] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Buscador Curricular</span>
            </button>

            <button
              onClick={() => onSelectTab('wizard')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition ${
                currentTab === 'wizard'
                  ? 'bg-[#002B49] text-white shadow-xs font-semibold'
                  : 'text-[#002B49] font-semibold hover:bg-blue-50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nueva Planificación</span>
            </button>

            <button
              onClick={() => onSelectTab('library')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition ${
                currentTab === 'library'
                  ? 'bg-blue-50 text-[#002B49] font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Biblioteca MINERD</span>
            </button>

            {/* Coordination / Review tab (accessible to all or coordinators) */}
            <button
              onClick={() => onSelectTab('coordination')}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition ${
                currentTab === 'coordination'
                  ? 'bg-purple-50 text-purple-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-purple-600" />
              <span>Coordinación</span>
            </button>

            {/* Director Management tab */}
            {(currentUser.rol === 'director' || currentUser.rol === 'administrador') && (
              <button
                onClick={() => onSelectTab('director')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition ${
                  currentTab === 'director'
                    ? 'bg-emerald-50 text-emerald-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>Gestión Escolar</span>
              </button>
            )}

            {/* Admin tab (Eddy Margeris Suazo & Jose Milquiades Peña Ogando) */}
            {(currentUser.rol === 'administrador' || currentUser.rol === 'director') && (
              <button
                onClick={() => onSelectTab('admin')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition ${
                  currentTab === 'admin'
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-amber-600" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Right Actions: AI Assistant Drawer Toggle & User Switcher */}
          <div className="flex items-center space-x-2.5">
            {/* AI Assistant Button */}
            <button
              onClick={onToggleAiDrawer}
              className={`relative flex items-center space-x-1.5 py-1.5 px-3 rounded-xl border text-xs font-semibold transition ${
                isAiDrawerOpen
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Asistente Pedagógico IA MINERD (Gemini 3.8 Flash)"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">IA Pedagógica</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* User Profile & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 py-1.5 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition text-left"
              >
                <div className="w-7 h-7 rounded-full bg-[#002B49] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.nombre.charAt(0)}{currentUser.apellidos.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {currentUser.nombre}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-none capitalize">
                    {currentUser.rol}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.nombre} {currentUser.apellidos}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{currentUser.cedula}</p>
                    <div className="mt-1 flex items-center justify-between">
                      {getRoleBadge(currentUser.rol)}
                      <span className="text-[10px] text-slate-500">{currentUser.centroEducativoNombre}</span>
                    </div>
                  </div>

                  {/* Quick Role Switcher (Simulate other users) */}
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Cambiar de Rol / Usuario para Probar:
                    </span>
                    <div className="space-y-1">
                      {allUsers.slice(0, 4).map(u => (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                            u.id === currentUser.id ? 'bg-blue-50 text-[#002B49] font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="truncate">{u.nombre} {u.apellidos}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">{u.rol}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-2 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 font-semibold transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-2 overflow-x-auto text-xs">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 rounded ${currentTab === 'dashboard' ? 'font-bold text-[#002B49]' : 'text-slate-600'}`}
        >
          Inicio
        </button>
        <button
          onClick={() => onSelectTab('search')}
          className={`px-2 py-1 rounded ${currentTab === 'search' ? 'font-bold text-[#002B49]' : 'text-slate-600'}`}
        >
          Buscador
        </button>
        <button
          onClick={() => onSelectTab('wizard')}
          className={`px-2 py-1 rounded font-bold text-white bg-[#002B49]`}
        >
          + Planificar
        </button>
        <button
          onClick={() => onSelectTab('library')}
          className={`px-2 py-1 rounded ${currentTab === 'library' ? 'font-bold text-[#002B49]' : 'text-slate-600'}`}
        >
          Biblioteca
        </button>
        <button
          onClick={() => onSelectTab('coordination')}
          className={`px-2 py-1 rounded ${currentTab === 'coordination' ? 'font-bold text-purple-900' : 'text-slate-600'}`}
        >
          Revisión
        </button>
        {(currentUser.rol === 'director' || currentUser.rol === 'administrador') && (
          <>
            <button
              onClick={() => onSelectTab('director')}
              className={`px-2 py-1 rounded ${currentTab === 'director' ? 'font-bold text-emerald-900' : 'text-slate-600'}`}
            >
              Gestión
            </button>
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-2 py-1 rounded ${currentTab === 'admin' ? 'font-bold text-amber-900' : 'text-slate-600'}`}
            >
              Admin
            </button>
          </>
        )}
      </div>
    </header>
  );
};
