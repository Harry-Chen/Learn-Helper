const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


const createIndex = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
  excludeChunks: ["background"]
});

const copyPolyFill = new CopyPlugin([
  {from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js', to: './'}
]);

module.exports = {
  entry: {
    index: "./src/index.tsx",
    background: "./src/background.ts",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js"
  },
  plugins: [ createIndex, copyPolyFill ],
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-modules-typescript-loader', {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]--[local]--[hash:base64:5]'
            }
          }
        }]
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
