"use client";

import { QueryClient, QueryClientProvider, QueryFunction } from "@tanstack/react-query";
import { useState } from "react";

function makeQueryFunction(): QueryFunction {
  return async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      const info = await res.json().catch(() => ({}));
      throw Object.assign(error, info);
    }

    return res.json();
  };
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
            queryFn: makeQueryFunction(),
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
