import { Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { markdown } from '@codemirror/lang-markdown';
import { SupportedLanguage, EditorFile } from '../types/editor';

export function getLanguageExtension(language: SupportedLanguage): Extension {
  switch (language) {
    case 'javascript':
      return javascript({ jsx: true, typescript: false });
    case 'typescript':
      return javascript({ jsx: true, typescript: true });
    case 'html':
      return html();
    case 'css':
      return css();
    case 'json':
      return json();
    case 'python':
      return python();
    case 'markdown':
      return markdown();
    default:
      return javascript({ jsx: true, typescript: true });
  }
}

export const LANGUAGE_OPTIONS: { id: SupportedLanguage; label: string; ext: string }[] = [
  { id: 'typescript', label: 'TypeScript (TSX)', ext: '.tsx' },
  { id: 'javascript', label: 'JavaScript (JSX)', ext: '.jsx' },
  { id: 'html', label: 'HTML5', ext: '.html' },
  { id: 'css', label: 'CSS3', ext: '.css' },
  { id: 'json', label: 'JSON', ext: '.json' },
  { id: 'python', label: 'Python 3', ext: '.py' },
  { id: 'markdown', label: 'Markdown', ext: '.md' },
];

export const INITIAL_FILES: EditorFile[] = [
  {
    id: 'file-1',
    name: 'CounterComponent.tsx',
    language: 'typescript',
    content: `import React, { useState, useEffect, useMemo } from 'react';

interface MetricTrackerProps {
  initialCount?: number;
  step?: number;
  label: string;
}

/**
 * 실시간 상태 및 계산 메모이제이션 컴포넌트
 */
export const MetricTracker: React.FC<MetricTrackerProps> = ({
  initialCount = 0,
  step = 1,
  label,
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [history, setHistory] = useState<number[]>([initialCount]);

  const stats = useMemo(() => {
    const sum = history.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / (history.length || 1);
    const max = Math.max(...history);
    return { sum, avg: avg.toFixed(2), max };
  }, [history]);

  const handleIncrement = () => {
    setCount(prev => {
      const next = prev + step;
      setHistory(h => [...h, next]);
      return next;
    });
  };

  const handleReset = () => {
    setCount(0);
    setHistory([0]);
  };

  return (
    <div className="card p-6 rounded-xl border border-slate-700 bg-slate-900/60">
      <h2 className="text-xl font-bold text-slate-100">{label}</h2>
      <div className="my-4 text-4xl font-mono text-indigo-400 font-semibold">
        {count}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleIncrement}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium text-sm"
        >
          +{step} 증가
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium text-sm"
        >
          초기화
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono flex gap-4">
        <span>합계: {stats.sum}</span>
        <span>평균: {stats.avg}</span>
        <span>최대치: {stats.max}</span>
      </div>
    </div>
  );
};

export default MetricTracker;
`,
  },
  {
    id: 'file-2',
    name: 'styles.css',
    language: 'css',
    content: `:root {
  --primary-color: #6366f1;
  --primary-glow: rgba(99, 102, 241, 0.35);
  --surface-bg: #0f172a;
  --text-main: #f8fafc;
  --border-subtle: #334155;
}

@keyframes pulseGlow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px var(--primary-glow);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 35px var(--primary-glow);
  }
}

.studio-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background-color: var(--surface-bg);
  color: var(--text-main);
}

.interactive-panel {
  position: relative;
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(8px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.interactive-panel:hover {
  border-color: var(--primary-color);
  animation: pulseGlow 3s infinite ease-in-out;
}
`,
  },
  {
    id: 'file-3',
    name: 'analytics.py',
    language: 'python',
    content: `import statistics
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class TelemetryRecord:
    timestamp: datetime
    sensor_id: str
    temperature: float
    pressure: float
    status: str = "nominal"

class TelemetryAnalyzer:
    """실시간 센서 데이터 분석 엔진"""
    def __init__(self, threshold_temp: float = 85.0):
        self.threshold = threshold_temp
        self.records: List[TelemetryRecord] = []

    def ingest(self, record: TelemetryRecord) -> None:
        if record.temperature > self.threshold:
            record.status = "warning"
        self.records.append(record)

    def compute_summary(self) -> Dict[str, Any]:
        if not self.records:
            return {"count": 0, "status": "empty"}
        
        temps = [r.temperature for r in self.records]
        pressures = [r.pressure for r in self.records]
        
        return {
            "total_records": len(self.records),
            "temp_mean": round(statistics.mean(temps), 2),
            "temp_max": max(temps),
            "pressure_mean": round(statistics.mean(pressures), 2),
            "warnings_count": sum(1 for r in self.records if r.status == "warning")
        }

# 엔진 인스턴스화
analyzer = TelemetryAnalyzer(threshold_temp=80.0)
print("Telemetry analyzer initialized successfully.")
`,
  },
  {
    id: 'file-4',
    name: 'config.json',
    language: 'json',
    content: `{
  "application": "CodeMirror 6 Studio",
  "version": "6.0.1",
  "engine": "Lezer Incremental Parser",
  "features": {
    "syntaxHighlighting": true,
    "bracketMatching": true,
    "codeFolding": true,
    "autoCompletion": true,
    "linting": true,
    "multiThemeSupport": true
  },
  "supportedLanguages": [
    "typescript",
    "javascript",
    "python",
    "html",
    "css",
    "json",
    "markdown"
  ],
  "preferences": {
    "tabSize": 2,
    "fontSize": 14,
    "lineWrapping": true
  }
}
`,
  },
  {
    id: 'file-5',
    name: 'interactive.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Canvas Particle Flow</title>
  <style>
    body {
      margin: 0;
      background: #090d16;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #94a3b8;
      font-family: sans-serif;
    }
    canvas {
      border: 1px solid #1e293b;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
  </style>
</head>
<body>
  <canvas id="stage" width="480" height="260"></canvas>
  <p style="font-size: 13px; margin-top: 10px;">마우스를 캔버스 위로 움직여보세요</p>

  <script>
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    for(let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 3 + 1,
        color: ['#6366f1', '#38bdf8', '#818cf8', '#a855f7'][Math.floor(Math.random() * 4)]
      });
    }

    function render() {
      ctx.fillStyle = 'rgba(9, 13, 22, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw connections to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 100) {
          ctx.strokeStyle = p.color + '40';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    }
    render();
  </script>
</body>
</html>
`,
  },
  {
    id: 'file-6',
    name: 'README.md',
    language: 'markdown',
    content: `# CodeMirror 6 Architecture & Highlights

## 개요
CodeMirror 6는 이전 버전(v5)과 달리 **완전한 모듈형 함수형 아키텍처**로 재설계되었습니다.

### 주요 핵심 특징
- **Lezer Incremental Parser**: 타이핑 즉시 전체 파일을 재파싱하지 않고 변경된 부분만 실시간으로 증분 파싱하여 문법 하이라이팅을 제공합니다.
- **불변 상태 모델 (Immutable State)**: Redux처럼 \`EditorState\`는 불변이며, 모든 편집은 \`Transaction\`을 통해 이루어집니다.
- **컴파트먼트 (Compartment)**: 테마, 언어, 탭 크기 등 동적으로 전환 가능한 설정을 독립적으로 핫 리로드(Hot-reload)합니다.
- **가상 뷰포트 (View Virtualization)**: 10만 줄 이상의 초대용량 코드도 현재 화면에 보이는 줄만 DOM에 렌더링하여 초당 60fps를 유지합니다.

---

### 언어 지원 매트릭스
| 언어 | 파서 | JSX / TSX 지원 | 실시간 하이라이팅 |
| :--- | :--- | :---: | :---: |
| **TypeScript** | Lezer TSX | 지원 | 즉시 반응 |
| **JavaScript** | Lezer JS | 지원 | 즉시 반응 |
| **Python** | Lezer Python | N/A | 들여쓰기 & 키워드 |
| **HTML5** | Lezer HTML | 임베디드 JS/CSS | 태그 & 어트리뷰트 |
| **CSS3** | Lezer CSS | 가상 클래스 | 컬러 & 선택자 |
| **JSON** | Lezer JSON | 키/값 검증 | 구문 색상 |
| **Markdown** | Lezer MD | 테이블/인라인 코드 | 제목 & 서식 |
`,
  },
];

