import { useCallback, useEffect, useMemo, useRef } from "react";
import Lottie from "lottie-react";
import styled from "styled-components";

import toTopAnime from "@public/images/shared/top.json";
import { useGlobalContext } from "@/store";

const ScrollToTop = () => {
  if (window === undefined) {
    return null;
  }

  const { state } = useGlobalContext();

  const status = useMemo(() => {
    return state.scrollToTopStatus;
  }, [state.scrollToTopStatus]);

  const animeRef = useRef();
  function pause() {
    animeRef.current.pause();
    animeRef.current.goToAndStop(300, true);
  }
  function play() {
    animeRef.current.play();
  }
  useEffect(() => {
    animeRef.current.goToAndStop(300, true); // (幾豪秒的動畫,要不要秀)
  }, []);
  const scrollToTop = useCallback(() => {
    pause();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  return (
    <ScrollToTopElement
      bottom_nav_height={state.navbar.bottomNavHeight}
    >
      <Lottie
        onClick={scrollToTop}
        onMouseLeave={pause}
        onMouseEnter={play}
        className={`animation ${status && "active"}`}
        animationData={toTopAnime}
        lottieRef={animeRef}
      />
    </ScrollToTopElement>
  );
};
const ScrollToTopElement = styled.div`
  ${({ bottom_nav_height }) => `
    /*  */
    .animation {
        display:none;
        width: 60px;
        height: 60px;
        position: fixed;
        bottom: 5%;
        right: 5%;
        z-index: 11;
        background-color: #fff;
        border-radius: 60px;
        opacity: 0;
        @media (max-width: 599px) {
        width: 60px;
        height: 60px;
        right: 0%;
        bottom: ${bottom_nav_height + 5}px;
        }
        &.active {
        display:block;
        opacity: 1;
        transition: 1s;
        cursor: pointer;
        }
    }
    `}
`;

export default ScrollToTop;
