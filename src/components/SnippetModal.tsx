import React from 'react';
import { X, Code2, Plus } from 'lucide-react';
import { CODE_SNIPPETS, Snippet } from '../languages/languages';
import { SupportedLanguage } from '../types/editor';

interface SnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet: (snippet: Snippet) => void;
  currentLanguage: SupportedLanguage;
}

export const SnippetModal: React.FC<SnippetModalProps> = ({
  isOpen,
  onClose,
  onInsertSnippet,
  currentLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-neutral-100">
              코드 스니펫 라이브러리
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snippets List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-xs text-neutral-400">
            원하는 스니펫을 선택하면 현재 커서 위치에 바로 코드가 삽입되며, CodeMirror 6의 실시간 문법 하이라이팅이 즉시 적용됩니다.
          </p>

          <div className="space-y-3">
            {CODE_SNIPPETS.map((snippet) => {
              const matchesLang = snippet.language === currentLanguage;
              return (
                <div
                  key={snippet.id}
                  className={`p-4 rounded-lg border transition-all ${
                    matchesLang
                      ? 'border-indigo-500/40 bg-indigo-950/20'
                      : 'border-neutral-800 bg-neutral-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-100">
                          {snippet.title}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400 uppercase">
                          {snippet.language}
                        </span>
                        {matchesLang && (
                          <span className="text-[11px] text-indigo-400">
                            (현재 언어 일치)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {snippet.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onInsertSnippet(snippet);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>삽입하기</span>
                    </button>
                  </div>

                  {/* Code snippet preview */}
                  <pre className="p-2.5 rounded bg-neutral-900 border border-neutral-800/80 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-28">
                    {snippet.code}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
