import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  FileJson,
  Plus,
  X,
  Code2,
  Copy,
  FileType,
} from 'lucide-react';
import { EditorFile, SupportedLanguage } from '../types/editor';

interface FileTabsProps {
  files: EditorFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCloseFile: (fileId: string) => void;
  onAddFile: (name: string, language: SupportedLanguage) => void;
  onDuplicateFile: (file: EditorFile) => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCloseFile,
  onAddFile,
  onDuplicateFile,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLang, setNewFileLang] = useState<SupportedLanguage>('typescript');

  const getFileIcon = (lang: SupportedLanguage) => {
    switch (lang) {
      case 'typescript':
      case 'javascript':
        return <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'html':
        return <Code2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
      case 'css':
        return <FileType className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'json':
        return <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'python':
        return <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'markdown':
        return <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      default:
        return <FileCode className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
    }
  };

  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onAddFile(newFileName.trim(), newFileLang);
    setNewFileName('');
    setIsAdding(false);
  };

  return (
    <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-2 overflow-x-auto select-none">
      <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent'
              }`}
            >
              {getFileIcon(file.language)}
              <span>{file.name}</span>

              {files.length > 1 && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    title="파일 복제"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateFile(file);
                    }}
                    className="p-0.5 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    title="파일 닫기"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseFile(file.id);
                    }}
                    className="p-0.5 hover:bg-neutral-700 text-neutral-400 hover:text-rose-400 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {isAdding ? (
          <form
            onSubmit={handleCreateNewFile}
            className="flex items-center gap-1 px-2 py-1 bg-neutral-900 rounded border border-neutral-700 text-xs shrink-0"
          >
            <input
              type="text"
              autoFocus
              placeholder="예: helper.ts"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="bg-transparent text-neutral-100 outline-none w-28 px-1"
            />
            <select
              value={newFileLang}
              onChange={(e) => setNewFileLang(e.target.value as SupportedLanguage)}
              className="bg-neutral-800 text-neutral-300 text-[11px] rounded px-1 py-0.5 outline-none border border-neutral-700"
            >
              <option value="typescript">TS</option>
              <option value="javascript">JS</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="python">Python</option>
              <option value="markdown">MD</option>
            </select>
            <button
              type="submit"
              className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium"
            >
              추가
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-1.5 py-0.5 hover:bg-neutral-800 text-neutral-400 rounded text-[11px]"
            >
              취소
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 rounded transition-colors whitespace-nowrap shrink-0"
            title="새 파일 생성"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 파일</span>
          </button>
        )}
      </div>
    </div>
  );
};
