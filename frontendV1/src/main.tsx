import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes/AppRoute";

// 🔥 AUTO DETECT DARK MODE SYSTEM
const setTheme = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// run pertama
setTheme();

// listen perubahan OS (real-time)
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", setTheme);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);