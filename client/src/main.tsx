import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store/store";
import { Toaster } from "sonner";
import "./index.css";

const renderApp = () => (
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster richColors />
    </Provider>
  </BrowserRouter>
);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(renderApp());
