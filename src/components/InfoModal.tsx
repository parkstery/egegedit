import React from 'react';
import { X, Keyboard, BookOpen, Layers, Check } from 'lucide-react';

export type InfoModalType = 'shortcuts' | 'architecture' | 'guide' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            {type === 'shortcuts' && <Keyboard className="w-5 h-5 text-indigo-400" />}
            {type === 'architecture' && <Layers className="w-5 h-5 text-emerald-400" />}
            {type === 'guide' && <BookOpen className="w-5 h-5 text-amber-400" />}
            <h2 className="text-base font-semibold text-neutral-100">
              {type === 'shortcuts' && '에디터 단축키 안내'}
              {type === 'architecture' && 'CodeMirror 6 내부 아키텍처'}
              {type === 'guide' && '실시간 구문 하이라이팅 가이드'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-neutral-300 space-y-4">
          {type === 'shortcuts' && (
            <div className="space-y-3">
              <p className="text-neutral-400">
                CodeMirror 6 표준 키맵이 적용되어 있어 브라우저 안에서도 IDE 수준의 생산성을 누릴 수 있습니다.
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800 flex justify-between items-center">
                  <span className="text-neutral-300 font-sans">검색 및 바꾸기</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-200 text-[11px]">
                    Ctrl/Cmd + F
                  </kbd>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800 flex justify-between items-center">
                  <span className="text-neutral-300 font-sans">실행 취소 (Undo)</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-200 text-[11px]">
                    Ctrl/Cmd + Z
                  </kbd>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800 flex justify-between items-center">
                  <span className="text-neutral-300 font-sans">다시 실행 (Redo)</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-200 text-[11px]">
                    Ctrl/Cmd + Y
                  </kbd>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800 flex justify-between items-center">
                  <span className="text-neutral-300 font-sans">자동 완성 호출</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-200 text-[11px]">
                    Ctrl + Space
                  </kbd>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800 flex justify-between items-center">
                  <span className="text-neutral-300 font-sans">코드 블록 접기</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-200 text-[11px]">
                    Ctrl + Shift + [
                  </kbd>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded border border-neutral-800 flex justify-between items-center">
                  <span className="text-neutral-300 font-sans">들여쓰기</span>
                  <kbd className="px-2 py-0.5 bg-neutral-800 rounded border border-neutral-700 text-neutral-200 text-[11px]">
                    Tab / Shift+Tab
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {type === 'architecture' && (
            <div className="space-y-3">
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <div className="font-semibold text-emerald-400">1. 불변 상태(EditorState)와 트랜잭션</div>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  상태를 직접 변경하지 않고, 모든 타이핑 및 선택 변경은 Transaction을 통해 새로운 불변 EditorState를 산출합니다.
                </p>
              </div>

              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <div className="font-semibold text-sky-400">2. 컴파트먼트 (Compartment) 동적 구성</div>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  에디터 전체를 다시 마운트하지 않고도 테마, 언어 문법 하이라이터, 탭 크기 등을 단일 트랜잭션 효과로 실시간 교체합니다.
                </p>
              </div>

              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-1">
                <div className="font-semibold text-purple-400">3. 가상 뷰포트 (Virtual Viewport)</div>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  화면에 표시되는 영역의 DOM 노드만 마운트하므로 수만 줄의 소스 코드에서도 부드러운 스크롤 성능을 유지합니다.
                </p>
              </div>
            </div>
          )}

          {type === 'guide' && (
            <div className="space-y-3">
              <p className="text-neutral-400">
                CodeMirror 6의 실시간 문법 하이라이팅은 <strong>Lezer 파서</strong>를 핵심 엔진으로 삼습니다.
              </p>

              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 space-y-2">
                <div className="font-semibold text-neutral-200">하이라이트 태그 분류 체계 (@lezer/highlight)</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-pink-400">
                    <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                    <span>t.keyword (import, const, def)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>t.function (함수 호출/정의)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-yellow-300">
                    <span className="w-2 h-2 rounded-full bg-yellow-300 shrink-0" />
                    <span>t.string ("텍스트", '리터럴')</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-400">
                    <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                    <span>t.typeName (타입, 클래스명)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400 italic">
                    <span className="w-2 h-2 rounded-full bg-neutral-500 shrink-0" />
                    <span>t.comment (주석 라인)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-400">
                    <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                    <span>t.number (숫자 및 불리언)</span>
                  </div>
                </div>
              </div>

              <p className="text-neutral-400 text-[11px]">
                우측 패널의 <strong>[AST 구문 인스펙터]</strong>에서 현재 커서가 위치한 토큰의 Lezer 노드 명칭과 깊이를 실시간으로 모니터링할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>확인</span>
          </button>
        </div>
      </div>
    </div>
  );
};
