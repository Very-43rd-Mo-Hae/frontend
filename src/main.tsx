import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './global.css';
import { registerServiceWorker } from './register-service-worker';

createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

registerServiceWorker();