export interface Snippet {
  id: string;
  title: string;
  language: SupportedLanguage;
  description: string;
  code: string;
}

export const CODE_SNIPPETS: Snippet[] = [
  {
    id: 'react-custom-hook',
    title: 'useDebounce Custom Hook',
    language: 'typescript',
    description: 'React 입력 지연 처리 훅',
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
  },
  {
    id: 'async-fetch-handler',
    title: 'Resilient Fetch Wrapper',
    language: 'typescript',
    description: '타입스크립트 비동기 API 요청 래퍼',
    code: `interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export async function fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return (await response.json()) as T;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error('Retries exhausted');
}`,
  },
  {
    id: 'python-decorator',
    title: 'Execution Timer Decorator',
    language: 'python',
    description: '함수 실행 시간 측정 데코레이터',
    code: `import time
from functools import wraps

def measure_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = (time.perf_counter() - start) * 1000
        print(f"[{func.__name__}] 실행 시간: {duration:.2f}ms")
        return result
    return wrapper

@measure_time
def compute_heavy_task(n: int) -> int:
    return sum(i * i for i in range(n))`,
  },
  {
    id: 'css-glassmorphism',
    title: 'Glassmorphism Card Style',
    language: 'css',
    description: '현대적인 유리 모피즘 카드 스타일',
    code: `.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
}`,
  },
];
