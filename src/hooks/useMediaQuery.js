import { useEffect, useState } from "react";

/**
 * Custom hook to detect device type based on media queries and touchscreen capability.
 * @returns {Object} - An object containing booleans for isDesktop, isTablet, isMobile, isTouchDevice, and the window size.
 */

const useMediaQuery = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const isClient = typeof window !== "undefined";
  const [size, setSize] = useState([
    isClient ? window.innerWidth : isClient,
    isClient ? window.innerHeight : 1080,
  ]); // Initialize with current window size

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateDeviceType = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setIsDesktop(width > 1024);
      setIsTablet(width >= 768 && width <= 1024);
      setIsMobile(width < 768);
      checkTouchDevice();
      setSize([width, height]);
    };

    const checkTouchDevice = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };

    // Initial checks
    updateDeviceType();

    // Add event listener for resize
    window.addEventListener("resize", updateDeviceType);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", updateDeviceType);
    };
  }, []);

  return { isDesktop, isTablet, isMobile, isTouchDevice, size, isClient };
};

export default useMediaQuery;
