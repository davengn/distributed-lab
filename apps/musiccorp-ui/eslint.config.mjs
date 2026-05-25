import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      'jest.config.js',
    ],
  },
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];

export default eslintConfig;
