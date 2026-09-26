import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Percent, 
  Shirt, 
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';

export const DashboardTab = ({ 
  analytics, 
  products, 
  sales, 
  currency, 
  onSelectProduct, 
  onOpenNewSale,
  onNavigateToStock
}) => {
  const [activeView, setActiveView] = useState('daily'); // 'daily' | 'monthly' | 'yearly'
  const { overview, dailyTimeline, monthlyData, yearlyData, sizeDistribution, topProducts } = analytics;

  // Format currency helper
  const fmt = (val) => `${currency}${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Find total units in size distribution for percentages
  const totalSizeUnits = Object.values(sizeDistribution).reduce((a, b) => a + b, 0) || 1;

  // Find max revenue in timeline for visual scaling
  const maxDailyRevenue = Math.max(...dailyTimeline.map(d => Math.max(d.revenue, d.cost, d.profit)), 50);
  const maxMonthlyRevenue = Math.max(...monthlyData.map(m => Math.max(m.revenue, m.cost, m.profit)), 100);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome & Quick Action */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time T-Shirt Business P&L Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0">
              Performance & Profit Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Track day-to-day sales, monthly & yearly profit/loss, inventory valuations, and size distribution—all backed by Google Sheets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewSale}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Record New Sale</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's Profit (Day-to-day highlight) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Today's Net Profit</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {fmt(overview.todayProfit)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-slate-500">Revenue: <strong className="text-slate-800">{fmt(overview.todayRevenue)}</strong></span>
            <span className="text-slate-500">Sold: <strong className="text-slate-800">{overview.todayUnits} pcs</strong></span>
          </div>
        </div>

        {/* All-Time Net Profit */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Total Net Profit</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {fmt(overview.totalProfit)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-slate-500">Profit Margin:</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {overview.profitMargin.toFixed(1)}% Margin
            </span>
          </div>
        </div>

        {/* Total Revenue & COGS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Total Revenue</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {fmt(overview.totalRevenue)}
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-slate-500">Total Product Cost:</span>
            <span className="font-semibold text-rose-600">
              {fmt(overview.totalCost)}
            </span>
          </div>
        </div>

        {/* Inventory Stock Valuation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">
            <span>Live Stock Valuation</span>
            <span className="p-1.5 bg-violet-50 text-violet-600 rounded-lg">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {overview.totalStockCount} <span className="text-sm font-normal text-slate-500">shirts in stock</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
            <span className="text-slate-500">Retail Value:</span>
            <span className="font-semibold text-indigo-600">
              {fmt(overview.inventoryRetailValue)}
            </span>
          </div>
        </div>

      </div>

      {/* Low Stock Alerts Notification (if any) */}
      {overview.lowStockAlerts > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                Attention: {overview.lowStockAlerts} T-shirt sizes are running low on stock!
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Some sizes have fallen to 5 units or below. Check inventory to avoid stockouts.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToStock}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            Review & Restock
          </button>
        </div>
      )}

      {/* Main Section: Day-to-Day / Monthly / Yearly Loss & Profit Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 m-0">
              Profit & Loss (P&L) Analytics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare Day-to-Day trends, Monthly performance, and Yearly financial summaries
            </p>
          </div>

          {/* Time View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveView('daily')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'daily'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day-to-Day (14 Days)
            </button>
            <button
              onClick={() => setActiveView('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly P&L
            </button>
            <button
              onClick={() => setActiveView('yearly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'yearly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly P&L
            </button>
          </div>
        </div>

        {/* View 1: Day-to-Day Visual Chart & Table */}
        {activeView === 'daily' && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Daily Trajectory (Revenue vs Net Profit)</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span> Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Net Profit</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-400 inline-block"></span> Product Cost</span>
              </div>
            </div>

            {/* Custom Responsive Bar Chart for Daily P&L */}
            <div className="h-56 flex items-end justify-between gap-1.5 sm:gap-3 pt-6 border-b border-slate-100 pb-2 overflow-x-auto">
              {dailyTimeline.map((item) => {
                const revHeight = maxDailyRevenue > 0 ? (item.revenue / maxDailyRevenue) * 100 : 0;
                const profitHeight = maxDailyRevenue > 0 ? (item.profit / maxDailyRevenue) * 100 : 0;
                const costHeight = maxDailyRevenue > 0 ? (item.cost / maxDailyRevenue) * 100 : 0;

                return (
                  <div key={item.date} className="flex-1 min-w-[36px] flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-20 bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                      <p className="font-bold text-slate-200">{item.label}</p>
                      <p className="text-emerald-400">Profit: {fmt(item.profit)}</p>
                      <p className="text-indigo-300">Revenue: {fmt(item.revenue)}</p>
                      <p className="text-rose-300">Cost: {fmt(item.cost)}</p>
                      <p className="text-slate-400">Orders: {item.orders}</p>
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5 h-44">
                      {/* Revenue Bar */}
                      <div 
                        style={{ height: `${Math.max(revHeight, 4)}%` }} 
                        className={`w-2.5 sm:w-3.5 rounded-t transition-all ${item.revenue > 0 ? 'bg-indigo-500 group-hover:bg-indigo-600' : 'bg-slate-100'}`} 
                      />
                      {/* Profit Bar */}
                      <div 
                        style={{ height: `${Math.max(profitHeight, item.profit > 0 ? 4 : 0)}%` }} 
                        className={`w-2.5 sm:w-3.5 rounded-t transition-all ${item.profit > 0 ? 'bg-emerald-500 group-hover:bg-emerald-600' : 'bg-slate-100'}`} 
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 truncate w-full text-center">
                      {item.label.split(' ')[1] || item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Daily Table Summary */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Orders</th>
                    <th className="py-2.5 px-3 text-right">Revenue</th>
                    <th className="py-2.5 px-3 text-right">Cost (COGS)</th>
                    <th className="py-2.5 px-3 text-right">Net Profit</th>
                    <th className="py-2.5 px-3 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyTimeline.slice(-7).reverse().map((d) => {
                    const margin = d.revenue > 0 ? (d.profit / d.revenue) * 100 : 0;
                    return (
                      <tr key={d.date} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-medium text-slate-900">{d.label}</td>
                        <td className="py-2.5 px-3">{d.orders} orders</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{fmt(d.revenue)}</td>
                        <td className="py-2.5 px-3 text-right text-rose-600">{fmt(d.cost)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{fmt(d.profit)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${margin >= 50 ? 'bg-emerald-50 text-emerald-700' : margin > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {margin.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 2: Monthly Profit & Loss Statement */}
        {activeView === 'monthly' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monthlyData.slice(-3).map((m) => (
                <div key={m.key} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 text-sm">{m.label}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                      {m.units} shirts sold
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gross Sales:</span>
                      <span className="font-semibold text-slate-900">{fmt(m.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Production Cost:</span>
                      <span className="text-rose-600 font-medium">-{fmt(m.cost)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
                      <span className="text-slate-800">Net Profit:</span>
                      <span className="text-emerald-600">{fmt(m.profit)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                      <span>Margin:</span>
                      <span className="font-semibold text-slate-700">{m.revenue > 0 ? ((m.profit / m.revenue) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Monthly Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Billing Month</th>
                    <th className="py-3 px-4 text-center">Units Sold</th>
                    <th className="py-3 px-4 text-center">Orders</th>
                    <th className="py-3 px-4 text-right">Gross Revenue</th>
                    <th className="py-3 px-4 text-right">Cost (Manufacturing)</th>
                    <th className="py-3 px-4 text-right">Net Profit</th>
                    <th className="py-3 px-4 text-right">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyData.map((m) => {
                    const margin = m.revenue > 0 ? (m.profit / m.revenue) * 100 : 0;
                    return (
                      <tr key={m.key} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{m.label}</td>
                        <td className="py-3 px-4 text-center">{m.units}</td>
                        <td className="py-3 px-4 text-center">{m.orders}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">{fmt(m.revenue)}</td>
                        <td className="py-3 px-4 text-right text-rose-600 font-medium">{fmt(m.cost)}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600">{fmt(m.profit)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-700">
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 3: Yearly Profit & Loss Summary */}
        {activeView === 'yearly' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {yearlyData.map((y) => {
                const margin = y.revenue > 0 ? (y.profit / y.revenue) * 100 : 0;
                return (
                  <div key={y.year} className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Financial Year</span>
                        <h3 className="text-3xl font-extrabold text-white mt-0.5">{y.year}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Total Volume</span>
                        <p className="text-xl font-bold text-white">{y.units} <span className="text-xs font-normal text-slate-400">Tees</span></p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-800 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Annual Gross Revenue:</span>
                        <span className="text-lg font-bold text-white">{fmt(y.revenue)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Annual COGS / Production:</span>
                        <span className="text-rose-400 font-semibold">-{fmt(y.cost)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-700/60">
                        <span className="text-emerald-300 font-bold">Annual Net Profit:</span>
                        <span className="text-2xl font-black text-emerald-400">{fmt(y.profit)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                        <span>Overall Annual Margin:</span>
                        <span className="text-emerald-400 font-semibold">{margin.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: T-Shirt Size Distribution & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* T-Shirt Sizes Popularity Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-indigo-600" />
                <span>Size Demand Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Which sizes sell the most</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {totalSizeUnits} sold
            </span>
          </div>

          <div className="space-y-3.5">
            {TSHIRT_SIZES.map((size) => {
              const count = sizeDistribution[size] || 0;
              const pct = totalSizeUnits > 0 ? (count / totalSizeUnits) * 100 : 0;
              return (
                <div key={size} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="w-10 font-bold text-slate-800">Size {size}</span>
                    <span className="text-slate-500">{count} sold</span>
                    <span className="font-semibold text-slate-700">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        size === 'M' || size === 'L' ? 'bg-indigo-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            💡 <strong>Restock Insight:</strong> Medium (M) & Large (L) are typically your highest-velocity sizes. Maintain extra buffer stock for them.
          </div>
        </div>

        {/* Top Performing T-Shirt Designs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                Top Performing T-Shirt Designs
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Ranked by highest net profit generated</p>
            </div>
            <button
              onClick={onNavigateToStock}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Products</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.slice(0, 5).map((prod, idx) => (
              <div 
                key={prod.id || idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-slate-400 w-4">#{idx + 1}</span>
                  <img 
                    src={prod.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'} 
                    alt={prod.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200 shadow-xs" 
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 m-0 line-clamp-1">{prod.name}</h4>
                    <span className="text-[11px] text-slate-500">
                      {prod.unitsSold} units sold · Revenue: <strong>{fmt(prod.revenue)}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Profit</span>
                  <span className="font-bold text-sm text-emerald-600">
                    +{fmt(prod.profit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
