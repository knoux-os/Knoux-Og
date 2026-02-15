
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// استخدام window.location.origin يضمن توافق الرابط مع البيئة الحالية (localhost أو غيرها)
const currentOrigin = window.location.origin;

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="knoux-auth.us.auth0.com"
      clientId="zmM6BCSNmZQHtRD9GWIl6bLWiAoa3IXE"
      authorizationParams={{
        redirect_uri: currentOrigin,
        audience: "https://knoux-auth.us.auth0.com/api/v2/"
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
