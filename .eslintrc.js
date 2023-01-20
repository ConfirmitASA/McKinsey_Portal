module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true,
  },
  extends: ['airbnb-base', 'prettier'],
  overrides: [
    {
      files: ['*.html'],
      parser: '@html-eslint/parser',
      extends: ['plugin:@html-eslint/recommended'],
      rules: {
        'spaced-comment': 0,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        allowNamedExports: false,
      },
    ],
    'spaced-comment': 0,
    'no-new': 0,
    'no-restricted-syntax': 0,
    'guard-for-in': 0,
    'prefer-destructuring': 0,
    'no-plusplus': 0,
  },
  plugins: ['html', '@html-eslint'],
  ignorePatterns: ['src/external/scripts/*', 'webpack.*.js', 'dist', 'docs', 'testdata*.js'],
};
