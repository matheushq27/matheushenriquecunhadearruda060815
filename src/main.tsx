import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import 'primeicons/primeicons.css'; //icons
import "./App.css";
import App from './App.tsx'
import { PrimeReactProvider } from "primereact/api";
import Tailwind from 'primereact/passthrough/tailwind';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
       <PrimeReactProvider value={{ unstyled: false, pt: Tailwind }}>
        <App />
    </PrimeReactProvider>
    </BrowserRouter>
  </StrictMode>,
)
 






