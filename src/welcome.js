
fetch('/manifest.json')
  .then((r) => r.json())
  .then((o) => {
    document.getElementById('version').innerHTML = `
${__GIT_VERSION__} (build on ${__BUILD_HOSTNAME__} at ${__BUILD_TIME__})<br />
`;
  });

document.getElementById('packages').innerHTML = `
thu-learn-lib: v${__THU_LEARN_LIB_VERSION__} <br />
React: v${__REACT_VERSION__} <br />
Material-UI: v${__MUI_VERSION__} <br />
`
