// src/components/ToastTrigger.jsx
"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function ToastTrigger() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: "Action complete",
          description: "This is a toast from the client",
        })
      }
    >
      Show Toast
    </Button>
  );
}
