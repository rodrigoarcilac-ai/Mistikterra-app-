import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontró #root");
}

window.addEventListener("error", (event) => {
  if (rootElement.dataset.booted === "true") return;
  rootElement.textContent = `No se pudo cargar la app: ${event.message}`;
});

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
rootElement.dataset.booted = "true";
