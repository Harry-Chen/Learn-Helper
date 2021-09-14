import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url'
import ChildProcess from 'child_process';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { GitRevisionPlugin } from 'git-revision-webpack-plugin';


const __dirname = dirname(fileURLToPath(import.meta.url));
const learnLibInfo = JSON.parse(readFileSync('./node_modules/thu-learn-lib/package.json').toString());

const createIndex = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
  excludeChunks: ["background"]
});

const copyPolyFill = new CopyPlugin({
  patterns: [
    { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js', to: './' }
  ]
});

const gitRevision = new GitRevisionPlugin({
  branch: true,
  versionCommand: 'describe --always --tags --dirty'
});

const commitDate = ChildProcess
  .execSync('git log -1 --date=format:"%Y/%m/%d %T" --format="%ad"')
  .toString();

const hostname = ChildProcess
  .execSync('hostname')
  .toString();

const buildTime = ChildProcess
  .execSync('date +"%Y/%m/%d %T"')
  .toString();

const defineConstants = new webpack.DefinePlugin({
  '__GIT_VERSION__': JSON.stringify(gitRevision.version().trim()),
  '__GIT_COMMIT_HASH__': JSON.stringify(gitRevision.commithash().trim()),
  '__GIT_COMMIT_DATE__': JSON.stringify(commitDate.trim()),
  '__GIT_BRANCH__': JSON.stringify(gitRevision.branch().trim()),
  '__BUILD_HOSTNAME__': JSON.stringify(hostname.trim()),
  '__BUILD_TIME__': JSON.stringify(buildTime.trim()),
  '__THU_LEARN_LIB_VERSION__': JSON.stringify(learnLibInfo.version),
  '__MUI_VERSION__': JSON.stringify(learnLibInfo.version),
  '__REACT_VERSION__': JSON.stringify(learnLibInfo.version),
});


export default {
  entry: {
    index: "./src/index.tsx",
    background: "./src/background.ts",
    welcome: "./src/welcome.js",
  },
  output: {
    path: resolve("./dist"),
    filename: "[name].js"
  },
  plugins: [ createIndex, copyPolyFill, new NodePolyfillPlugin(), gitRevision, defineConstants ],
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
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
        }],
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      'parse5': resolve(__dirname, 'node_modules/thu-learn-lib/src/fake-parse5/'),
      'parse5-htmlparser2-tree-adapter': resolve(__dirname, 'node_modules/thu-learn-lib/src/fake-parse5/'),
      // "react": "preact/compat",
      // "react-dom/test-utils": "preact/test-utils",
      // "react-dom": "preact/compat",
    },
  }
};
