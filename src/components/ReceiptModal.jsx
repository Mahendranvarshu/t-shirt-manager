import React from 'react';
import { X, Mail, MessageSquare, Printer, CheckCircle2 } from 'lucide-react';

export const ReceiptModal = ({ sale, isOpen, onClose, storeName = 'T-Shirt Studio' }) => {
  if (!isOpen || !sale) return null;

  const dateStr = new Date(sale.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const receiptSummary = 
    `*${storeName} - Bill Receipt*\n` +
    `Order: #${sale.id}\n` +
    `Item: ${sale.productName}\n` +
    `Size: ${sale.size} | Qty: ${sale.quantity}\n` +
    `Total: ₹${sale.totalRevenue}\n` +
    `Customer: ${sale.customerName}\n` +
    `Payment: ${sale.paymentMethod || 'Paid'}\n` +
    `Date: ${dateStr}`;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(receiptSummary);
    const phone = (sale.customerPhone || '').replace(/[^0-9]/g, '');
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Bill Receipt #${sale.id} - ${storeName}`);
    const body = encodeURIComponent(
      `Hello ${sale.customerName},\n\n` +
      `Thank you for shopping at ${storeName}!\n\n` +
      `ORDER DETAILS:\n` +
      `Order ID: #${sale.id}\n` +
      `T-Shirt: ${sale.productName}\n` +
      `Size: ${sale.size}\n` +
      `Quantity: ${sale.quantity}\n` +
      `Total Paid: ₹${sale.totalRevenue}\n` +
      `Payment: ${sale.paymentMethod || 'Paid'}\n` +
      `Date: ${dateStr}\n\n` +
      `Product Image: ${sale.productImage || ''}\n\n` +
      `Best regards,\n${storeName}`
    );
    window.open(`mailto:${sale.customerEmail || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-xs text-white">Bill Receipt</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-4 space-y-3.5 text-xs">
          
          {/* Order ID & Total */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 font-bold block">ORDER #{sale.id}</span>
            <div className="text-2xl font-black text-slate-900">₹{sale.totalRevenue}</div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
              {sale.paymentMethod || 'Paid'}
            </span>
          </div>

          {/* Product Snapshot */}
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <img src={sale.productImage} alt="Tee" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-xs text-slate-900 truncate m-0">{sale.productName}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-2 py-0.2 rounded-md bg-indigo-600 text-white font-black text-[10px]">
                  Size {sale.size}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Qty: {sale.quantity}</span>
              </div>
            </div>
          </div>

          {/* Customer Contact */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-900">{sale.customerName || 'Walk-in'}</span>
            </div>
            {sale.customerPhone && (
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-bold text-slate-900">{sale.customerPhone}</span>
              </div>
            )}
            {sale.customerEmail && (
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[170px]">{sale.customerEmail}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Date:</span>
              <span className="text-slate-700">{dateStr}</span>
            </div>
          </div>

          {/* Share Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleWhatsApp}
              className="w-full py-2.5 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={handleEmail}
              className="w-full py-2.5 bg-indigo-600 active:bg-indigo-700 text-white rounded-xl font-black text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email Receipt</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
