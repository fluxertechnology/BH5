import { useEffect, useState } from "react";

/**
 * Custom hook to detect device type based on media queries and touchscreen capability.
 * @returns {Object} - An object containing booleans for isDesktop, isTablet, isMobile, isTouchDevice, and the window size.
 */

const useMediaQuery = () => {
  const userAgent = navigator.userAgent;
  const isMobileUA = /mobile|android|iphone|ipad|phone/i.test(userAgent);
  const isTabletUA = /tablet|ipad/i.test(userAgent);
  const isDesktopUA = !isMobileUA && !isTabletUA;

  const [isDesktop, setIsDesktop] = useState(isDesktopUA);
  const [isTablet, setIsTablet] = useState(isTabletUA);
  const [isMobile, setIsMobile] = useState(isMobileUA);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const isClient = typeof window !== "undefined";
  const [size, setSize] = useState([
    isClient ? window.innerWidth : isClient,
    isClient ? window.innerHeight : 1080,
  ]); // Initialize with current window size

  useEffect(() => {

    if (!isClient) {
      return;
    }
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
