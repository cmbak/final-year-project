import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";
import { BrowserRouter } from "react-router";

// Needed for testing routing and query client
// From testing-library docs https://testing-library.com/docs/react-testing-library/setup/#custom-render
const wrapProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

const providerRenderer = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">, // Remove wrapper property from type since it's being defined here
) => render(ui, { wrapper: wrapProviders, ...options });

export { providerRenderer as render };
