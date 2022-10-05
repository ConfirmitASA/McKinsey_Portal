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
  rules: {},
  plugins: ['html', '@html-eslint'],
  ignorePatterns: ['src/template/*', 'webpack.*.js', 'dist', 'docs'],
};
