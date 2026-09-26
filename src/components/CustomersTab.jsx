import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Download, 
  ShoppingBag, 
  ExternalLink,
  Send,
  X
} from 'lucide-react';

export const CustomersTab = ({ sales, currency, storeName = 'ThreadFlow Apparel' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMailModal, setActiveMailModal] = useState(null); // Customer to email

  // Aggregate customers from sales data
  const customerMap = {};

  sales.forEach((s) => {
    const key = (s.customerEmail || s.customerName || 'Anonymous').toLowerCase().trim();
    if (!customerMap[key]) {
      customerMap[key] = {
        name: s.customerName || 'Customer',
        email: s.customerEmail || '',
        phone: s.customerPhone || '',
        totalSpent: 0,
        totalOrders: 0,
        sizesPurchased: {},
        purchasedItems: [],
        lastOrderDate: s.date,
      };
    }

    const c = customerMap[key];
    c.totalSpent += Number(s.totalRevenue || 0);
    c.totalOrders += 1;
    c.purchasedItems.push(s);

    if (s.size) {
      c.sizesPurchased[s.size] = (c.sizesPurchased[s.size] || 0) + (s.quantity || 1);
    }

    if (new Date(s.date) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = s.date;
    }
  });

  const customers = Object.values(customerMap);

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
    );
  });

  const fmt = (val) => `${currency}${Number(val || 0).toFixed(2)}`;

  const handleExportEmails = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Name,Email,Phone,Total Orders,Total Spent\n' +
      customers
        .map((c) => `"${c.name}","${c.email}","${c.phone}",${c.totalOrders},${c.totalSpent.toFixed(2)}`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TShirt_Customer_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 m-0">
            Customer Directory & Email Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View customer order histories, preferred T-shirt sizes, and send invoices or promotional updates.
          </p>
        </div>

        <button
          onClick={handleExportEmails}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Customer Emails</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by customer name, email address, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 shadow-xs"
        />
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-3 text-center">Orders</th>
                <th className="py-3 px-4">Favorite Sizes</th>
                <th className="py-3 px-4 text-right">Lifetime Spent</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust, idx) => {
                const sizes = Object.entries(cust.sizesPurchased)
                  .sort((a, b) => b[1] - a[1])
                  .map(([s, qty]) => `${s} (${qty})`);

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {cust.name}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      {cust.email ? (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{cust.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No email</span>
                      )}
                      {cust.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Orders count */}
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                      {cust.totalOrders}
                    </td>

                    {/* Sizes */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {sizes.map((sz) => (
                          <span key={sz} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Lifetime spent */}
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {fmt(cust.totalSpent)}
                    </td>

                    {/* Last order date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(cust.lastOrderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setActiveMailModal(cust)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Send Mail</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No customers found.
          </div>
        )}
      </div>

      {/* Quick Mail Modal */}
      {activeMailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm m-0">
                  Send Email to {activeMailModal.name}
                </h3>
              </div>
              <button 
                onClick={() => setActiveMailModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient</label>
                <input
                  type="text"
                  readOnly
                  value={`${activeMailModal.name} <${activeMailModal.email || 'no-email'}>`}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preset Template</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const subject = encodeURIComponent(`Special Thank You from ${storeName}`);
                      const body = encodeURIComponent(
                        `Hi ${activeMailModal.name},\n\n` +
                        `Thank you for being a wonderful customer of ${storeName}!\n\n` +
                        `We have just released new streetwear drops and limited colorways in your favorite sizes.\n\n` +
                        `Use coupon code TEEVIP10 for 10% off your next purchase!\n\n` +
                        `Best regards,\n${storeName}`
                      );
                      window.open(`mailto:${activeMailModal.email}?subject=${subject}&body=${body}`, '_blank');
                      setActiveMailModal(null);
                    }}
                    className="flex-1 py-2 px-3 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
                  >
                    VIP Discount Offer (10% Off)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const subject = encodeURIComponent(`Order Follow-up - ${storeName}`);
                      const body = encodeURIComponent(
                        `Hi ${activeMailModal.name},\n\n` +
                        `We hope you are loving your T-shirts! How does the fabric and fit feel?\n\n` +
                        `If you need any sizing adjustments or have questions, just reply to this email.\n\n` +
                        `Warm regards,\n${storeName}`
                      );
                      window.open(`mailto:${activeMailModal.email}?subject=${subject}&body=${body}`, '_blank');
                      setActiveMailModal(null);
                    }}
                    className="flex-1 py-2 px-3 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                  >
                    Fit & Sizing Follow-up
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Clicking either button will open your default email client (Gmail, Outlook, etc.) with pre-filled content.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
