import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // ✅ Correct import
import HotelContextProvider from "./context/HotelContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HotelContextProvider>
      <App />
    </HotelContextProvider>
  </BrowserRouter>
);
