import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProveedorCarrito } from "./contexto/ContextoCarrito.jsx";
import { ProveedorInventario } from "./contexto/ContextoInventario.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProveedorInventario>
      <ProveedorCarrito>
        <App />
      </ProveedorCarrito>
    </ProveedorInventario>
  </StrictMode>
);