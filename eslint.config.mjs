import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } },
});

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'build/**', 'dist/**'],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
