import { useEffect, useCallback } from "react";
import throttle from "lodash.throttle";
import { updateScrollToTopStateAction } from "@/store/actions/config";
import { useGlobalDispatch } from "@/store";

export default function HTMLEvent() {
  const onScrollBottom = useCallback(() => {
    if (window.scrollY > window.innerHeight / 2) {
      useGlobalDispatch(updateScrollToTopStateAction(true));
    } else {
      useGlobalDispatch(updateScrollToTopStateAction(false));
    }
  });
  const throttleUpdateScroll = throttle(onScrollBottom, 100);
  useEffect(() => {
    window.addEventListener("scroll", throttleUpdateScroll);
    return () => {
      window.removeEventListener("scroll", throttleUpdateScroll);
    };
  }, []);

  return { onScrollBottom };
}
