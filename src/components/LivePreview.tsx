import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FileText,
  FileJson,
  Layers,
  Terminal,
} from 'lucide-react';
import { SupportedLanguage, SyntaxNodeInfo, CursorPosition } from '../types/editor';
import { SyntaxInspector } from './SyntaxInspector';

interface LivePreviewProps {
  code: string;
  language: SupportedLanguage;
  nodeInfo: SyntaxNodeInfo | null;
  cursorPos: CursorPosition;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  code,
  language,
  nodeInfo,
  cursorPos,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'ast'>('preview');
  const [iframeKey, setIframeKey] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Reset console logs when refreshing
  const handleRefresh = () => {
    setConsoleLogs([]);
    setIframeKey((prev) => prev + 1);
  };

  // Compile sandbox for HTML / CSS / JS / TS
  const iframeContent = useMemo(() => {
    if (language === 'html') {
      return code;
    }
    if (language === 'css') {
      return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; }
    ${code}
  </style>
</head>
<body>
  <div class="studio-container">
    <div class="interactive-panel" style="padding: 20px;">
      <h2>CSS 스타일 미리보기</h2>
      <p>에디터에서 작성한 CSS 규칙이 실시간으로 본 요소들에 적용됩니다.</p>
      <button style="padding: 8px 16px; background: var(--primary-color, #6366f1); color: white; border: none; border-radius: 6px; cursor: pointer;">
        버튼 예시
      </button>
    </div>
  </div>
</body>
</html>`;
    }
    if (language === 'javascript' || language === 'typescript') {
      // Create a runnable sandbox wrapper with trapped console
      const cleanScript = code
        .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
        .replace(/export\s+default\s+/g, '')
        .replace(/export\s+/g, '');

      return `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 16px;
      background: #090d16;
      color: #e2e8f0;
      font-size: 13px;
    }
    #root { padding: 12px; }
  </style>
</head>
<body>
  <div id="root">
    <div style="color: #94a3b8; margin-bottom: 8px;">[자바스크립트 실행 환경 콘솔]</div>
    <div id="output" style="font-family: monospace; line-height: 1.6; white-space: pre-wrap;"></div>
  </div>
  <script>
    const output = document.getElementById('output');
    function logToScreen(type, ...args) {
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
      const line = document.createElement('div');
      line.style.color = type === 'error' ? '#f87171' : type === 'warn' ? '#fbbf24' : '#34d399';
      line.textContent = '> ' + msg;
      output.appendChild(line);
      window.parent.postMessage({ type: 'LOG', message: msg }, '*');
    }
    console.log = (...args) => logToScreen('log', ...args);
    console.error = (...args) => logToScreen('error', ...args);
    console.warn = (...args) => logToScreen('warn', ...args);

    try {
      ${cleanScript}
    } catch(err) {
      console.error(err.toString());
    }
  </script>
</body>
</html>`;
    }

    return '';
  }, [code, language]);

  // Listen to iframe console messages
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === 'LOG') {
        setConsoleLogs((prev) => [...prev.slice(-15), e.data.message]);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  // JSON Validation & Formatting
  const parsedJson = useMemo(() => {
    if (language !== 'json') return null;
    try {
      const obj = JSON.parse(code);
      return { valid: true, data: obj, error: null };
    } catch (err: unknown) {
      return { valid: false, data: null, error: (err as Error).message };
    }
  }, [code, language]);

  // Markdown parsing (clean built-in lightweight renderer)
  const renderedMarkdown = useMemo(() => {
    if (language !== 'markdown') return '';
    // Process markdown headers, bold, italics, tables, code
    const lines = code.split('\n');
    let html = '';
    let inTable = false;

    lines.forEach((line) => {
      if (line.startsWith('# ')) {
        html += `<h1 class="text-xl font-bold text-neutral-100 mt-4 mb-2 pb-1 border-b border-neutral-800">${line.slice(2)}</h1>`;
      } else if (line.startsWith('## ')) {
        html += `<h2 class="text-lg font-bold text-neutral-200 mt-3 mb-2">${line.slice(3)}</h2>`;
      } else if (line.startsWith('### ')) {
        html += `<h3 class="text-sm font-semibold text-neutral-300 mt-2 mb-1">${line.slice(4)}</h3>`;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        html += `<li class="ml-4 list-disc text-neutral-300 text-xs my-0.5">${line.slice(2)}</li>`;
      } else if (line.includes('|') && line.trim().startsWith('|')) {
        if (!inTable) {
          inTable = true;
          html += '<table class="w-full text-xs text-left border-collapse my-3 border border-neutral-800">';
        }
        const cells = line.split('|').filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1);
        if (line.includes('---')) {
          // divider row
        } else {
          html += '<tr class="border-b border-neutral-800">';
          cells.forEach((c) => {
            html += `<td class="p-2 border-r border-neutral-800 text-neutral-300 font-mono">${c.trim()}</td>`;
          });
          html += '</tr>';
        }
      } else if (line.trim() === '') {
        if (inTable) {
          inTable = false;
          html += '</table>';
        }
        html += '<div class="h-2"></div>';
      } else {
        if (inTable) {
          inTable = false;
          html += '</table>';
        }
        // Bold and backticks
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-100">$1</strong>')
          .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-[11px] text-indigo-300">$1</code>');
        html += `<p class="text-xs text-neutral-300 leading-relaxed my-1">${formatted}</p>`;
      }
    });

    if (inTable) html += '</table>';
    return html;
  }, [code, language]);

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-800 text-xs">
      {/* Top tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-950">
        <div className="flex items-center gap-1 p-0.5 bg-neutral-900 rounded-md border border-neutral-800">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>실시간 샌드박스</span>
          </button>
          <button
            onClick={() => setActiveTab('ast')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'ast'
                ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>AST 구문 인스펙터</span>
          </button>
        </div>

        {activeTab === 'preview' && (
          <button
            onClick={handleRefresh}
            title="새로고침"
            className="flex items-center gap-1 px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded text-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-neutral-400" />
            <span>재실행</span>
          </button>
        )}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'ast' ? (
          <SyntaxInspector
            nodeInfo={nodeInfo}
            cursorPos={cursorPos}
            language={language}
            codeLength={code.length}
          />
        ) : (
          <div className="h-full flex flex-col">
            {/* HTML / CSS / JS / TS Sandbox */}
            {(language === 'html' || language === 'css' || language === 'javascript' || language === 'typescript') && (
              <div className="flex-1 flex flex-col h-full bg-neutral-950">
                <div className="flex-1 relative">
                  <iframe
                    key={iframeKey}
                    title="Live Code Runner"
                    srcDoc={iframeContent}
                    sandbox="allow-scripts allow-modals"
                    className="w-full h-full border-none bg-neutral-950"
                  />
                </div>

                {/* Console logs if available */}
                {consoleLogs.length > 0 && (
                  <div className="h-32 border-t border-neutral-800 bg-neutral-900/90 p-2 overflow-y-auto font-mono text-[11px]">
                    <div className="flex items-center gap-1 text-neutral-400 mb-1 font-semibold">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span>출력 로그</span>
                    </div>
                    {consoleLogs.map((log, i) => (
                      <div key={i} className="text-emerald-300">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Markdown Preview */}
            {language === 'markdown' && (
              <div className="flex-1 overflow-y-auto p-4 bg-neutral-950">
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                />
              </div>
            )}

            {/* JSON Viewer */}
            {language === 'json' && parsedJson && (
              <div className="flex-1 overflow-y-auto p-4 bg-neutral-950 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="font-semibold text-neutral-300">JSON 구조 검증</span>
                  {parsedJson.valid ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" /> 유효한 JSON 구문
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400">
                      <AlertCircle className="w-3.5 h-3.5" /> 구문 오류
                    </span>
                  )}
                </div>

                {parsedJson.valid ? (
                  <pre className="p-3 bg-neutral-900 rounded-lg text-indigo-300 border border-neutral-800 overflow-x-auto">
                    {JSON.stringify(parsedJson.data, null, 2)}
                  </pre>
                ) : (
                  <div className="p-3 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-lg">
                    {parsedJson.error}
                  </div>
                )}
              </div>
            )}

            {/* Python / Other languages: AST analysis summary & stats */}
            {language === 'python' && (
              <div className="flex-1 overflow-y-auto p-4 bg-neutral-950 space-y-4">
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Python 3 구문 분석 및 구조</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    CodeMirror 6의 Python 확장은 들여쓰기 기반 블록 구조, 데코레이터, 함수/클래스 선언, 타입 어노테이션을 실시간으로 추적하여 하이라이팅을 입힙니다.
                  </p>
                </div>

                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2 font-mono text-[11px]">
                  <div className="text-neutral-400 font-sans font-semibold">코드 통계</div>
                  <div className="grid grid-cols-2 gap-2 text-neutral-300">
                    <div>라인 수: <span className="text-emerald-400">{code.split('\n').length}</span></div>
                    <div>문자 수: <span className="text-emerald-400">{code.length}</span></div>
                    <div>함수/클래스: <span className="text-emerald-400">{(code.match(/def |class /g) || []).length} 개</span></div>
                    <div>주석 라인: <span className="text-emerald-400">{(code.match(/#.*/g) || []).length} 개</span></div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                  <div>💡 상단의 <strong>[AST 구문 인스펙터]</strong> 탭을 누르면 실시간 파싱 트리와 커서 위치의 토큰을 확인할 수 있습니다.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
