import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, FileText, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { EXTENSION_FILES } from '../data/extensionFiles';
import { ExtensionFileItem } from '../types';

interface CodeExplorerProps {
  isEmbedded?: boolean;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ isEmbedded = false }) => {
  const [selectedFile, setSelectedFile] = useState<ExtensionFileItem>(EXTENSION_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(selectedFile.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={isEmbedded ? 'space-y-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-400" />
            Chrome Extension Source Code Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero placeholders. Full, clean, modular, and ready for immediate deployment into Chrome Developer Mode.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : `Copy ${selectedFile.name}`}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {selectedFile.name}</span>
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Sidebar: File Tree */}
        <div className="lg:col-span-3 bg-slate-950 p-4 border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Extension Project Files
          </div>
          <nav className="space-y-1">
            {EXTENSION_FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  {file.isMain && (
                    <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Core
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-800 px-2 text-[11px] text-slate-500 space-y-2">
            <div className="font-semibold text-slate-400">Directory Structure:</div>
            <pre className="text-[10px] font-mono leading-relaxed text-slate-400">
{`deceptiveshield/
├── manifest.json
├── content.js
├── content.css
├── popup.html
├── popup.js
├── popup.css
├── dummy_checkout.html
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png`}
            </pre>
          </div>
        </div>

        {/* Right Pane: Code Viewer */}
        <div className="lg:col-span-9 flex flex-col min-h-[560px]">
          {/* File Meta Header */}
          <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-mono font-bold text-white flex items-center gap-2">
                <span>{selectedFile.path}</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal">
                  ({selectedFile.code.split('\n').length} lines)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {selectedFile.language}
            </span>
          </div>

          {/* Code Content Container */}
          <div className="p-4 bg-[#0d1117] flex-1 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed select-text">
            <pre className="overflow-x-auto whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
