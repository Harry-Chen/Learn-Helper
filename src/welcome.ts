import './enableDevHmr';

document.querySelector(
  '#version',
).innerHTML = `${__GIT_VERSION__} (built on ${__BUILD_HOSTNAME__} at ${__BUILD_TIME__})<br />`;
document.querySelector('#packages').innerHTML = `thu-learn-lib: v${__THU_LEARN_LIB_VERSION__} <br />
React: v${__REACT_VERSION__} <br />
MUI: v${__MUI_VERSION__} <br />`;
