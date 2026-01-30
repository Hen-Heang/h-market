"use client";

import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            const message = err instanceof Error ? err.message : "Something went wrong";
            toast.error(message);
          },
        }),
        mutationCache: new MutationCache({
          onError: (err) => {
            const message = err instanceof Error ? err.message : "Something went wrong";
            toast.error(message);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              const message = error instanceof Error ? error.message.toLowerCase() : "";
              if (message.includes("unauthorized") || message.includes("forbidden")) return false;
              return failureCount < 1;
            },
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
