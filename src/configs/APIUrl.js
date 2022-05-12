const domain = window.location.host;
export const API_URL = !!~domain.indexOf(':') ? 'proxy/api' : `//${domain}/api`;
// export const API_URL = !~domain.indexOf('detail')? 'proxy/api' : `//${domain}/api`;