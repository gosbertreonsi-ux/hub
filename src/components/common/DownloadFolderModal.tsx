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
  Terminal,
  Loader2,
  ArrowRight,
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 select-none text-white animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsDownloadModalOpen(false)} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] bg-[#111111] rounded-[36px] overflow-hidden shadow-2xl flex flex-col border border-white/10 animate-in zoom-in-95">
        {/* Header matching oneImage.webp */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#0e0e0e]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-md">
              <FolderArchive className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                Download Project Folder
              </h2>
              <p className="text-xs text-neutral-400">
                Full repository: {fileList.length} files with video player, reels, and Gemini AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDownloadModalOpen(false)}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 px-6 pt-3 border-b border-white/10 bg-[#111111]">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            Quick Download (.ZIP)
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'files'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            File Inspector ({fileList.length})
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            Terminal Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'all' && (
            <div className="space-y-6">
              {/* Primary Download Card */}
              <div className="p-6 sm:p-8 rounded-[32px] bg-[#161616] border border-white/10 space-y-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                      Package Ready
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                      Download Complete Archive
                    </h3>
                    <p className="text-xs text-neutral-400 max-w-md">
                      Packages all source code, video player modules, components, types, and high-definition assets.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadZip}
                    disabled={isZipping}
                    className="px-7 py-4 rounded-full bg-white hover:bg-neutral-200 text-black font-black text-xs flex items-center justify-center gap-2 shadow-2xl transition-all shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    {isZipping ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating ZIP...</span>
                      </>
                    ) : downloadSuccess ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Downloaded to Device</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 stroke-[2.5]" />
                        <span>Download Folder (.ZIP)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>35 Project Files Included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="/mizizi-social.zip"
                      download="mizizi-social.zip"
                      className="text-white hover:underline flex items-center gap-1 font-semibold"
                    >
                      HTTP Direct Link (.zip)
                    </a>
                    <span>·</span>
                    <a
                      href="/mizizi-social.tar.gz"
                      download="mizizi-social.tar.gz"
                      className="text-white hover:underline flex items-center gap-1 font-semibold"
                    >
                      Tarball (.tar.gz)
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick file stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#161616] border border-white/5 text-xs space-y-1">
                  <div className="text-neutral-400">Total Files</div>
                  <div className="text-lg font-black text-white tabular-nums">
                    {fileList.length} files
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#161616] border border-white/5 text-xs space-y-1">
                  <div className="text-neutral-400">Video Engine</div>
                  <div className="text-lg font-black text-white">
                    HTML5 + Reels
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#161616] border border-white/5 text-xs space-y-1">
                  <div className="text-neutral-400">Frontend Stack</div>
                  <div className="text-lg font-black text-white">
                    React 19 + Vite
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#161616] border border-white/5 text-xs space-y-1">
                  <div className="text-neutral-400">AI Intelligence</div>
                  <div className="text-lg font-black text-white">
                    Gemini API
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[440px]">
              {/* File List Column */}
              <div className="md:col-span-5 border border-white/10 rounded-2xl overflow-y-auto divide-y divide-white/5 bg-[#0e0e0e] p-1">
                {fileList.map(filePath => {
                  const isSelected = selectedFileForPreview === filePath;
                  const isBinary = PROJECT_FILES[filePath]?.isBinary;
                  return (
                    <div
                      key={filePath}
                      onClick={() => setSelectedFileForPreview(filePath)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-white text-black font-bold'
                          : 'hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isBinary ? (
                          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <FileCode className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="truncate">{filePath}</span>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          downloadSingleFile(filePath);
                        }}
                        className="p-1 rounded hover:bg-black/20"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Code Preview Column */}
              <div className="md:col-span-7 border border-white/10 rounded-2xl overflow-hidden flex flex-col bg-black text-white">
                <div className="p-3 border-b border-white/10 flex items-center justify-between bg-[#141414] text-xs">
                  <div className="flex items-center gap-2 truncate font-mono text-neutral-300">
                    <FileCode className="w-4 h-4 text-white" />
                    <span>{selectedFileForPreview}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(selectedFileForPreview)}
                      className="px-3 py-1 rounded-full bg-[#242424] hover:bg-[#303030] text-[11px] font-bold text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedFile === selectedFileForPreview ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => downloadSingleFile(selectedFileForPreview)}
                      className="px-3 py-1 rounded-full bg-white text-black text-[11px] font-black flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 text-[11px] font-mono leading-relaxed bg-black">
                  {PROJECT_FILES[selectedFileForPreview]?.isBinary ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-3 py-12">
                      <ImageIcon className="w-12 h-12 text-neutral-600" />
                      <p>High-definition visual asset</p>
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
              <div className="p-5 rounded-[28px] bg-[#161616] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Terminal Instructions</span>
                </div>

                <div className="space-y-3 font-mono text-[11px] text-neutral-300">
                  <div>
                    <div className="text-neutral-500 mb-1"># 1. Extract archive</div>
                    <div className="p-3 rounded-xl bg-black border border-white/10">
                      unzip mizizi-social.zip -d mizizi-social && cd mizizi-social
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-500 mb-1"># 2. Install packages</div>
                    <div className="p-3 rounded-xl bg-black border border-white/10">
                      npm install
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-500 mb-1"># 3. Launch dev environment</div>
                    <div className="p-3 rounded-xl bg-black border border-white/10">
                      npm run dev
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#0e0e0e] text-xs">
          <div className="text-neutral-400">
            MIZIZI SOCIAL · NOIR EDITION
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDownloadModalOpen(false)}
              className="px-4 py-2 rounded-full bg-[#202020] text-neutral-300 font-semibold hover:bg-[#282828] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadZip}
              className="px-5 py-2 rounded-full bg-white text-black font-extrabold transition-colors flex items-center gap-1.5 hover:bg-neutral-200"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download .ZIP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
