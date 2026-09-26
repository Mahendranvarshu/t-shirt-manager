import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  AlertTriangle,
  Shirt, 
  ArrowUpRight
} from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';

export const DashboardTab = ({ 
  analytics, 
  currency = '₹', 
  onNavigateToStock,
  onOpenNewSale
}) => {
  const [activeView, setActiveView] = useState('daily'); // 'daily' | 'monthly' | 'yearly'
  const { overview, dailyTimeline, monthlyData, yearlyData, sizeDistribution, topProducts } = analytics;

  // Format currency in Indian format
  const fmt = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

  const totalSizeUnits = Object.values(sizeDistribution).reduce((a, b) => a + b, 0) || 1;
  const maxDailyProfit = Math.max(...dailyTimeline.map(d => Math.max(d.profit, d.revenue)), 100);

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      
      {/* 4 Quick Mobile KPI Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Today Profit */}
        <div className="bg-emerald-600 text-white rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-semibold opacity-90 mb-1">
            <span>Today Profit</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black tracking-tight">
            {fmt(overview.todayProfit)}
          </div>
          <div className="text-[10px] opacity-80 mt-1 flex justify-between">
            <span>Sale: {fmt(overview.todayRevenue)}</span>
            <span>{overview.todayUnits} pcs</span>
          </div>
        </div>

        {/* Total Net Profit */}
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>Total Profit</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
              {overview.profitMargin.toFixed(0)}%
            </span>
          </div>
          <div className="text-xl font-black text-emerald-400 tracking-tight">
            {fmt(overview.totalProfit)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Cost: {fmt(overview.totalCost)}
          </div>
        </div>

        {/* Total Sales / Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 mb-1">Total Sales</div>
          <div className="text-lg font-black text-slate-900">
            {fmt(overview.totalRevenue)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-semibold">
            {overview.totalUnits} T-Shirts Sold
          </div>
        </div>

        {/* Stock in Hand */}
        <div 
          onClick={onNavigateToStock}
          className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span>Stock in Hand</span>
            <Package className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-indigo-600">
            {overview.totalStockCount} <span className="text-xs text-slate-500 font-normal">pcs</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Value: {fmt(overview.inventoryRetailValue)}
          </div>
        </div>

      </div>

      {/* Low Stock Warning Badge (if any) */}
      {overview.lowStockAlerts > 0 && (
        <div 
          onClick={onNavigateToStock}
          className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-center justify-between text-amber-900 active:scale-98 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold">
              {overview.lowStockAlerts} sizes low on stock (&le; 5 pcs)
            </span>
          </div>
          <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
            Restock &rarr;
          </span>
        </div>
      )}

      {/* P&L View Switcher: Day / Month / Year */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
            Profit & Loss
          </span>

          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveView('daily')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeView === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setActiveView('monthly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeView === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setActiveView('yearly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeView === 'yearly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Day-to-Day View */}
        {activeView === 'daily' && (
          <div className="space-y-3 pt-1">
            {/* Visual Bars */}
            <div className="h-28 flex items-end justify-between gap-1 border-b border-slate-100 pb-1">
              {dailyTimeline.slice(-7).map((d) => {
                const height = maxDailyProfit > 0 ? (d.profit / maxDailyProfit) * 100 : 0;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-bold text-slate-500">
                      {d.profit > 0 ? fmt(d.profit).replace('₹', '') : '0'}
                    </div>
                    <div 
                      style={{ height: `${Math.max(height, 6)}%` }} 
                      className={`w-full max-w-[24px] rounded-t-md transition-all ${
                        d.profit > 0 ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                    <span className="text-[9px] font-bold text-slate-400">
                      {d.label.split(' ')[1]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Compact Daily Rows */}
            <div className="divide-y divide-slate-100">
              {dailyTimeline.slice(-5).reverse().map((d) => (
                <div key={d.date} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{d.label}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">{d.orders} orders</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-600 block">+{fmt(d.profit)}</span>
                    <span className="text-[10px] text-slate-400">Sale: {fmt(d.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly View */}
        {activeView === 'monthly' && (
          <div className="space-y-2 pt-1">
            {monthlyData.map((m) => (
              <div key={m.key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 block">{m.label}</span>
                  <span className="text-[10px] text-slate-500">{m.units} pcs sold</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-600 block">+{fmt(m.profit)}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Sale: {fmt(m.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Yearly View */}
        {activeView === 'yearly' && (
          <div className="space-y-2 pt-1">
            {yearlyData.map((y) => (
              <div key={y.year} className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400">Year</span>
                  <h4 className="text-lg font-black text-white m-0">{y.year}</h4>
                  <span className="text-[10px] text-slate-400">{y.units} shirts</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Annual Profit</span>
                  <span className="text-base font-black text-emerald-400">+{fmt(y.profit)}</span>
                  <span className="text-[10px] text-slate-400 block">Sales: {fmt(y.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* T-Shirt Size Demand Breakdown (XS - 3XL) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
            <Shirt className="w-3.5 h-3.5 text-indigo-600" />
            <span>Size Sales %</span>
          </span>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
            {totalSizeUnits} sold
          </span>
        </div>

        {/* 7 Size Badges */}
        <div className="grid grid-cols-7 gap-1">
          {TSHIRT_SIZES.map((size) => {
            const count = sizeDistribution[size] || 0;
            const pct = Math.round((count / totalSizeUnits) * 100);
            const isTop = size === 'M' || size === 'L';

            return (
              <div 
                key={size}
                className={`py-2 rounded-xl text-center border ${
                  isTop ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="text-xs font-black text-slate-800">{size}</div>
                <div className="text-[11px] font-extrabold text-indigo-600 mt-0.5">{count}</div>
                <div className="text-[9px] text-slate-400">{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 3 Selling T-Shirts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
        <span className="text-xs font-black uppercase text-slate-700 tracking-wider block">
          Best Sellers
        </span>

        <div className="space-y-2">
          {topProducts.slice(0, 3).map((prod, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200" 
                />
                <div>
                  <h5 className="font-bold text-xs text-slate-900 line-clamp-1 m-0">{prod.name}</h5>
                  <span className="text-[10px] text-slate-500 font-semibold">{prod.unitsSold} sold</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-xs text-emerald-600 block">+{fmt(prod.profit)}</span>
                <span className="text-[9px] text-slate-400">{fmt(prod.revenue)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
