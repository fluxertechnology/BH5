"use client";

import { useState, useCallback } from "react";

interface UseIframeReturn {
  isOpen: boolean;
  currentUrl: string;
  openIframe: (url: string) => void;
  closeIframe: () => void;
}

export const useIframe = (): UseIframeReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const openIframe = useCallback((url: string) => {
    setCurrentUrl(url);
    setIsOpen(true);
  }, []);

  const closeIframe = useCallback(() => {
    setIsOpen(false);
    setCurrentUrl("");
  }, []);

  return {
    isOpen,
    currentUrl,
    openIframe,
    closeIframe,
  };
};
