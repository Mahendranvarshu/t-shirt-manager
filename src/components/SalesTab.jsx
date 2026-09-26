import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Mail, 
  Trash2, 
  Eye, 
  Calendar,
  CheckCircle,
  Plus
} from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';
import { exportDataToCsv } from '../services/storageService';

export const SalesTab = ({ 
  sales, 
  products, 
  onViewReceipt, 
  onDeleteSale, 
  onOpenNewSale, 
  currency 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'today' | '7days' | '30days' | 'all'
  const [sizeFilter, setSizeFilter] = useState('all');

  const fmt = (val) => `${currency}${Number(val || 0).toFixed(2)}`;

  // Filter sales
  const filteredSales = sales.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.id.toLowerCase().includes(term) ||
      s.productName.toLowerCase().includes(term) ||
      (s.customerName && s.customerName.toLowerCase().includes(term)) ||
      (s.customerEmail && s.customerEmail.toLowerCase().includes(term));

    const matchesSize = sizeFilter === 'all' || s.size === sizeFilter;

    // Date filtering
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const saleDate = new Date(s.date);
      const now = new Date();
      if (dateFilter === 'today') {
        matchesDate = saleDate.toDateString() === now.toDateString();
      } else if (dateFilter === '7days') {
        const diffDays = (now - saleDate) / (1000 * 60 * 60 * 24);
        matchesDate = diffDays <= 7;
      } else if (dateFilter === '30days') {
        const diffDays = (now - saleDate) / (1000 * 60 * 60 * 24);
        matchesDate = diffDays <= 30;
      }
    }

    return matchesSearch && matchesSize && matchesDate;
  });

  const totalFilteredRevenue = filteredSales.reduce((a, b) => a + Number(b.totalRevenue || 0), 0);
  const totalFilteredProfit = filteredSales.reduce((a, b) => a + Number(b.netProfit || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header with KPI & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 m-0">
            Sales & Orders History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of customer orders, itemized sizes, profit earned, and receipt generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportDataToCsv(products, sales)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            title="Download CSV backup of sales and products"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenNewSale}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Sale</span>
          </button>
        </div>
      </div>

      {/* Summary Filter Strip */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Orders</span>
            <p className="text-xl font-black text-white m-0">{filteredSales.length}</p>
          </div>
          <div className="border-l border-slate-700 pl-6">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Filtered Revenue</span>
            <p className="text-xl font-black text-indigo-400 m-0">{fmt(totalFilteredRevenue)}</p>
          </div>
          <div className="border-l border-slate-700 pl-6">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Filtered Profit</span>
            <p className="text-xl font-black text-emerald-400 m-0">+{fmt(totalFilteredProfit)}</p>
          </div>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDateFilter(d.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                dateFilter === d.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Size Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID, T-shirt, customer name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>

        {/* Size Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 font-semibold mr-1">Size:</span>
          {['all', ...TSHIRT_SIZES].map((s) => (
            <button
              key={s}
              onClick={() => setSizeFilter(s)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                sizeFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">T-Shirt Item</th>
                <th className="py-3 px-3 text-center">Size</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                <th className="py-3 px-3 text-right">Revenue</th>
                <th className="py-3 px-3 text-right">Net Profit</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => {
                const saleDate = new Date(sale.date);
                const dateStr = saleDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const timeStr = saleDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Order ID & Date */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{sale.id}</span>
                      <span className="text-[11px] text-slate-400">{dateStr} {timeStr}</span>
                    </td>

                    {/* Product Snapshot */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={sale.productImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100'} 
                          alt={sale.productName} 
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" 
                        />
                        <span className="font-semibold text-slate-800 line-clamp-1 max-w-[180px]">
                          {sale.productName}
                        </span>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[11px]">
                        {sale.size}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {sale.quantity}
                    </td>

                    {/* Unit Price */}
                    <td className="py-3 px-3 text-right font-medium text-slate-600">
                      {fmt(sale.unitPrice)}
                    </td>

                    {/* Total Revenue */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {fmt(sale.totalRevenue)}
                    </td>

                    {/* Net Profit */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        +{fmt(sale.netProfit)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="max-w-[150px]">
                        <span className="font-semibold text-slate-900 block truncate">
                          {sale.customerName || 'Walk-in'}
                        </span>
                        {sale.customerEmail && (
                          <span className="text-[11px] text-slate-400 block truncate">
                            {sale.customerEmail}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewReceipt(sale)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer"
                          title="View & Print Receipt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSale(sale.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                          title="Delete / Refund Sale"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No sales matching your criteria.
          </div>
        )}
      </div>

    </div>
  );
};
