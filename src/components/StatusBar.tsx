import React from 'react';
import { CursorPosition, SupportedLanguage, EditorThemeId } from '../types/editor';
import { THEMES } from '../themes/editorThemes';

interface StatusBarProps {
  cursorPos: CursorPosition;
  totalLines: number;
  totalChars: number;
  language: SupportedLanguage;
  tabSize: number;
  theme: EditorThemeId;
  readOnly: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  cursorPos,
  totalLines,
  totalChars,
  language,
  tabSize,
  theme,
  readOnly,
}) => {
  return (
    <footer className="h-7 border-t border-neutral-800 bg-neutral-950 px-3 flex items-center justify-between text-[11px] text-neutral-400 font-mono select-none">
      {/* Left: Cursor position & Metrics */}
      <div className="flex items-center gap-3">
        <span>
          줄 {cursorPos.line}, 열 {cursorPos.col}
        </span>
        {cursorPos.selectionLength > 0 && (
          <>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-indigo-400">({cursorPos.selectionLength}자 선택됨)</span>
          </>
        )}
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span>전체 {totalLines}줄</span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span>{totalChars.toLocaleString()}자</span>
        {readOnly && (
          <>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-amber-400 font-sans font-medium">읽기 전용</span>
          </>
        )}
      </div>

      {/* Right: Environment Info */}
      <div className="flex items-center gap-3">
        <span>공백: {tabSize}</span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span>UTF-8</span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span className="capitalize text-neutral-300 font-sans">{language}</span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span className="text-neutral-300 font-sans">{THEMES[theme]?.name || 'One Dark'}</span>
      </div>
    </footer>
  );
};
