import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const deployedCommit = import.meta.env.VITE_GIT_COMMIT?.trim()
if (deployedCommit) {
  const versionMeta = document.createElement('meta')
  versionMeta.name = 'codeportfolio-version'
  versionMeta.content = deployedCommit
  document.head.appendChild(versionMeta)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
