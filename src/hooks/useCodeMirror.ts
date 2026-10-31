import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorState, Compartment, Extension } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  ViewUpdate,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { foldGutter, foldKeymap, bracketMatching, indentOnInput, syntaxTree } from '@codemirror/language';
import { autocompletion, completionKeymap, closeBrackets } from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';

import { SupportedLanguage, EditorThemeId, CursorPosition, SyntaxNodeInfo } from '../types/editor';
import { getLanguageExtension } from '../languages/languages';
import { THEMES } from '../themes/editorThemes';

export interface UseCodeMirrorProps {
  initialDoc: string;
  language: SupportedLanguage;
  theme: EditorThemeId;
  fontSize: number;
  lineWrapping: boolean;
  lineNumbersEnabled: boolean;
  foldGutterEnabled: boolean;
  highlightActiveLineEnabled: boolean;
  tabSize: number;
  readOnly: boolean;
  onChange?: (code: string) => void;
  onCursorMove?: (cursor: CursorPosition) => void;
  onSyntaxNodeChange?: (nodeInfo: SyntaxNodeInfo | null) => void;
}

export function useCodeMirror({
  initialDoc,
  language,
  theme,
  fontSize,
  lineWrapping,
  lineNumbersEnabled,
  foldGutterEnabled,
  highlightActiveLineEnabled,
  tabSize,
  readOnly,
  onChange,
  onCursorMove,
  onSyntaxNodeChange,
}: UseCodeMirrorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Compartments for dynamic runtime reconfiguration without recreating the EditorView
  const languageCompartment = useRef(new Compartment());
  const themeCompartment = useRef(new Compartment());
  const lineWrappingCompartment = useRef(new Compartment());
  const tabSizeCompartment = useRef(new Compartment());
  const readOnlyCompartment = useRef(new Compartment());
  const lineNumbersCompartment = useRef(new Compartment());
  const foldGutterCompartment = useRef(new Compartment());
  const activeLineCompartment = useRef(new Compartment());
  const fontSizeCompartment = useRef(new Compartment());

  const [cursorPos, setCursorPos] = useState<CursorPosition>({
    line: 1,
    col: 1,
    offset: 0,
    selectionLength: 0,
  });

  const [activeNode, setActiveNode] = useState<SyntaxNodeInfo | null>(null);

  // Store latest callbacks to prevent recreating editor extensions
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onCursorMoveRef = useRef(onCursorMove);
  onCursorMoveRef.current = onCursorMove;
  const onSyntaxNodeChangeRef = useRef(onSyntaxNodeChange);
  onSyntaxNodeChangeRef.current = onSyntaxNodeChange;

  // Initialize CodeMirror 6 EditorView
  useEffect(() => {
    if (!containerRef.current) return;

    const baseTheme = EditorView.theme({
      '&': {
        height: '100%',
        fontSize: `${fontSize}px`,
      },
      '.cm-scroller': {
        fontFamily: 'var(--font-mono)',
        lineHeight: '1.6',
      },
    });

    const updateListener = EditorView.updateListener.of((update: ViewUpdate) => {
      // 1. Doc content change
      if (update.docChanged) {
        const newDoc = update.state.doc.toString();
        onChangeRef.current?.(newDoc);
      }

      // 2. Selection or cursor change
      if (update.selectionSet || update.docChanged) {
        const { main } = update.state.selection;
        const line = update.state.doc.lineAt(main.head);
        const posInfo: CursorPosition = {
          line: line.number,
          col: main.head - line.from + 1,
          offset: main.head,
          selectionLength: Math.abs(main.to - main.from),
        };
        setCursorPos(posInfo);
        onCursorMoveRef.current?.(posInfo);

        // 3. Inspect Lezer AST syntax tree node at current position
        try {
          const tree = syntaxTree(update.state);
          const node = tree.resolveInner(main.head, 1);
          if (node) {
            let depth = 0;
            let curr = node.parent;
            while (curr) {
              depth++;
              curr = curr.parent;
            }
            const snippet = update.state.sliceDoc(node.from, Math.min(node.to, node.from + 60));
            const syntaxInfo: SyntaxNodeInfo = {
              name: node.name,
              from: node.from,
              to: node.to,
              depth,
              text: snippet,
              parentName: node.parent?.name,
            };
            setActiveNode(syntaxInfo);
            onSyntaxNodeChangeRef.current?.(syntaxInfo);
          } else {
            setActiveNode(null);
            onSyntaxNodeChangeRef.current?.(null);
          }
        } catch {
          // Graceful fallback if AST is unavailable
        }
      }
    });

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        // Dynamic compartments
        languageCompartment.current.of(getLanguageExtension(language)),
        themeCompartment.current.of(THEMES[theme]?.extension || THEMES['one-dark'].extension),
        lineWrappingCompartment.current.of(lineWrapping ? EditorView.lineWrapping : []),
        tabSizeCompartment.current.of(EditorState.tabSize.of(tabSize)),
        readOnlyCompartment.current.of(EditorState.readOnly.of(readOnly)),
        lineNumbersCompartment.current.of(lineNumbersEnabled ? lineNumbers() : []),
        foldGutterCompartment.current.of(foldGutterEnabled ? foldGutter() : []),
        activeLineCompartment.current.of(highlightActiveLineEnabled ? [highlightActiveLine(), highlightActiveLineGutter()] : []),
        fontSizeCompartment.current.of(baseTheme),

        // Core features & highlighters
        highlightSpecialChars(),
        history(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightSelectionMatches(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...searchKeymap,
          indentWithTab,
        ]),
        updateListener,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only re-mount if the container element changes
  }, [containerRef]);

  // Dynamic updates using Compartments
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: languageCompartment.current.reconfigure(getLanguageExtension(language)),
    });
  }, [language]);

  useEffect(() => {
    if (!viewRef.current) return;
    const themeExtension = THEMES[theme]?.extension || THEMES['one-dark'].extension;
    viewRef.current.dispatch({
      effects: themeCompartment.current.reconfigure(themeExtension),
    });
  }, [theme]);

  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: lineWrappingCompartment.current.reconfigure(lineWrapping ? EditorView.lineWrapping : []),
    });
  }, [lineWrapping]);

  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: tabSizeCompartment.current.reconfigure(EditorState.tabSize.of(tabSize)),
    });
  }, [tabSize]);

  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: readOnlyCompartment.current.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  }, [readOnly]);

  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: lineNumbersCompartment.current.reconfigure(lineNumbersEnabled ? lineNumbers() : []),
    });
  }, [lineNumbersEnabled]);

  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: foldGutterCompartment.current.reconfigure(foldGutterEnabled ? foldGutter() : []),
    });
  }, [foldGutterEnabled]);

  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: activeLineCompartment.current.reconfigure(
        highlightActiveLineEnabled ? [highlightActiveLine(), highlightActiveLineGutter()] : []
      ),
    });
  }, [highlightActiveLineEnabled]);

  useEffect(() => {
    if (!viewRef.current) return;
    const fontTheme = EditorView.theme({
      '&': {
        height: '100%',
        fontSize: `${fontSize}px`,
      },
    });
    viewRef.current.dispatch({
      effects: fontSizeCompartment.current.reconfigure(fontTheme),
    });
  }, [fontSize]);

  // Method to safely set document content from outside
  const setDocument = useCallback((newDoc: string) => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== newDoc) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: newDoc },
      });
    }
  }, []);

  // Method to insert code at current cursor
  const insertCode = useCallback((codeSnippet: string) => {
    const view = viewRef.current;
    if (!view) return;
    const { main } = view.state.selection;
    view.dispatch({
      changes: { from: main.from, to: main.to, insert: codeSnippet },
      selection: { anchor: main.from + codeSnippet.length },
    });
    view.focus();
  }, []);

  // Format code (basic indentation reformat)
  const formatDocument = useCallback(() => {
    const view = viewRef.current;
    if (!view) return;
    const doc = view.state.doc.toString();
    if (language === 'json') {
      try {
        const parsed = JSON.parse(doc);
        const formatted = JSON.stringify(parsed, null, tabSize);
        setDocument(formatted);
      } catch {
        // invalid json, keep as is
      }
    } else {
      // Clean trailing spaces on lines
      const cleaned = doc
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n');
      setDocument(cleaned);
    }
  }, [language, tabSize, setDocument]);

  return {
    containerRef,
    viewRef,
    cursorPos,
    activeNode,
    setDocument,
    insertCode,
    formatDocument,
  };
}
