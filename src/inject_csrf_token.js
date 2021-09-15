// inject function to deal with CSRF token
const code = `
function ${__LEARN_HELPER_CSRF_TOKEN_INJECTOR__}() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('${__LEARN_HELPER_CSRF_TOKEN_PARAM__}');
    if (!token) {
        console.log("Page not opened in Learn Helper, skipping cookie injection...")
        return;
    }
    console.log('Page opened in Learn Helper, injecting XSRF-TOKEN cookie...')
    Object.defineProperty(document, 'cookie', {
        get() {
            console.log('Getting XSRF-TOKEN token injected by Learn Helper');
            return 'XSRF-TOKEN=' + token;
        }
    });
}

${__LEARN_HELPER_CSRF_TOKEN_INJECTOR__}();
`;

const script = document.createElement('script');
script.textContent = code;
(document.head || document.documentElement).appendChild(script);
script.remove();
