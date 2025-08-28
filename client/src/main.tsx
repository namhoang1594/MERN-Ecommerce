import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { Toaster } from "sonner";
import "./index.css";
import AuthProvider from "./components/auth/authProvider";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store";

const renderApp = () => (
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AuthProvider>
          <App />
          <Toaster richColors />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(renderApp());
