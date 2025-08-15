module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Style rules - changed to warnings
    indent: ['warn', 2],
    'linebreak-style': 'off', // Turn off line ending enforcement
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],

    // Code quality rules - changed to warnings
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off', // Allow console statements
    'prefer-const': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'prefer-template': 'warn',

    // Additional lenient rules
    'no-trailing-spaces': 'warn',
    'eol-last': 'warn',
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'arrow-parens': 'off'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      }
    }
  ]
};
