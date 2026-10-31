import React from 'react';
import {
  Layers,
  Sparkles,
  Braces,
  Cpu,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { SyntaxNodeInfo, CursorPosition, SupportedLanguage } from '../types/editor';

interface SyntaxInspectorProps {
  nodeInfo: SyntaxNodeInfo | null;
  cursorPos: CursorPosition;
  language: SupportedLanguage;
  codeLength: number;
}

export const SyntaxInspector: React.FC<SyntaxInspectorProps> = ({
  nodeInfo,
  cursorPos,
  language,
  codeLength,
}) => {
  return (
    <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-800 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Lezer AST 구문 인스펙터</span>
        </div>
        <span className="text-[11px] text-neutral-400 font-mono">
          CM6 Incremental Engine
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Active Syntax Token Card */}
        <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-[11px] uppercase tracking-wider font-medium">
              커서 위치 토큰 (AST Node)
            </span>
            <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-indigo-950/80 border border-indigo-700/60 text-indigo-300">
              Depth: {nodeInfo?.depth ?? 0}
            </span>
          </div>

          {nodeInfo ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {nodeInfo.name || 'AnonymousNode'}
                </span>
                {nodeInfo.parentName && (
                  <span className="text-neutral-500 font-mono text-[11px]">
                    부모: {nodeInfo.parentName}
                  </span>
                )}
              </div>

              {/* Token Snippet */}
              <div className="p-2 bg-neutral-900 rounded border border-neutral-800 font-mono text-neutral-200 break-all">
                <span className="text-neutral-500 mr-2 text-[10px]">Snippet:</span>
                "{nodeInfo.text || '(공백 또는 경계)'}"
              </div>

              {/* Range & Offsets */}
              <div className="grid grid-cols-2 gap-2 text-neutral-400 font-mono text-[11px]">
                <div>
                  <span className="text-neutral-500">범위: </span>
                  [{nodeInfo.from} ~ {nodeInfo.to}]
                </div>
                <div>
                  <span className="text-neutral-500">길이: </span>
                  {nodeInfo.to - nodeInfo.from} 문자
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-neutral-500 italic">
              에디터 본문을 클릭하거나 커서를 이동하여 토큰을 확인하세요.
            </div>
          )}
        </div>

        {/* Real-time Highlighting Mechanics */}
        <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5 text-neutral-200 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>CodeMirror 6 하이라이팅 원리</span>
          </div>
          <p className="text-neutral-400 leading-relaxed text-[11px]">
            정규식(RegEx) 기반의 구형 에디터와 달리, CodeMirror 6는 <strong>Lezer 증분 파서</strong>를 사용합니다. 
            타이핑할 때 변경된 구문 노드만 즉각 부분 재파싱하여 <strong>수십만 줄의 코드에서도 끊김 없는 60fps</strong> 실시간 문법 하이라이팅을 보장합니다.
          </p>

          <div className="pt-2 border-t border-neutral-900 flex flex-col gap-1 text-[11px] text-neutral-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>선택된 언어: <strong className="text-neutral-100 uppercase">{language}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>전체 문서 크기: <span className="font-mono">{codeLength.toLocaleString()} 자</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>현재 커서: <span className="font-mono">줄 {cursorPos.line}, 열 {cursorPos.col}</span></span>
            </div>
          </div>
        </div>

        {/* Architecture Details */}
        <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 space-y-2 text-neutral-400 text-[11px]">
          <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>아키텍처 스펙</span>
          </div>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong>EditorState</strong>: 불변(Immutable) 상태 트리</li>
            <li><strong>Transaction</strong>: 상태 변화 트랜잭션 디스패치</li>
            <li><strong>Compartment</strong>: 테마 및 언어 실시간 무중단 핫 리로드</li>
            <li><strong>ViewUpdate</strong>: 뷰포트 가상화 및 셀렉션 리스너</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
