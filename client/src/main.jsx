import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>            {/* 1️⃣ Auth context provide kare */}
      <BrowserRouter>         {/* 2️⃣ Routing enable kare */}
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);