# CodePortfolio Web

Cliente React 19 + Vite para CodePortfolio.

```bash
npm ci
npm run dev
```

En desarrollo, Vite envía `/api` a `http://localhost:5102`. En Docker, Nginx usa
el servicio `backend`. Para una API externa se puede definir `VITE_API_URL` durante
el build. La navegación usa rutas hash, por lo que las páginas sobreviven a una
recarga y no requieren configuración adicional del servidor.
