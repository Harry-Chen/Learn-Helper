import { defineConfig } from 'wxt';
import icons from 'unplugin-icons/vite';
import react from '@vitejs/plugin-react-swc';
import preserveDirectives from 'rollup-preserve-directives';
import { lingui } from '@lingui/vite-plugin';
import mdx from '@mdx-js/rollup';
import remarkMdxImages from 'remark-mdx-images';
import remarkUnwrapImages from 'remark-unwrap-images';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import Randomstring from 'randomstring';
import { execSync } from 'node:child_process';
import path from 'node:path';

import { author, version } from './package.json';
import { version as versionThuLearnLib } from './node_modules/thu-learn-lib/package.json';
import { version as versionMui } from './node_modules/@mui/material/package.json';
import { version as versionReact } from './node_modules/react/package.json';

const runCmd = (cmd: string) => execSync(cmd).toString().trim();

const randomSuffix = Randomstring.generate(4);
const helperVersion = version;
const gitVersion = runCmd('git describe --always --dirty');
const gitBranch = runCmd('git branch --show-current').replaceAll('/', '-');
const date = new Date();

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: ({ mode }) => ({
    define: {
      __HELPER_VERSION__: JSON.stringify(helperVersion),
      __GIT_VERSION__: JSON.stringify(gitVersion),
      __GIT_COMMIT_HASH__: JSON.stringify(runCmd('git rev-parse HEAD')),
      __GIT_COMMIT_DATE__: JSON.stringify(
        runCmd('git log -1 --date=format:"%Y/%m/%d %T" --format="%ad"'),
      ),
      __GIT_BRANCH__: JSON.stringify(runCmd('git rev-parse --abbrev-ref HEAD')),
      __BUILD_HOSTNAME__: JSON.stringify(runCmd('hostname')),
      __BUILD_TIME__: JSON.stringify(`date + ${date.toLocaleString('zh-CN')}`),
      __THU_LEARN_LIB_VERSION__: JSON.stringify(versionThuLearnLib),
      __MUI_VERSION__: JSON.stringify(versionMui),
      __REACT_VERSION__: JSON.stringify(versionReact),
      __LEARN_HELPER_CSRF_TOKEN_PARAM__: JSON.stringify(
        `__learn-helper-csrf-token-${randomSuffix}__`,
      ),
      __LEARN_HELPER_CSRF_TOKEN_INJECTOR__: JSON.stringify(
        `__learn_helper_csrf_token_injector_${randomSuffix}__`,
      ),
    },
    plugins: [
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [remarkMdxImages, remarkUnwrapImages],
        }),
      },
      icons({ compiler: 'jsx', jsx: 'react' }),
      react({ plugins: [['@lingui/swc-plugin', {}]] }),
      preserveDirectives(),
      lingui(),
      chunkSplitPlugin({
        customSplitting: {
          'thu-learn-lib-vendor': [/thu-learn-lib/],
          'ui-vendor': [/@mui/, /@emotion/],
        },
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        parse5: path.resolve(__dirname, 'node_modules/fake-parse5/'),
        'parse5-htmlparser2-tree-adapter': path.resolve(__dirname, 'node_modules/fake-parse5/'),
      },
    },
    build: {
      target: 'esnext',
      sourcemap: mode === 'development',
      ...(mode === 'production' && {
        minify: 'terser',
        terserOptions: {
          format: {
            comments: false,
            ecma: 2018,
          },
        },
      }),
    },
  }),
  extensionApi: 'chrome',
  manifestVersion: 3,
  manifest: ({ browser }) => ({
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    default_locale: 'zh_CN',
    author: author,
    version,
    action: {},
    host_permissions: ['*://learn.tsinghua.edu.cn/*', '*://id.tsinghua.edu.cn/*'],
    permissions:
      browser === 'firefox'
        ? ['storage', 'downloads']
        : ['storage', 'downloads', 'declarativeNetRequest'],
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          update_url: 'https://harrychen.xyz/learn/updates.json',
          id: '{b3a44052-5d0d-4ef9-9744-93b6f5ca7398}',
        },
      },
    }),
  }),
  analysis: {
    enabled: true,
  },
  zip: {
    artifactTemplate: `{{name}}-{{version}}-${gitBranch}-${gitVersion}-{{browser}}.zip`,
    sourcesTemplate: `{{name}}-{{version}}-${gitBranch}-${gitVersion}-sources.zip`,
  },
  outDir: 'dist',
});
