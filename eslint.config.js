import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from '@eslint-react/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import gitignore from 'eslint-config-flat-gitignore';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  gitignore(),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
