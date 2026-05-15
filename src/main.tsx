import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./components/layout/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="semi-dark">
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>,
);
