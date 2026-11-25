import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles.css'
import App from './App.jsx'
import { StoreProvider } from './services/store.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
)

// Label stacked table cells on phones (reads header text into data-l)
new MutationObserver(() => {
  for (const c of document.querySelectorAll('.stack td:not([data-l])')) {
    let i = 0, p = c
    while ((p = p.previousElementSibling)) i += p.colSpan
    c.dataset.l = c.closest('table').rows[0].cells[i]?.textContent || ''
  }
}).observe(document, { childList: true, subtree: true })
