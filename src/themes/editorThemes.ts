import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorThemeId } from '../types/editor';

// 1. Dracula Theme
const draculaBase = EditorView.theme({
  '&': {
    color: '#f8f8f2',
    backgroundColor: '#282a36',
  },
  '.cm-content': {
    caretColor: '#ff79c6',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#ff79c6' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'rgba(68, 71, 90, 0.75)',
  },
  '.cm-panels': { backgroundColor: '#21222c', color: '#f8f8f2' },
  '.cm-panels.cm-panels-top': { borderBottom: '1px solid #44475a' },
  '.cm-panels.cm-panels-bottom': { borderTop: '1px solid #44475a' },
  '.cm-searchMatch': {
    backgroundColor: '#44475a',
    outline: '1px solid #ffb86c',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#6272a4',
  },
  '.cm-activeLine': { backgroundColor: 'rgba(68, 71, 90, 0.4)' },
  '.cm-selectionMatch': { backgroundColor: '#44475a' },
  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: '#44475a',
    outline: '1px solid #50fa7b',
  },
  '.cm-gutters': {
    backgroundColor: '#282a36',
    color: '#6272a4',
    borderRight: '1px solid #383a59',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(68, 71, 90, 0.4)',
    color: '#f8f8f2',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: '#44475a',
    border: 'none',
    color: '#bd93f9',
  },
  '.cm-tooltip': {
    border: '1px solid #44475a',
    backgroundColor: '#21222c',
    color: '#f8f8f2',
  },
}, { dark: true });

const draculaHighlight = HighlightStyle.define([
  { tag: t.keyword, color: '#ff79c6', fontWeight: 'bold' },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: '#f8f8f2' },
  { tag: [t.variableName], color: '#f8f8f2' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#50fa7b' },
  { tag: [t.labelName], color: '#8be9fd' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#bd93f9' },
  { tag: [t.definition(t.name), t.separator], color: '#f8f8f2' },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#bd93f9' },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: '#ff79c6' },
  { tag: [t.meta, t.comment], color: '#6272a4', fontStyle: 'italic' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: '#8be9fd', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#ff79c6' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#bd93f9' },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#f1fa8c' },
  { tag: t.invalid, color: '#ff5555' },
]);

export const dracula: Extension = [draculaBase, syntaxHighlighting(draculaHighlight)];

// 2. Nord Theme
const nordBase = EditorView.theme({
  '&': {
    color: '#d8dee9',
    backgroundColor: '#2e3440',
  },
  '.cm-content': {
    caretColor: '#88c0d0',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#88c0d0' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#434c5e',
  },
  '.cm-activeLine': { backgroundColor: 'rgba(59, 66, 82, 0.6)' },
  '.cm-gutters': {
    backgroundColor: '#2e3440',
    color: '#4c566a',
    borderRight: '1px solid #3b4252',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(59, 66, 82, 0.6)',
    color: '#d8dee9',
  },
}, { dark: true });

const nordHighlight = HighlightStyle.define([
  { tag: t.keyword, color: '#81a1c1', fontWeight: 'bold' },
  { tag: [t.name, t.deleted, t.character, t.propertyName], color: '#d8dee9' },
  { tag: [t.variableName], color: '#d8dee9' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#88c0d0' },
  { tag: [t.typeName, t.className], color: '#8fbcbb' },
  { tag: [t.number, t.bool, t.atom], color: '#b48ead' },
  { tag: [t.operator, t.operatorKeyword], color: '#81a1c1' },
  { tag: [t.string, t.special(t.string)], color: '#a3be8c' },
  { tag: [t.meta, t.comment], color: '#4c566a', fontStyle: 'italic' },
  { tag: t.heading, color: '#88c0d0', fontWeight: 'bold' },
]);

export const nord: Extension = [nordBase, syntaxHighlighting(nordHighlight)];

// 3. GitHub Dark Theme
const githubDarkBase = EditorView.theme({
  '&': {
    color: '#c9d1d9',
    backgroundColor: '#0d1117',
  },
  '.cm-content': {
    caretColor: '#58a6ff',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#58a6ff' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#1f6feb40',
  },
  '.cm-activeLine': { backgroundColor: '#161b2280' },
  '.cm-gutters': {
    backgroundColor: '#0d1117',
    color: '#6e7681',
    borderRight: '1px solid #21262d',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#161b2280',
    color: '#f0f6fc',
  },
}, { dark: true });

const githubDarkHighlight = HighlightStyle.define([
  { tag: t.keyword, color: '#ff7b72', fontWeight: 'bold' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#d2a8ff' },
  { tag: [t.typeName, t.className], color: '#ffa657' },
  { tag: [t.number, t.bool, t.atom], color: '#79c0ff' },
  { tag: [t.operator, t.operatorKeyword], color: '#79c0ff' },
  { tag: [t.string, t.special(t.string)], color: '#a5d6ff' },
  { tag: [t.meta, t.comment], color: '#8b949e', fontStyle: 'italic' },
  { tag: [t.variableName, t.propertyName], color: '#c9d1d9' },
  { tag: t.heading, color: '#58a6ff', fontWeight: 'bold' },
]);

export const githubDark: Extension = [githubDarkBase, syntaxHighlighting(githubDarkHighlight)];

// 4. GitHub Light Theme
const githubLightBase = EditorView.theme({
  '&': {
    color: '#24292f',
    backgroundColor: '#ffffff',
  },
  '.cm-content': {
    caretColor: '#0969da',
  },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#0969da' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#b6e3ff50',
  },
  '.cm-activeLine': { backgroundColor: '#f6f8fa' },
  '.cm-gutters': {
    backgroundColor: '#ffffff',
    color: '#8c959f',
    borderRight: '1px solid #d0d7de',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#f6f8fa',
    color: '#24292f',
  },
}, { dark: false });

const githubLightHighlight = HighlightStyle.define([
  { tag: t.keyword, color: '#cf222e', fontWeight: 'bold' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#8250df' },
  { tag: [t.typeName, t.className], color: '#953800' },
  { tag: [t.number, t.bool, t.atom], color: '#0550ae' },
  { tag: [t.operator, t.operatorKeyword], color: '#0550ae' },
  { tag: [t.string, t.special(t.string)], color: '#0a3069' },
  { tag: [t.meta, t.comment], color: '#6e7781', fontStyle: 'italic' },
  { tag: [t.variableName, t.propertyName], color: '#24292f' },
  { tag: t.heading, color: '#0969da', fontWeight: 'bold' },
]);

export const githubLight: Extension = [githubLightBase, syntaxHighlighting(githubLightHighlight)];

export const THEMES: Record<EditorThemeId, { name: string; isDark: boolean; extension: Extension }> = {
  'one-dark': {
    name: 'One Dark',
    isDark: true,
    extension: oneDark,
  },
  'github-dark': {
    name: 'GitHub Dark',
    isDark: true,
    extension: githubDark,
  },
  'dracula': {
    name: 'Dracula',
    isDark: true,
    extension: dracula,
  },
  'nord': {
    name: 'Nord',
    isDark: true,
    extension: nord,
  },
  'github-light': {
    name: 'GitHub Light',
    isDark: false,
    extension: githubLight,
  },
};
