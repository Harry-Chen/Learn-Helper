import { defineConfig } from 'vite';
import icons from 'unplugin-icons/vite';
import preact from '@preact/preset-vite';
import preserveDirectives from 'rollup-preserve-directives';
import { lingui } from '@lingui/vite-plugin';
import webExtension from '@samrum/vite-plugin-web-extension';
import { visualizer } from 'rollup-plugin-visualizer';
import zipPack from 'vite-plugin-zip-pack';
import mdx from '@mdx-js/rollup';
import remarkMdxImages from 'remark-mdx-images';
import remarkUnwrapImages from 'remark-unwrap-images';
import Randomstring from 'randomstring';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { getManifest } from './src/manifest';
import { version } from './package.json';
import { version as versionThuLearnLib } from './node_modules/thu-learn-lib/package.json';
import { version as versionMui } from './node_modules/@mui/material/package.json';
import { version as versionPreact } from './node_modules/preact/package.json';

const runCmd = (cmd: string) => execSync(cmd).toString().trim();
const randomSuffix = Randomstring.generate(4);
const isFirefox = process.env.BROWSER === 'firefox';
const isDev = process.env.NODE_ENV === 'development';
const helperVersion = version;
const gitVersion = runCmd('git describe --always --dirty');
const gitBranch = runCmd('git branch --show-current');
const date = new Date();

// https://vitejs.dev/config/
export default defineConfig({
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
    __PREACT_VERSION__: JSON.stringify(versionPreact),
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
    preact({
      babel: {
        plugins: ['macros'],
      },
    }),
    preserveDirectives(),
    lingui(),
    webExtension({
      manifest: getManifest(isFirefox) as chrome.runtime.ManifestV3,
      additionalInputs: {
        html: ['pages/index.html', 'pages/about.html'],
      },
      useDynamicUrlWebAccessibleResources: !isFirefox,
    }),
    visualizer(),
    !isDev &&
      zipPack({
        outFileName: `learn-helper-${helperVersion}-${gitBranch}-${gitVersion}-${
          isFirefox ? 'firefox' : 'chrome'
        }.zip`.replaceAll('/', '-'),
      }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '/@react-refresh': path.resolve('node_modules/@vitejs/plugin-react-swc/refresh-runtime.js'),
      parse5: path.resolve(__dirname, 'node_modules/fake-parse5/'),
      'parse5-htmlparser2-tree-adapter': path.resolve(__dirname, 'node_modules/fake-parse5/'),
    },
  },
  build: {
    minify: 'terser',
    sourcemap: isDev,
    terserOptions: {
      format: {
        comments: false,
        ecma: 2018,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'ui-vendor': [
            '@mui/material',
            '@emotion/react',
            '@emotion/styled',
            'notistack',
            'classnames',
          ],
          'thu-learn-lib-vendor': ['thu-learn-lib'],
        },
      },
      onwarn(warning, defaultHandler) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
});
