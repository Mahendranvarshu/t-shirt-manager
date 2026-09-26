import React, { useState } from 'react';
import { Search, Phone, Mail, MessageSquare, Download } from 'lucide-react';

export const CustomersTab = ({ sales, storeName = 'T-Shirt Studio' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const customerMap = {};

  sales.forEach((s) => {
    const key = (s.customerPhone || s.customerEmail || s.customerName || 'Walk-in').toLowerCase().trim();
    if (!customerMap[key]) {
      customerMap[key] = {
        name: s.customerName || 'Customer',
        phone: s.customerPhone || '',
        email: s.customerEmail || '',
        totalSpent: 0,
        totalOrders: 0,
        sizes: {},
        lastOrder: s.date,
      };
    }

    const c = customerMap[key];
    c.totalSpent += Number(s.totalRevenue || 0);
    c.totalOrders += 1;
    if (s.size) {
      c.sizes[s.size] = (c.sizes[s.size] || 0) + (s.quantity || 1);
    }
  });

  const customers = Object.values(customerMap);

  const filtered = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.phone.includes(term) || c.email.toLowerCase().includes(term);
  });

  const handleWhatsApp = (cust) => {
    const phone = cust.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hi ${cust.name}, thank you for shopping at ${storeName}! Check out our new T-shirt drops!`
    );
    window.open(phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmail = (cust) => {
    const subject = encodeURIComponent(`Exclusive Offers from ${storeName}`);
    const body = encodeURIComponent(`Hi ${cust.name},\n\nWe have new drops in your favorite sizes!\n\nBest,\n${storeName}`);
    window.open(`mailto:${cust.email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-3 pb-24 max-w-lg mx-auto">
      
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search customer name, phone, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none shadow-xs font-medium"
        />
      </div>

      {/* Customer Mobile Cards */}
      <div className="space-y-2">
        {filtered.map((c, idx) => {
          const topSize = Object.entries(c.sizes).sort((a, b) => b[1] - a[1])[0]?.[0];

          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs text-slate-900 m-0 truncate">{c.name}</h4>
                  {topSize && (
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">
                      Size {topSize}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  {c.phone || c.email || 'Walk-in'}
                </div>

                <div className="text-[10px] text-slate-400 mt-0.5">
                  {c.totalOrders} orders · Total: <strong className="text-slate-800">₹{c.totalSpent}</strong>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Call/Email */}
              <div className="flex items-center gap-1 shrink-0">
                {c.phone && (
                  <button
                    onClick={() => handleWhatsApp(c)}
                    className="p-2 bg-emerald-50 text-emerald-700 rounded-xl active:bg-emerald-100 cursor-pointer"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4 fill-emerald-600" />
                  </button>
                )}

                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="p-2 bg-blue-50 text-blue-700 rounded-xl active:bg-blue-100"
                    title="Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}

                {c.email && (
                  <button
                    onClick={() => handleEmail(c)}
                    className="p-2 bg-indigo-50 text-indigo-700 rounded-xl active:bg-indigo-100 cursor-pointer"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
