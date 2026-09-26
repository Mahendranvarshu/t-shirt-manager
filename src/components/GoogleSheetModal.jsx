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
  AlertCircle, 
  HelpCircle,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/googleAppsScriptCode';
import { testGoogleSheetConnection } from '../services/googleSheetsApi';
import { exportDataToCsv, resetToSampleData } from '../services/storageService';

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
  const [storeName, setStoreName] = useState(settings.storeName || 'ThreadFlow Apparel');
  const [copiedCode, setCopiedCode] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!url.trim()) {
      setTestResult({ success: false, message: 'Please enter a Google Apps Script Web App URL first.' });
      return;
    }

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

  const handleSaveOnly = () => {
    onSaveSettings({
      ...settings,
      googleSheetUrl: url.trim(),
      storeName: storeName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-6 overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Sheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base m-0">Google Sheets as Database Setup</h3>
              <p className="text-xs text-slate-300">Zero Server Cost · 100% Free Spreadsheet DB & Emailer</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Current Connection Status Box */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isSheetConnected 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-3">
              {isSheetConnected ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-xs m-0">
                  {isSheetConnected ? 'Connected to Google Sheets!' : 'Running in Local Storage / Demo Mode'}
                </h4>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {isSheetConnected 
                    ? 'All products, sales, and size updates sync with your Google Sheet in real time.' 
                    : 'The app works locally right now. Follow the 2-minute setup below to link your Google Sheet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Business Store Name */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Brand / Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. ThreadFlow Apparel Co."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-indigo-500 outline-none font-semibold text-slate-800"
            />
          </div>

          {/* 3-Step Setup Guide */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0">
              Easy 2-Minute Google Sheet Setup:
            </h4>

            {/* Step 1 */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                  <span className="text-xs font-bold text-slate-800">Create a New Google Sheet</span>
                </div>
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Open sheets.new</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-500 pl-7">
                Open a new blank Google Sheet and name it <strong>T-Shirt Business DB</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  <span className="text-xs font-bold text-slate-800">Paste Apps Script Code</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Code Copied!' : 'Copy Apps Script Code'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 pl-7">
                In your Google Sheet, click <strong>Extensions</strong> → <strong>Apps Script</strong>. Replace everything in <code>Code.gs</code> with the copied code and click Save (💾).
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                <span className="text-xs font-bold text-slate-800">Deploy as Web App & Paste URL Here</span>
              </div>
              <div className="text-[11px] text-slate-500 pl-7 space-y-1">
                <p className="m-0">1. In Apps Script, click <strong>Deploy</strong> → <strong>New deployment</strong>.</p>
                <p className="m-0">2. Select type: <strong>Web app</strong>.</p>
                <p className="m-0">3. Set <em>Execute as</em>: <strong>Me</strong>.</p>
                <p className="m-0">4. Set <em>Who has access</em>: <strong>Anyone</strong> (critical for browser connection).</p>
                <p className="m-0">5. Click Deploy, Authorize access, and copy the <strong>Web App URL</strong>.</p>
              </div>

              {/* URL Input */}
              <div className="pl-7 space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Google Apps Script Web App URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-indigo-500 outline-none font-mono"
                  />
                  <button
                    type="button"
                    disabled={testing}
                    onClick={handleTestConnection}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {testing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Test & Connect</span>
                  </button>
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    testResult.success 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sync & Backup Section */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0">
              Data Synchronization & Offline Backup
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onSyncPush}
                disabled={isSyncing || !url}
                className="p-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-left transition-colors disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-1">
                  <UploadCloud className="w-4 h-4" />
                  <span>Push Local Data to Google Sheet</span>
                </div>
                <p className="text-[11px] text-slate-500 m-0">
                  Upload current products and sales into your Google Sheet tabs.
                </p>
              </button>

              <button
                type="button"
                onClick={onSyncPull}
                disabled={isSyncing || !url}
                className="p-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-left transition-colors disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold mb-1">
                  <DownloadCloud className="w-4 h-4" />
                  <span>Pull Data from Google Sheet</span>
                </div>
                <p className="text-[11px] text-slate-500 m-0">
                  Download the latest rows from your Google Sheet into this dashboard.
                </p>
              </button>
            </div>

            {/* Offline CSV & Reset Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => exportDataToCsv(products, sales)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV Spreadsheets</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset to initial sample T-shirts and sales data?')) {
                    onResetData();
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Reset to Sample T-Shirt Business Data
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSaveOnly}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs cursor-pointer"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};
