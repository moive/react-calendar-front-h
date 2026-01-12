import ReactDOM from "react-dom/client";
import { CalendarApp } from "./CalendarApp";
import { registerSW } from "virtual:pwa-register";

import "./styles.css";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("[PWA] Nueva versión disponible");
  },
  onOfflineReady() {
    console.log("[PWA] App lista para offline");
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CalendarApp />);
