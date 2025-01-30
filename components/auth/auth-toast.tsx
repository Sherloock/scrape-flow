"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AuthToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "authentication_required") {
      toast.error("Authentication required", {
        id: "auth-check",
        duration: 1000,
        description: "Redirecting to login...",
      });
    }
  }, [searchParams]);

  return null;
}
