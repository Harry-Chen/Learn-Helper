const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const htmlPlugin = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const replacePlugin = new webpack.NormalModuleReplacementPlugin(
  /pubsuffix\.js/,
  path.resolve(__dirname, 'src/utils/pubsuffix_stub.js')
);

module.exports = {
  entry: {
    index: "./src/index.tsx",
    background: "./src/background.ts"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js"
  },
  plugins: [ htmlPlugin, replacePlugin ],
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        exclude: /node_modules/,
        test: /\.css$/,
        use: [ 'style-loader', {
          loader: 'typings-for-css-modules-loader',
          options: {
            modules: true,
            namedExport: true,
            sass: true,
            localIdentName: '[name]--[local]--[hash:base64:5]'
          }
        }]
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
