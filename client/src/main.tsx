import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider, theme } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm, 
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,         
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);