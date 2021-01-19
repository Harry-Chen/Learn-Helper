module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
      'react'
    ],
    extends: [
      // 'eslint:recommended',
      // 'plugin:@typescript-eslint/recommended',
      'airbnb-typescript',
      'prettier',
      'prettier/@typescript-eslint',
    ],
    parserOptions: {
      project: './tsconfig.json',
    }
  };
