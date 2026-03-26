import { createRoot } from "react-dom/client";
import App from "./App";
import { ChunkErrorBoundary } from "./components/chunk-error-boundary";
import "./index.css";

// Vite-specific: fires when a dynamic chunk fails to load after a new deployment
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(
  <ChunkErrorBoundary>
    <App />
  </ChunkErrorBoundary>
);
