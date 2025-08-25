"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TiwalaProvider } from "@/context/TiwalaContext";
import React from "react";

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TiwalaProvider>
          {children}
        </TiwalaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
