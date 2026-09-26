import React from 'react';
import { 
  Shirt, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  PlusCircle, 
  Sheet, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenNewSale, 
  onOpenSettings,
  isSheetConnected,
  currency,
  setCurrency,
  onSyncNow,
  isSyncing,
  settings
}) => {
  const currencies = ['$', '₹', '€', '£', 'AED'];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & P&L', icon: BarChart3 },
    { id: 'products', label: 'Products & Stock', icon: Shirt },
    { id: 'sales', label: 'Sales & Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers & Mail', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {settings.storeName || 'ThreadFlow'}
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  T-Shirt Hub
                </span>
              </div>
              <p className="text-xs text-slate-400">Inventory, Sales & Google Sheet DB</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Integration Status */}
          <div className="flex items-center gap-2.5">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-200 px-2 py-1 outline-none cursor-pointer"
                title="Select Currency"
              >
                {currencies.map((c) => (
                  <option key={c} value={c} className="bg-slate-800 text-white">
                    {c} Currency
                  </option>
                ))}
              </select>
            </div>

            {/* Google Sheets Status Pill */}
            <button
              onClick={onOpenSettings}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                isSheetConnected
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 text-amber-300 border-amber-600/40 hover:bg-amber-900/40'
              }`}
              title="Click to configure Google Sheet database connection"
            >
              <Sheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isSheetConnected ? 'Google Sheet Live' : 'Offline Mode'}</span>
              {isSheetConnected ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-amber-400" />
              )}
            </button>

            {/* Sync Now Button */}
            {isSheetConnected && (
              <button
                onClick={onSyncNow}
                disabled={isSyncing}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                title="Sync with Google Sheet now"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Google Sheet Integration & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Prominent New Sale Button */}
            <button
              onClick={onOpenNewSale}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Sale</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
