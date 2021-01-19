module.exports = {
    root: true,
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
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
  };
