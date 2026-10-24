import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['dist/']
  },
  {
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended']
  },
  {
    files: ['src/js/**/*.js'],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ['gulpfile.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node }
  }
]);
