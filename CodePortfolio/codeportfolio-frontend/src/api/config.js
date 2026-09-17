const RENDER_API_BY_FRONTEND_HOST = {
  'codeportfolio-web-strent02.onrender.com': 'https://codeportfolio-api-strent02.onrender.com',
};

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || '';
const deployedApiUrl = typeof window === 'undefined'
  ? ''
  : RENDER_API_BY_FRONTEND_HOST[window.location.hostname] || '';
const selectedApiUrl = configuredApiUrl || deployedApiUrl;

// Render puede exponer una referencia de servicio como hostname sin protocolo.
// El fallback mantiene operativo el Static Site aunque esa variable no quede
// disponible durante el build. Local y Docker conservan sus proxies relativos.
export const API_BASE = (selectedApiUrl && !/^https?:\/\//i.test(selectedApiUrl)
  ? `https://${selectedApiUrl}`
  : selectedApiUrl).replace(/\/+$/, '');
