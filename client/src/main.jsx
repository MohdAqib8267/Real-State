import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {Auth0Provider} from '@auth0/auth0-react'
ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <Auth0Provider 
    domain="dev-bsmubq3cydadzuu8.us.auth0.com"
    clientId="Sv1LFvvT8HegmIk4WHMTXC71HJtuyCGa"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    audience={window.location.origin}
    scope="openid profile email"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
