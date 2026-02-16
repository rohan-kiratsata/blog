"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useZenNavigation() {
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      // Dispatch transition start event
      window.dispatchEvent(new CustomEvent("zen-transition-start"));

      // Navigate at peak of the transition
      setTimeout(() => {
        router.push(path);
      }, 450);
    },
    [router]
  );

  return navigate;
}

export default function InventoryShortcut() {
  const pathname = usePathname();
  const zenNavigate = useZenNavigation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      // Toggle inventory mode with 'I' key
      if (e.key === "i" || e.key === "I") {
        if (pathname === "/inventory") {
          zenNavigate("/");
        } else {
          zenNavigate("/inventory");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zenNavigate, pathname]);

  // This component doesn't render anything
  return null;
}
