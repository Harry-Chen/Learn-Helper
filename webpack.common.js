const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');


const htmlPlugin = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const typingsForCssModulesLoaderConf = {
  loader: 'typings-for-css-modules-loader',
  options: {
    modules: true,
    namedExport: true,
    camelCase: true,
    sass: true
  }
};

module.exports = {
  entry: {
    index: "./src/index.tsx",
    background: "./src/background.tsx"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js"
  },
  plugins: [htmlPlugin],
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
        use: [ 'style-loader', typingsForCssModulesLoaderConf ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
