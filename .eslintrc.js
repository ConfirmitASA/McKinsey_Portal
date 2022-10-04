module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true,
  },
  extends: ['airbnb-base', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
  ignorePatterns: ['src/template/*', 'webpack.*.js'],
};
