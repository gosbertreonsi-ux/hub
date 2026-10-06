import React, { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  FileCode,
  FileText,
  Image as ImageIcon,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Terminal,
  ExternalLink,
  Loader2,
  Folder,
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { downloadProjectZip, downloadSingleFile } from '../../services/downloadService';
import { PROJECT_FILES } from '../../services/fileBundle';

export const DownloadFolderModal: React.FC = () => {
  const { isDownloadModalOpen, setIsDownloadModalOpen } = useSocial();

  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<string>('package.json');
  const [activeTab, setActiveTab] = useState<'all' | 'files' | 'guide'>('all');

  if (!isDownloadModalOpen) return null;

  const handleDownloadZip = async () => {
    setIsZipping(true);
    setDownloadSuccess(false);
    try {
      await downloadProjectZip('mizizi-social.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback direct static URL
      window.location.href = '/mizizi-social.zip';
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyCode = (filePath: string) => {
    const content = PROJECT_FILES[filePath];
    if (typeof content === 'string') {
      navigator.clipboard.writeText(content);
      setCopiedFile(filePath);
      setTimeout(() => setCopiedFile(null), 2000);
    }
  };

  const fileList = Object.keys(PROJECT_FILES).sort();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsDownloadModalOpen(false)} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-neutral-200 dark:border-neutral-800 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Download MIZIZI SOCIAL Folder</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Complete codebase: {fileList.length} files including configs, UI components, types, and assets.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDownloadModalOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Quick Download (.ZIP)
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'files'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Browse & Download Files ({fileList.length})
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Terminal Setup Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'all' && (
            <div className="space-y-6">
              {/* Primary Download Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                      Recommended
                    </span>
                    <h3 className="font-display font-extrabold text-xl">
                      Download Full Project as .ZIP
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-md">
                      Packages the entire project into a clean zip archive containing all source files, images, components, and configurations ready for local development.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadZip}
                    disabled={isZipping}
                    className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    {isZipping ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating ZIP...</span>
                      </>
                    ) : downloadSuccess ? (
                      <>
                        <Check className="w-5 h-5 text-neutral-950 stroke-[3]" />
                        <span>Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Folder (.ZIP)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Includes 33 project files & assets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="/mizizi-social.zip"
                      download="mizizi-social.zip"
                      className="hover:text-amber-400 underline underline-offset-2 flex items-center gap-1"
                    >
                      Direct HTTP Link (.zip)
                    </a>
                    <span>·</span>
                    <a
                      href="/mizizi-social.tar.gz"
                      download="mizizi-social.tar.gz"
                      className="hover:text-amber-400 underline underline-offset-2 flex items-center gap-1"
                    >
                      Tarball Link (.tar.gz)
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick file stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-xs">
                  <div className="text-neutral-400">Total Files</div>
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {fileList.length} files
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-xs">
                  <div className="text-neutral-400">Architecture</div>
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    React 19 + Vite
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-xs">
                  <div className="text-neutral-400">CSS Framework</div>
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    Tailwind v4
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 text-xs">
                  <div className="text-neutral-400">AI Integration</div>
                  <div className="text-lg font-bold text-amber-500">
                    Gemini API
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[440px]">
              {/* File List Column */}
              <div className="md:col-span-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/40 bg-neutral-50 dark:bg-neutral-950/40 p-1">
                {fileList.map(filePath => {
                  const isSelected = selectedFileForPreview === filePath;
                  const isBinary = PROJECT_FILES[filePath]?.isBinary;
                  return (
                    <div
                      key={filePath}
                      onClick={() => setSelectedFileForPreview(filePath)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                          : 'hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isBinary ? (
                          <ImageIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : filePath.endsWith('.tsx') || filePath.endsWith('.ts') ? (
                          <FileCode className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        <span className="truncate">{filePath}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            downloadSingleFile(filePath);
                          }}
                          className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          title="Download this file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* File Preview Column */}
              <div className="md:col-span-7 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col bg-neutral-950 text-neutral-200">
                <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 text-xs">
                  <div className="flex items-center gap-2 truncate font-mono text-neutral-300">
                    <FileCode className="w-4 h-4 text-amber-500" />
                    <span>{selectedFileForPreview}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(selectedFileForPreview)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-semibold text-neutral-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedFile === selectedFileForPreview ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => downloadSingleFile(selectedFileForPreview)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 text-[11px] font-mono leading-relaxed bg-neutral-950">
                  {PROJECT_FILES[selectedFileForPreview]?.isBinary ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-3 py-12">
                      <ImageIcon className="w-12 h-12 text-neutral-600" />
                      <p>Binary visual asset (High-definition photograph)</p>
                      <button
                        onClick={() => downloadSingleFile(selectedFileForPreview)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs"
                      >
                        Download Image
                      </button>
                    </div>
                  ) : (
                    <pre className="text-neutral-300 whitespace-pre">
                      {PROJECT_FILES[selectedFileForPreview] || '// No content'}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-900 text-white border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>How to Run Locally in 3 Steps</span>
                </div>

                <div className="space-y-3 font-mono text-[11px] text-neutral-300">
                  <div>
                    <div className="text-neutral-500 mb-1"># 1. Unpack downloaded zip file</div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-neutral-800">
                      unzip mizizi-social.zip -d mizizi-social && cd mizizi-social
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-500 mb-1"># 2. Install all dependencies</div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-neutral-800">
                      npm install
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-500 mb-1"># 3. Start development server</div>
                    <div className="p-2.5 rounded-xl bg-black/60 border border-neutral-800">
                      npm run dev
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">
                  Gemini API Configuration:
                </strong>
                Copy `.env.example` to `.env` and provide your `GEMINI_API_KEY` to enable live AI caption generation and creator growth analytics in your local environment.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-950/60 text-xs">
          <div className="text-neutral-500">
            MIZIZI SOCIAL v1.0 — Visual Social & Creator Platform
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDownloadModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadZip}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .ZIP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
