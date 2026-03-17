import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { UserDataProvider } from './app/store/UserDataProvider'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserDataProvider>
            <App />
        </UserDataProvider>
    </StrictMode>
);
// UserDataProvider ist Teil von React Context und localStorage, ist für die Datenverwaltung im ganzen App geeignet
// StrictMode ist für die sichere und zuverlässige Entwicklung