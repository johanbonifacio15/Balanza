import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);