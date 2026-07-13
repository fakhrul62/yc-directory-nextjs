"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function PageLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentUrlRef = useRef(pathname + searchParams.toString());

  // Starts the progress counter, exponentially decaying growth towards 95%
  const startLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
    setVisible(true);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        const remaining = 95 - prev;
        const step = Math.max(1, Math.floor(remaining * 0.1));
        return prev + step;
      });
    }, 100);
  };

  // Completes progress to 100% and fades out
  const stopLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
    }, 450); // Give user enough time to see 100%
  };

  // Complete loading when the page URL actually changes
  useEffect(() => {
    const newUrl = pathname + searchParams.toString();
    if (newUrl !== currentUrlRef.current) {
      currentUrlRef.current = newUrl;
      stopLoading();
    }
  }, [pathname, searchParams]);

  // Intercept internal clicks and form submissions
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (target && target.tagName === "A") {
        const anchor = target as HTMLAnchorElement;
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        if (
          href &&
          !href.startsWith("#") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:") &&
          targetAttr !== "_blank" &&
          (href.startsWith("/") || href.startsWith(window.location.origin))
        ) {
          startLoading();
        }
      }
    };

    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      const target = form.getAttribute("target");
      if (target !== "_blank") {
        startLoading();
      }
    };

    document.addEventListener("click", handleAnchorClick);
    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("submit", handleFormSubmit);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center pointer-events-none transition-opacity duration-300">
      <div className="flex items-center justify-center w-10 h-10 bg-black/90 backdrop-blur-md rounded-full border border-white/10 shadow-2xl text-white font-work-sans text-xs font-bold">
        {progress}%
      </div>
    </div>
  );
}

export default function PageLoader() {
  return (
    <Suspense fallback={null}>
      <PageLoaderInner />
    </Suspense>
  );
}
