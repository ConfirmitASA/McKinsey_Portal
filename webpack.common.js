const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const pkg = require('./package.json');
const version = pkg.version;
const childProcess = require('child_process');
const gitCommits = childProcess.execSync('git rev-list HEAD --count').toString();

module.exports = {
  entry: {
    preloader: path.resolve(__dirname, './src/preloader.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|docs|dist)/,
        loader: 'prettier-loader',
        options: {
          parser: 'babel',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.html$/i,
        use: {
          loader: 'html-loader',
          options: {
            preprocessor: (content, loaderContext) =>
              content.replace(/\<include src=\"(.+)\"\/?\>(?:\<\/include\>)?/gi, (m, src) =>
                fs.readFileSync(path.resolve(loaderContext.context, src), 'utf8')
              ),
          },
        },
      },
      {
        test: /\.htm$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: false,
          },
        }, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      scriptLoading: 'defer',
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
      chunks: ['preloader'],
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: false, // do not remove type="text"
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new MiniCssExtractPlugin({
      attributes: {
        "data-template": "email-template",
      },
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      emitError: false,
      emitWarning: false,
      failOnError: false,
      failOnWarning: false,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.DefinePlugin({
      __MAJOR_VERSION__: JSON.stringify(version),
      __MINOR_VERSION__: JSON.stringify(gitCommits)
    })
  ],
};
