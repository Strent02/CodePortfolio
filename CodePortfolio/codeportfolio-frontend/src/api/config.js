const RENDER_API_BY_FRONTEND_HOST = {
  'codeportfolio-web-strent02.onrender.com': 'https://codeportfolio-api-strent02.onrender.com',
};

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
const deployedApiUrl = typeof window === 'undefined'
  ? ''
  : RENDER_API_BY_FRONTEND_HOST[window.location.hostname] || '';
const configuredHost = configuredApiUrl.replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];
const isInternalServiceHost = configuredHost && configuredHost !== 'localhost' && !configuredHost.includes('.');
const selectedApiUrl = isInternalServiceHost && deployedApiUrl
  ? deployedApiUrl
  : configuredApiUrl || deployedApiUrl;

// Render puede inyectar el hostname privado del servicio (sin dominio), que el
// navegador no puede resolver. En ese caso se usa el endpoint público conocido.
// Desarrollo y Docker conservan sus proxies relativos cuando no hay URL.
export const API_BASE = (selectedApiUrl && !/^https?:\/\//i.test(selectedApiUrl)
  ? `https://${selectedApiUrl}`
  : selectedApiUrl).replace(/\/+$/, '');
