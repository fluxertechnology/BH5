"use client";

import { useRef, useEffect } from "react";
import StickyShareButton from "@/components/common/StickyShareButton";
import { useGlobalContext } from "@/store";
import { usePathname } from "next/navigation";

export default function HomeTcgLayout({ children }) {
  const shareThisRef = useRef(null);
  const isClientSide = typeof window !== "undefined";
  const { state } = useGlobalContext();
  const pathname = usePathname();

  useEffect(() => {
    if (!isClientSide) return;

    function scrollEvent() {
      const isMobile = window.innerWidth <= 768;
      const isHome = pathname === "/home";

      if (isMobile) {
        document.body.style.paddingBottom = isHome ? "48px" : "0px";

        const shareRef = shareThisRef.current;
        if (shareRef) {
          const shareButtonRef = shareRef.buttons?.current;
          if (!shareButtonRef) return;

          const bottomLimit =
            document.body.clientHeight -
            window.innerHeight -
            (state?.navbar?.bottomNavHeight || 0);

          if (window.scrollY > bottomLimit) {
            shareButtonRef.style.display = "flex";
            shareButtonRef.style.bottom = `${
              state?.navbar?.bottomNavHeight || 0
            }px`;
            shareButtonRef.style.zIndex = 10;
          } else {
            shareButtonRef.style.display = "none";
          }
        }
      }
    }

    scrollEvent();
    window.addEventListener("scroll", scrollEvent);
    return () => window.removeEventListener("scroll", scrollEvent);
  }, [isClientSide, pathname, state?.navbar?.bottomNavHeight]);

  return (
    <>
      {children}
      <StickyShareButton ref={shareThisRef} />
    </>
  );
}
