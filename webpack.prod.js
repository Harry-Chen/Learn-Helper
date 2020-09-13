const { merge } = require("webpack-merge");
const TerserPlugin = require('terser-webpack-plugin');
const common = require("./webpack.common.js");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "../size-report.html",
      openAnalyzer: false
    })  
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  }
});
