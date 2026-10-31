import React from 'react';
import {
  Code,
  Palette,
  Type,
  WrapText,
  ListOrdered,
  FolderTree,
  Lock,
  Unlock,
  Sparkles,
  Search,
  Copy,
  Check,
  Download,
  Columns2,
  FileCode2,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { SupportedLanguage, EditorThemeId, EditorSettings } from '../types/editor';
import { LANGUAGE_OPTIONS } from '../languages/languages';
import { THEMES } from '../themes/editorThemes';

interface EditorToolbarProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  settings: EditorSettings;
  onUpdateSettings: (settings: Partial<EditorSettings>) => void;
  onFormat: () => void;
  onOpenSearch: () => void;
  onOpenSnippets: () => void;
  onCopy: () => void;
  onDownload: () => void;
  isCopied: boolean;
  viewMode: 'editor' | 'split' | 'preview';
  onViewModeChange: (mode: 'editor' | 'split' | 'preview') => void;
  isExplorerOpen: boolean;
  onToggleExplorer: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language,
  onLanguageChange,
  settings,
  onUpdateSettings,
  onFormat,
  onOpenSearch,
  onOpenSnippets,
  onCopy,
  onDownload,
  isCopied,
  viewMode,
  onViewModeChange,
  isExplorerOpen,
  onToggleExplorer,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-xs">
      {/* Left controls: Explorer toggle, Language, Theme, Font, Layout */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Explorer toggle button */}
        <button
          onClick={onToggleExplorer}
          title={isExplorerOpen ? '탐색기 닫기' : '탐색기 열기'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors font-medium ${
            isExplorerOpen
              ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
              : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-300 hover:text-white'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>탐색기</span>
        </button>

        <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

        {/* Language select */}
        <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-md border border-neutral-700/60">
          <Code className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-transparent text-neutral-200 outline-none cursor-pointer font-medium"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-neutral-900 text-neutral-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme select */}
        <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-md border border-neutral-700/60">
          <Palette className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <select
            value={settings.theme}
            onChange={(e) => onUpdateSettings({ theme: e.target.value as EditorThemeId })}
            className="bg-transparent text-neutral-200 outline-none cursor-pointer font-medium"
          >
            {Object.entries(THEMES).map(([id, t]) => (
              <option key={id} value={id} className="bg-neutral-900 text-neutral-100">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font size */}
        <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-md border border-neutral-700/60">
          <Type className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={settings.fontSize}
            onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
            className="bg-transparent text-neutral-200 outline-none cursor-pointer font-mono"
          >
            {[12, 13, 14, 15, 16, 18, 20].map((size) => (
              <option key={size} value={size} className="bg-neutral-900 text-neutral-100">
                {size}px
              </option>
            ))}
          </select>
        </div>

        {/* Tab Size */}
        <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2 py-1 rounded-md border border-neutral-700/60">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={settings.tabSize}
            onChange={(e) => onUpdateSettings({ tabSize: Number(e.target.value) })}
            className="bg-transparent text-neutral-200 outline-none cursor-pointer font-mono"
          >
            <option value={2} className="bg-neutral-900 text-neutral-100">Tab: 2</option>
            <option value={4} className="bg-neutral-900 text-neutral-100">Tab: 4</option>
          </select>
        </div>

        <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

        {/* Feature Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdateSettings({ lineWrapping: !settings.lineWrapping })}
            title="줄 바꿈 (Line Wrapping)"
            className={`p-1.5 rounded-md border transition-colors ${
              settings.lineWrapping
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateSettings({ lineNumbers: !settings.lineNumbers })}
            title="줄 번호 (Line Numbers)"
            className={`p-1.5 rounded-md border transition-colors ${
              settings.lineNumbers
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateSettings({ foldGutter: !settings.foldGutter })}
            title="코드 접기 (Code Folding)"
            className={`p-1.5 rounded-md border transition-colors ${
              settings.foldGutter
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateSettings({ readOnly: !settings.readOnly })}
            title={settings.readOnly ? '읽기 전용 해제' : '읽기 전용 활성화'}
            className={`p-1.5 rounded-md border transition-colors ${
              settings.readOnly
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {settings.readOnly ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Right controls: Actions & View mode */}
      <div className="flex items-center gap-2">
        {/* Quick action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onFormat}
            title="코드 포맷팅"
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">정리</span>
          </button>

          <button
            onClick={onOpenSnippets}
            title="코드 스니펫 삽입"
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-md transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">스니펫</span>
          </button>

          <button
            onClick={onOpenSearch}
            title="검색 (Ctrl/Cmd+F)"
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 rounded-md transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onCopy}
            title="전체 코드 복사"
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-md transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">복사</span>
              </>
            )}
          </button>

          <button
            onClick={onDownload}
            title="파일 다운로드"
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

        {/* View Mode Segmented Control */}
        <div className="flex items-center p-0.5 bg-neutral-950 rounded-lg border border-neutral-800">
          <button
            onClick={() => onViewModeChange('editor')}
            title="에디터 전용"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
              viewMode === 'editor'
                ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">에디터</span>
          </button>

          <button
            onClick={() => onViewModeChange('split')}
            title="분할 뷰"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
              viewMode === 'split'
                ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">분할</span>
          </button>

          <button
            onClick={() => onViewModeChange('preview')}
            title="실행 / 인스펙터 전용"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
              viewMode === 'preview'
                ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">미리보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
