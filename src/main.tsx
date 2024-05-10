import App from '@/form-builder';
import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App
        form={[
          {
            title: 'Username',
            type: 'text',
            maxLength: 20,
          },
          {
            title: 'Age',
            type: 'number',
            min: 18,
            max: 100,
          },
          {
            title: 'Receive Newsletter',
            type: 'boolean',
            isChecked: true,
          },
          {
            title: 'Country',
            type: 'dropdown',
            options: ['USA', 'Canada', 'UK'],
            default: 0,
          },
          {
            title: 'Appointment Time',
            type: 'time',
          },
        ]}
      />
    </React.StrictMode>,
  );
}
