import React from 'react';
import { 
  Shirt, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  Sheet, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenNewSale, 
  onOpenSettings,
  isSheetConnected,
  settings
}) => {
  return (
    <>
      {/* Top Mobile App Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm px-4 py-2.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black shadow-sm">
              <Shirt className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block leading-tight">
                {settings.storeName || 'T-Shirt Studio'}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-wider">
                ₹ INR ONLY
              </span>
            </div>
          </div>

          {/* Quick Actions & Sheet Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                isSheetConnected
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                  : 'bg-amber-950/50 text-amber-300 border-amber-600/40'
              }`}
            >
              <Sheet className="w-3 h-3" />
              <span>{isSheetConnected ? 'Sheet' : 'Offline'}</span>
              {isSheetConnected ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          
          {/* Stats / P&L */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center py-1 transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">P&L Stats</span>
          </button>

          {/* Stock / Products */}
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex flex-col items-center py-1 transition-colors cursor-pointer ${
              activeTab === 'products' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Shirt className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Stock</span>
          </button>

          {/* Center Quick Sell Button */}
          <div className="flex-1 flex justify-center -mt-5">
            <button
              onClick={onOpenNewSale}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform cursor-pointer border-2 border-white"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
              <span className="text-[9px] font-black uppercase tracking-tight -mt-0.5">Sell</span>
            </button>
          </div>

          {/* Sales / Orders */}
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex-1 flex flex-col items-center py-1 transition-colors cursor-pointer ${
              activeTab === 'sales' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Orders</span>
          </button>

          {/* Customers */}
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 flex flex-col items-center py-1 transition-colors cursor-pointer ${
              activeTab === 'customers' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Clients</span>
          </button>

        </div>
      </nav>
    </>
  );
};
