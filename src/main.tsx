import App from '@/salesmaster';
import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');
// Test
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
