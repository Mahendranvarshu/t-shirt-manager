import React, { useRef } from 'react';
import { X, Printer, Mail, CheckCircle2, Copy, Shirt, ExternalLink } from 'lucide-react';

export const ReceiptModal = ({ sale, isOpen, onClose, currency, storeName = 'ThreadFlow Apparel' }) => {
  if (!isOpen || !sale) return null;

  const fmt = (val) => `${currency}${Number(val || 0).toFixed(2)}`;
  const dateStr = new Date(sale.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Receipt for your T-Shirt Order #${sale.id} - ${storeName}`);
    const body = encodeURIComponent(
      `Hello ${sale.customerName || 'Valued Customer'},\n\n` +
      `Thank you for shopping with ${storeName}!\n\n` +
      `--- ORDER SUMMARY ---\n` +
      `Order ID: #${sale.id}\n` +
      `Date: ${dateStr}\n` +
      `Item: ${sale.productName}\n` +
      `Size: ${sale.size}\n` +
      `Quantity: ${sale.quantity}\n` +
      `Unit Price: ${fmt(sale.unitPrice)}\n` +
      `Total Paid: ${fmt(sale.totalRevenue)}\n` +
      `Payment Method: ${sale.paymentMethod || 'Paid'}\n\n` +
      `Product Image: ${sale.productImage || ''}\n\n` +
      `If you have any questions or need sizing assistance, simply reply to this email.\n\n` +
      `Best regards,\n` +
      `${storeName}`
    );

    window.open(`mailto:${sale.customerEmail || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  const copyReceiptText = () => {
    const text = `Order #${sale.id} - ${storeName}\nCustomer: ${sale.customerName}\nItem: ${sale.productName} (Size: ${sale.size})\nQty: ${sale.quantity}\nTotal: ${fmt(sale.totalRevenue)}`;
    navigator.clipboard.writeText(text);
    alert('Receipt summary copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Modal Controls Header */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sales Invoice & Customer Receipt
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Card */}
        <div id="printable-receipt" className="p-6 bg-white space-y-6">
          
          {/* Brand & Status */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20">
              <Shirt className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 m-0">{storeName}</h2>
            <p className="text-xs text-slate-500">Official Purchase Invoice</p>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Payment Successful</span>
            </div>
          </div>

          {/* Order Details Bar */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-mono font-bold text-slate-800">#{sale.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date:</span>
              <span className="text-slate-700">{dateStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <span className="font-semibold text-slate-800">{sale.paymentMethod || 'Card'}</span>
            </div>
          </div>

          {/* Customer Info */}
          {(sale.customerName || sale.customerEmail) && (
            <div className="text-xs space-y-1 border-t border-slate-100 pt-3">
              <span className="font-bold text-slate-700 block">Customer Information:</span>
              <p className="text-slate-900 font-semibold m-0">{sale.customerName || 'Customer'}</p>
              {sale.customerEmail && (
                <p className="text-slate-500 m-0 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{sale.customerEmail}</span>
                </p>
              )}
              {sale.customerPhone && (
                <p className="text-slate-500 m-0">{sale.customerPhone}</p>
              )}
            </div>
          )}

          {/* Product Item Card with Image & Size */}
          <div className="border border-slate-200 rounded-2xl p-3 flex gap-3 items-center bg-slate-50/50">
            <img 
              src={sale.productImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'} 
              alt={sale.productName}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate m-0">{sale.productName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-black text-xs">
                  Size {sale.size}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Qty: <strong>{sale.quantity}</strong>
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                {fmt(sale.unitPrice)} each
              </p>
            </div>
          </div>

          {/* Totals Calculation */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{fmt(sale.totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax / VAT:</span>
              <span>{fmt(0)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid:</span>
              <span className="text-emerald-600">{fmt(sale.totalRevenue)}</span>
            </div>
          </div>

          {/* Store Footer Note */}
          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-dashed border-slate-200">
            Thank you for choosing our tees! Keep this receipt for exchange within 14 days.
          </div>

        </div>

        {/* Action Buttons Toolbar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={copyReceiptText}
            className="p-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl flex items-center gap-1 cursor-pointer"
            title="Copy Text"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleSendEmail}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Mail Receipt</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
