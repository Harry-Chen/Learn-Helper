// inject function to deal with CSRF token
const code = `
function __LEARN_HELPER_CSRF_TOKEN_INJECTOR__() {
    const params = new URLSearchParams(window.location.search);
    const tokenFromCookie = params.get('__LEARN_HELPER_CSRF_TOKEN_PARAM__');
    const tokenFromSession = sessionStorage.getItem('__LEARN_HELPER_CSRF_TOKEN_PARAM__');
    if (!tokenFromCookie && !tokenFromSession) {
        console.log("No CSRF token found in cookie or SessionStorage, skipping...");
        return;
    }
    token = tokenFromCookie || tokenFromSession;
    console.log('Page opened in Learn Helper, injecting XSRF-TOKEN cookie...');
    sessionStorage.setItem('__LEARN_HELPER_CSRF_TOKEN_PARAM__', token);
    Object.defineProperty(document, 'cookie', {
        get() {
            console.log('Getting XSRF-TOKEN token injected by Learn Helper');
            return 'XSRF-TOKEN=' + token;
        }
    });
}

__LEARN_HELPER_CSRF_TOKEN_INJECTOR__();
`;

const script = document.createElement('script');
script.textContent = code;
(document.head || document.documentElement).appendChild(script);
script.remove();
