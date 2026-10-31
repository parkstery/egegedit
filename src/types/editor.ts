export type SupportedLanguage = 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'python' | 'markdown';

export type EditorThemeId = 'one-dark' | 'dracula' | 'nord' | 'github-dark' | 'github-light';

export interface EditorFile {
  id: string;
  name: string;
  language: SupportedLanguage;
  content: string;
  readOnly?: boolean;
}

export interface CursorPosition {
  line: number;
  col: number;
  offset: number;
  selectionLength: number;
}

export interface SyntaxNodeInfo {
  name: string;
  from: number;
  to: number;
  depth: number;
  text: string;
  parentName?: string;
}

export interface EditorSettings {
  theme: EditorThemeId;
  fontSize: number;
  lineWrapping: boolean;
  lineNumbers: boolean;
  foldGutter: boolean;
  highlightActiveLine: boolean;
  tabSize: number;
  readOnly: boolean;
}
