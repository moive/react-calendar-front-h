import ReactDOM from "react-dom/client";
import { CalendarApp } from "./CalendarApp";

import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CalendarApp />);

// Registrar Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("[App] Service Worker registrado:", registration);
    })
    .catch((error) => {
      console.error("[App] Error al registrar Service Worker:", error);
    });
}
