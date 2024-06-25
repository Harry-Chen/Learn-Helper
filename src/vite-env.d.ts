/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/react" />

declare const __HELPER_VERSION__: string;
declare const __GIT_VERSION__: string;
declare const __GIT_COMMIT_HASH__: string;
declare const __GIT_COMMIT_DATE__: string;
declare const __GIT_BRANCH__: string;
declare const __BUILD_HOSTNAME__: string;
declare const __BUILD_TIME__: string;
declare const __THU_LEARN_LIB_VERSION__: string;
declare const __MUI_VERSION__: string;
declare const __REACT_VERSION__: string;
declare const __LEARN_HELPER_CSRF_TOKEN_PARAM__: string;
declare const __LEARN_HELPER_CSRF_TOKEN_INJECTOR__: string;
declare const __BROWSER__: string;

declare module '*.po' {
  import type { Messages } from '@lingui/core';
  export const messages: Messages;
}
