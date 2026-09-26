import React, { useState } from 'react';
import { Search, Eye, Trash2, Download } from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';
import { exportDataToCsv } from '../services/storageService';

export const SalesTab = ({ 
  sales, 
  products, 
  onViewReceipt, 
  onDeleteSale 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  const filteredSales = sales.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.id.toLowerCase().includes(term) ||
      s.productName.toLowerCase().includes(term) ||
      (s.customerName && s.customerName.toLowerCase().includes(term));

    const matchesSize = sizeFilter === 'all' || s.size === sizeFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const saleDate = new Date(s.date);
      const now = new Date();
      if (dateFilter === 'today') {
        matchesDate = saleDate.toDateString() === now.toDateString();
      } else if (dateFilter === '7days') {
        matchesDate = (now - saleDate) / (1000 * 60 * 60 * 24) <= 7;
      }
    }

    return matchesSearch && matchesSize && matchesDate;
  });

  const totalRev = filteredSales.reduce((a, b) => a + Number(b.totalRevenue || 0), 0);
  const totalProfit = filteredSales.reduce((a, b) => a + Number(b.netProfit || 0), 0);

  return (
    <div className="space-y-3 pb-24 max-w-lg mx-auto">
      
      {/* Top Total Strip */}
      <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Orders</span>
          <span className="text-lg font-black text-white">{filteredSales.length}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Sales</span>
          <span className="text-lg font-black text-white">₹{Math.round(totalRev).toLocaleString('en-IN')}</span>
        </div>
        <div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase block">Profit</span>
          <span className="text-lg font-black text-emerald-400">+₹{Math.round(totalProfit).toLocaleString('en-IN')}</span>
        </div>
        <button
          onClick={() => exportDataToCsv(products, sales)}
          className="p-2 bg-slate-800 rounded-xl text-slate-300 hover:text-white cursor-pointer"
          title="Export CSV"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search order, customer, shirt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none shadow-xs font-medium"
        />
      </div>

      {/* Date & Size Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'today', '7days'].map((d) => (
          <button
            key={d}
            onClick={() => setDateFilter(d)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              dateFilter === d ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {d === 'all' ? 'All Time' : d === 'today' ? 'Today' : 'Last 7 Days'}
          </button>
        ))}

        <div className="w-[1px] bg-slate-300 mx-1 shrink-0"></div>

        {['all', ...TSHIRT_SIZES].map((s) => (
          <button
            key={s}
            onClick={() => setSizeFilter(s)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              sizeFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {s === 'all' ? 'All Sizes' : s}
          </button>
        ))}
      </div>

      {/* Mobile Orders Feed */}
      <div className="space-y-2">
        {filteredSales.map((sale) => {
          const dateStr = new Date(sale.date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div 
              key={sale.id}
              className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-2.5"
            >
              <img 
                src={sale.productImage} 
                alt="Tee" 
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400">#{sale.id}</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-extrabold text-[10px]">
                    Size {sale.size}
                  </span>
                  <span className="text-[10px] text-slate-400">{sale.quantity} pc</span>
                </div>

                <h4 className="font-extrabold text-xs text-slate-900 truncate m-0 mt-0.5">
                  {sale.productName}
                </h4>

                <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 truncate max-w-[90px]">{sale.customerName}</span>
                  <span>•</span>
                  <span>{dateStr}</span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="text-right shrink-0">
                <div className="text-xs font-black text-slate-900">₹{sale.totalRevenue}</div>
                <div className="text-[10px] font-extrabold text-emerald-600">+₹{sale.netProfit}</div>

                <div className="flex items-center justify-end gap-1 mt-1.5">
                  <button
                    onClick={() => onViewReceipt(sale)}
                    className="p-1 rounded-lg bg-slate-100 text-slate-700 active:bg-slate-200 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteSale(sale.id)}
                    className="p-1 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
