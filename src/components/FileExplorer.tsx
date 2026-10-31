import React, { useState, useRef } from 'react';
import {
  FolderTree,
  FileCode,
  FileText,
  FileJson,
  Code2,
  FileType,
  Plus,
  Upload,
  Search,
  Trash2,
  Copy,
  ChevronRight,
  FolderOpen,
  FileUp,
} from 'lucide-react';
import { EditorFile, SupportedLanguage } from '../types/editor';

interface FileExplorerProps {
  files: EditorFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCloseFile: (fileId: string) => void;
  onAddFile: (name: string, language: SupportedLanguage) => void;
  onDuplicateFile: (file: EditorFile) => void;
  onFilesDropped: (files: FileList | File[]) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCloseFile,
  onAddFile,
  onDuplicateFile,
  onFilesDropped,
  isOpen,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLang, setNewFileLang] = useState<SupportedLanguage>('typescript');
  const [isDragOverZone, setIsDragOverZone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'typescript':
      case 'javascript':
        return <FileCode className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'html':
        return <Code2 className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'css':
        return <FileType className="w-4 h-4 text-indigo-400 shrink-0" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'python':
        return <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'markdown':
        return <FileText className="w-4 h-4 text-purple-400 shrink-0" />;
      default:
        return <FileCode className="w-4 h-4 text-neutral-400 shrink-0" />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onAddFile(newFileName.trim(), newFileLang);
    setNewFileName('');
    setIsAdding(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverZone(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverZone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverZone(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesDropped(e.target.files);
      e.target.value = '';
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) {
    return (
      <div className="w-10 bg-neutral-950 border-r border-neutral-800 flex flex-col items-center py-3 shrink-0 select-none">
        <button
          onClick={onToggle}
          title="탐색기 창 열기"
          className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 rounded-lg transition-colors"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col h-full shrink-0 select-none relative transition-colors ${
        isDragOverZone ? 'bg-indigo-950/20 ring-2 ring-inset ring-indigo-500/50' : ''
      }`}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        className="hidden"
      />

      {/* Explorer Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-800/80 text-xs text-neutral-400 font-semibold tracking-wider">
        <div className="flex items-center gap-1.5 text-neutral-300">
          <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
          <span>탐색기</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAdding(!isAdding)}
            title="새 파일 생성"
            className="p-1 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="내 컴퓨터에서 파일 열기"
            className="p-1 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggle}
            title="탐색기 닫기"
            className="p-1 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-neutral-900">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-900/90 rounded border border-neutral-800 text-xs">
          <Search className="w-3 h-3 text-neutral-500 shrink-0" />
          <input
            type="text"
            placeholder="파일 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-neutral-200 placeholder:text-neutral-600 outline-none text-xs"
          />
        </div>
      </div>

      {/* Add File Inline Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-2 bg-neutral-900 border-b border-neutral-800 flex flex-col gap-1.5 text-xs"
        >
          <input
            type="text"
            autoFocus
            placeholder="파일명 (예: app.ts)"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="px-2 py-1 bg-neutral-950 border border-neutral-700 rounded text-neutral-100 outline-none"
          />
          <div className="flex items-center justify-between gap-1">
            <select
              value={newFileLang}
              onChange={(e) => setNewFileLang(e.target.value as SupportedLanguage)}
              className="bg-neutral-950 border border-neutral-700 text-neutral-300 rounded px-1.5 py-0.5 text-[11px] outline-none"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="python">Python</option>
              <option value="markdown">Markdown</option>
            </select>
            <div className="flex items-center gap-1">
              <button
                type="submit"
                className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium"
              >
                생성
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-1.5 py-0.5 text-neutral-400 hover:text-neutral-200 text-[11px]"
              >
                취소
              </button>
            </div>
          </div>
        </form>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        <div className="px-2 py-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
          프로젝트 파일 ({filteredFiles.length})
        </div>

        {filteredFiles.map((file) => {
          const isActive = file.id === activeFileId;
          const lineCount = file.content.split('\n').length;
          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-colors text-xs ${
                isActive
                  ? 'bg-neutral-800 text-neutral-100 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-1">
                {getFileIcon(file.language)}
                <span className="truncate">{file.name}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-neutral-500 font-mono group-hover:hidden">
                  {lineCount}줄
                </span>

                <div className="hidden group-hover:flex items-center gap-0.5">
                  <button
                    title="복제"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateFile(file);
                    }}
                    className="p-1 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {files.length > 1 && (
                    <button
                      title="삭제"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseFile(file.id);
                      }}
                      className="p-1 hover:bg-neutral-700 text-neutral-400 hover:text-rose-400 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredFiles.length === 0 && (
          <div className="py-6 text-center text-xs text-neutral-600">
            일치하는 파일이 없습니다.
          </div>
        )}
      </div>

      {/* Explorer Drag & Drop Zone Footer */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`p-3 m-2 rounded-lg border-2 border-dashed transition-all cursor-pointer text-center ${
          isDragOverZone
            ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300 scale-[0.99]'
            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-neutral-300'
        }`}
      >
        <FileUp className="w-5 h-5 mx-auto mb-1.5 text-indigo-400" />
        <p className="text-[11px] font-medium leading-snug">
          탐색기 창에 파일 드래그
        </p>
        <p className="text-[10px] text-neutral-500 mt-0.5">
          여기에 놓으면 에디터에서 즉시 열립니다
        </p>
      </div>

      {/* Drag Over Active Overlay */}
      {isDragOverZone && (
        <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center border-2 border-indigo-500 rounded-none pointer-events-none">
          <Upload className="w-8 h-8 text-indigo-300 mb-2 animate-bounce" />
          <p className="text-sm font-bold text-white">파일을 놓으세요!</p>
          <p className="text-xs text-indigo-200 mt-1">
            에디터 창에서 자동으로 열리고 구문 하이라이팅이 적용됩니다.
          </p>
        </div>
      )}
    </aside>
  );
};
