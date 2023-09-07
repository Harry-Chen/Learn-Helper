// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import RefreshRuntime from "/@react-refresh";

if (import.meta.hot) {
  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
  window.__vite_plugin_react_preamble_installed__ = true;
}
