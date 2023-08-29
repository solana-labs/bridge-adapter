"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Pricing from "./Pricing";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Pricing />
    </QueryClientProvider>
  );
}
