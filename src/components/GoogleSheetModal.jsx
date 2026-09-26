import React, { useState } from 'react';
import { 
  X, 
  Sheet, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/googleAppsScriptCode';
import { testGoogleSheetConnection } from '../services/googleSheetsApi';
import { exportDataToCsv } from '../services/storageService';

export const GoogleSheetModal = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSaveSettings, 
  isSheetConnected, 
  setIsSheetConnected,
  onSyncPush,
  onSyncPull,
  isSyncing,
  products,
  sales,
  onResetData
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(settings.googleSheetUrl || '');
  const [storeName, setStoreName] = useState(settings.storeName || 'T-Shirt Studio');
  const [copiedCode, setCopiedCode] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestConnection = async () => {
    if (!url.trim()) return;
    setTesting(true);
    setTestResult(null);

    const res = await testGoogleSheetConnection(url.trim());
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      setIsSheetConnected(true);
      onSaveSettings({
        ...settings,
        googleSheetUrl: url.trim(),
        storeName: storeName,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-xs text-white">Google Sheet Database</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          
          {/* Status Dot */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold ${
            isSheetConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              {isSheetConnected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span>{isSheetConnected ? 'Google Sheet Connected' : 'Running in Offline Mode'}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">
              {isSheetConnected ? 'LIVE' : 'LOCAL'}
            </span>
          </div>

          {/* Store Name Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Store / Brand Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none"
            />
          </div>

          {/* Quick Steps */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">1. Open Sheet</span>
              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 font-bold flex items-center gap-1"
              >
                <span>sheets.new</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="font-bold text-slate-800">2. Apps Script Code</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="pt-1 border-t border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block">3. Paste Web App URL:</span>
              <div className="flex gap-1.5">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-[11px] bg-white border border-slate-300 rounded-xl outline-none font-mono"
                />
                <button
                  type="button"
                  disabled={testing}
                  onClick={handleTestConnection}
                  className="px-3 py-1.5 bg-slate-900 active:bg-slate-800 text-white font-black rounded-xl text-[11px] cursor-pointer"
                >
                  {testing ? 'Testing...' : 'Connect'}
                </button>
              </div>

              {testResult && (
                <div className={`p-2 rounded-lg text-[11px] font-bold ${
                  testResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {testResult.message}
                </div>
              )}
            </div>
          </div>

          {/* Sync Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSyncPush}
              disabled={isSyncing || !url}
              className="py-2.5 px-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Push to Sheet</span>
            </button>

            <button
              type="button"
              onClick={onSyncPull}
              disabled={isSyncing || !url}
              className="py-2.5 px-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Pull from Sheet</span>
            </button>
          </div>

          {/* CSV & Reset */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => exportDataToCsv(products, sales)}
              className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Download CSV
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset to initial sample T-shirts and sales?')) {
                  onResetData();
                }
              }}
              className="font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              Reset Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
