/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import { openSearchPanel } from '@codemirror/search';
import { Download, Code2, Upload, FileText, CheckCircle2 } from 'lucide-react';

import { EditorFile, SupportedLanguage, EditorSettings, SyntaxNodeInfo } from './types/editor';
import { INITIAL_FILES, Snippet, detectLanguageFromFilename } from './languages/languages';
import { useCodeMirror } from './hooks/useCodeMirror';
import { FileTabs } from './components/FileTabs';
import { FileExplorer } from './components/FileExplorer';
import { EditorToolbar } from './components/EditorToolbar';
import { LivePreview } from './components/LivePreview';
import { StatusBar } from './components/StatusBar';
import { SnippetModal } from './components/SnippetModal';
import { InfoModal, InfoModalType } from './components/InfoModal';

export default function App() {
  const [files, setFiles] = useState<EditorFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('file-1');
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(true);
  const [isEditorDragging, setIsEditorDragging] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active file
  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || files[0];
  }, [files, activeFileId]);

  // Editor settings state
  const [settings, setSettings] = useState<EditorSettings>({
    theme: 'one-dark',
    fontSize: 14,
    lineWrapping: true,
    lineNumbers: true,
    foldGutter: true,
    highlightActiveLine: true,
    tabSize: 2,
    readOnly: false,
  });

  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('split');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  const [currentSyntaxNode, setCurrentSyntaxNode] = useState<SyntaxNodeInfo | null>(null);

  // Sync file content change handler
  const handleDocChange = useCallback((newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newContent } : f))
    );
  }, [activeFileId]);

  // Hook into CodeMirror 6 engine
  const {
    containerRef,
    viewRef,
    cursorPos,
    setDocument,
    insertCode,
    formatDocument,
  } = useCodeMirror({
    initialDoc: activeFile.content,
    language: activeFile.language,
    theme: settings.theme,
    fontSize: settings.fontSize,
    lineWrapping: settings.lineWrapping,
    lineNumbersEnabled: settings.lineNumbers,
    foldGutterEnabled: settings.foldGutter,
    highlightActiveLineEnabled: settings.highlightActiveLine,
    tabSize: settings.tabSize,
    readOnly: settings.readOnly,
    onChange: handleDocChange,
    onSyntaxNodeChange: setCurrentSyntaxNode,
  });

  // Switch file tab
  const handleSelectFile = useCallback((fileId: string) => {
    const target = files.find((f) => f.id === fileId);
    if (!target) return;
    setActiveFileId(fileId);
    setDocument(target.content);
  }, [files, setDocument]);

  // Handle files dragged and dropped from OS file explorer or picker
  const handleFilesDropped = useCallback(async (droppedFiles: FileList | File[]) => {
    const fileArray = Array.from(droppedFiles);
    if (fileArray.length === 0) return;

    const newFilesToAdd: EditorFile[] = [];

    for (const file of fileArray) {
      try {
        const text = await file.text();
        const detectedLang = detectLanguageFromFilename(file.name);
        const fileId = `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        newFilesToAdd.push({
          id: fileId,
          name: file.name,
          language: detectedLang,
          content: text,
        });
      } catch (err) {
        console.error('Failed to read file:', file.name, err);
      }
    }

    if (newFilesToAdd.length > 0) {
      setFiles((prev) => {
        // If file with same name exists, remove old one so it gets updated
        const newNames = new Set(newFilesToAdd.map((f) => f.name));
        const filtered = prev.filter((f) => !newNames.has(f.name));
        return [...filtered, ...newFilesToAdd];
      });

      // Open the latest dropped file in the editor
      const lastFile = newFilesToAdd[newFilesToAdd.length - 1];
      setActiveFileId(lastFile.id);
      setDocument(lastFile.content);

      // Show toast
      setToastMessage(
        newFilesToAdd.length === 1
          ? `'${lastFile.name}' 파일을 열었습니다.`
          : `${newFilesToAdd.length}개 파일을 탐색기에서 에디터로 열었습니다.`
      );
      setTimeout(() => setToastMessage(null), 3000);
    }
  }, [setDocument]);

  // Add new file
  const handleAddFile = useCallback((name: string, language: SupportedLanguage) => {
    const newFile: EditorFile = {
      id: `file-${Date.now()}`,
      name,
      language,
      content: `// ${name}\n// ${language} 파일이 생성되었습니다.\n\n`,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setDocument(newFile.content);
  }, [setDocument]);

  // Close file
  const handleCloseFile = useCallback((fileId: string) => {
    if (files.length <= 1) return;
    const remaining = files.filter((f) => f.id !== fileId);
    setFiles(remaining);
    if (activeFileId === fileId) {
      setActiveFileId(remaining[0].id);
      setDocument(remaining[0].content);
    }
  }, [files, activeFileId, setDocument]);

  // Duplicate file
  const handleDuplicateFile = useCallback((file: EditorFile) => {
    const copyName = file.name.replace(/(\.[^.]+)$/, '_copy$1');
    const newFile: EditorFile = {
      id: `file-${Date.now()}`,
      name: copyName,
      language: file.language,
      content: file.content,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setDocument(newFile.content);
  }, [setDocument]);

  // Change active language
  const handleLanguageChange = useCallback((newLang: SupportedLanguage) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, language: newLang } : f))
    );
  }, [activeFileId]);

  // Partial settings updater
  const handleUpdateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Copy code to clipboard
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(activeFile.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [activeFile.content]);

  // Download active file
  const handleDownload = useCallback(() => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeFile]);

  // Insert snippet
  const handleInsertSnippet = useCallback((snippet: Snippet) => {
    insertCode(snippet.code);
    if (snippet.language !== activeFile.language) {
      handleLanguageChange(snippet.language);
    }
  }, [insertCode, activeFile.language, handleLanguageChange]);

  // Open native CM6 search bar
  const handleOpenSearch = useCallback(() => {
    if (viewRef.current) {
      openSearchPanel(viewRef.current);
    }
  }, [viewRef]);

  // Reset to initial files
  const handleResetSample = useCallback(() => {
    setFiles(INITIAL_FILES);
    setActiveFileId('file-1');
    setDocument(INITIAL_FILES[0].content);
  }, [setDocument]);

  // Calculate file statistics
  const totalLines = useMemo(() => activeFile.content.split('\n').length, [activeFile.content]);
  const totalChars = useMemo(() => activeFile.content.length, [activeFile.content]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans">
      {/* Top Bar following Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 px-5 py-3 border-b border-neutral-800 bg-neutral-950 shrink-0">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-100">
            EG Edit
          </span>
        </div>

        {/* Zone 2: 4 nav links with working handlers */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
          <button
            onClick={() => setInfoModalType('architecture')}
            className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0"
          >
            에디터 소개
          </button>
          <button
            onClick={() => setInfoModalType('shortcuts')}
            className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0"
          >
            단축키 안내
          </button>
          <button
            onClick={() => setInfoModalType('guide')}
            className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0"
          >
            문법 가이드
          </button>
          <button
            onClick={handleResetSample}
            className="hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0"
          >
            샘플 불러오기
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-indigo-950"
          >
            <Download className="w-3.5 h-3.5" />
            <span>파일 내보내기</span>
          </button>
        </div>
      </header>

      {/* Editor Sub-Header: File Tabs */}
      <FileTabs
        files={files}
        activeFileId={activeFileId}
        onSelectFile={handleSelectFile}
        onCloseFile={handleCloseFile}
        onAddFile={handleAddFile}
        onDuplicateFile={handleDuplicateFile}
      />

      {/* Toolbar: Explorer toggle, Language, Theme, Font, Layout, Actions */}
      <EditorToolbar
        language={activeFile.language}
        onLanguageChange={handleLanguageChange}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onFormat={formatDocument}
        onOpenSearch={handleOpenSearch}
        onOpenSnippets={() => setIsSnippetModalOpen(true)}
        onCopy={handleCopy}
        onDownload={handleDownload}
        isCopied={isCopied}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isExplorerOpen={isExplorerOpen}
        onToggleExplorer={() => setIsExplorerOpen(!isExplorerOpen)}
      />

      {/* Main Workspace Body with Explorer Sidebar and Editor Canvas */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Left: File Explorer Sidebar (with Drag and Drop support) */}
        <FileExplorer
          files={files}
          activeFileId={activeFileId}
          onSelectFile={handleSelectFile}
          onCloseFile={handleCloseFile}
          onAddFile={handleAddFile}
          onDuplicateFile={handleDuplicateFile}
          onFilesDropped={handleFilesDropped}
          isOpen={isExplorerOpen}
          onToggle={() => setIsExplorerOpen(!isExplorerOpen)}
        />

        {/* Center/Right: Editor & Live Preview Canvas */}
        <main
          className="flex-1 min-h-0 flex overflow-hidden relative"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditorDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditorDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditorDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFilesDropped(e.dataTransfer.files);
            }
          }}
        >
          {/* CodeMirror 6 Editor Container */}
          <div
            className={`h-full overflow-hidden flex flex-col relative ${
              viewMode === 'editor'
                ? 'w-full'
                : viewMode === 'preview'
                ? 'hidden'
                : 'w-full lg:w-1/2 border-r border-neutral-800'
            }`}
          >
            <div ref={containerRef} className="flex-1 h-full overflow-hidden" />
          </div>

          {/* Live Preview / AST Inspector Container */}
          <div
            className={`h-full overflow-hidden flex flex-col ${
              viewMode === 'preview'
                ? 'w-full'
                : viewMode === 'editor'
                ? 'hidden'
                : 'hidden lg:flex lg:w-1/2'
            }`}
          >
            <LivePreview
              code={activeFile.content}
              language={activeFile.language}
              nodeInfo={currentSyntaxNode}
              cursorPos={cursorPos}
            />
          </div>

          {/* Global Drag-and-Drop Active Overlay over Editor */}
          {isEditorDragging && (
            <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-indigo-500 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-3 animate-pulse">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">
                파일을 에디터 창에 놓으세요
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                드래그한 파일이 즉시 에디터에 열리고 파일 확장자에 맞는 <strong>실시간 구문 하이라이팅</strong>이 바로 적용됩니다.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Status Bar */}
      <StatusBar
        cursorPos={cursorPos}
        totalLines={totalLines}
        totalChars={totalChars}
        language={activeFile.language}
        tabSize={settings.tabSize}
        theme={settings.theme}
        readOnly={settings.readOnly}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-700 text-neutral-200 rounded-lg shadow-xl text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Snippet Selection Modal */}
      <SnippetModal
        isOpen={isSnippetModalOpen}
        onClose={() => setIsSnippetModalOpen(false)}
        onInsertSnippet={handleInsertSnippet}
        currentLanguage={activeFile.language}
      />

      {/* Info & Help Modal */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </div>
  );
}
