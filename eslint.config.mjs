/* eslint import/no-anonymous-default-export: "off" */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // 👇 Ignore fichiers générés & gros dossiers
  { ignores: ['node_modules/**', '.next/**', 'coverage/**', 'data/**', 'public/videos/**'] },

  js.configs.recommended,

  // Presets Next via compat
  ...compat.config({
    extends: ['next/core-web-vitals'],
    rules: { '@next/next/no-img-element': 'off' }
  }),

  // Règles TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'import/no-anonymous-default-export': 'off',
      'jsx-a11y/alt-text': 'warn'
    },
    settings: { react: { version: 'detect' } }
  }
];

export default config;
