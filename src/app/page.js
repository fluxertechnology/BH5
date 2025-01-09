"use client";

import React, { useState, useEffect, use } from "react";
import styled from "styled-components";

import LoadingContent, {
  LoadingContentElement,
} from "@/components/start/LoadingContent";

import PopAdsCover, {
  PopAdsCoverElement,
} from "@/components/start/PopAdsCover";

import { DownloadCoverElement } from "@/components/start/DownloadCover";

import { checkDataExpired } from "@/store/actions/utilities";
import useMediaQuery from "@/hooks/useMediaQuery";
import { pushRoutes } from "@/store/actions/historyActions";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { pageUrlConstants } from "@/lib/constants";

const startpageBg = "/images/start/startpage.jpg";
const { home } = pageUrlConstants;

const StartPage = () => {
  const { state } = useGlobalContext();
  const { isMobile, isClient } = useMediaQuery();
  const [downloadShow, setDownloadShow] = useState(!isMobile);
  // useEffect(() => {
  //   console.log(window.localStorage.getItem("downloadTime", Date.now()), "222");
  //   if (checkDataExpired("downloadTime", 1000 * 60 * 60)) {
  //     window.localStorage.setItem("downloadTime", Date.now());
  //     setDownloadShow(true);
  //   }
  // }, []);

  const closeAds = () => {
    useGlobalDispatch(pushRoutes(home.pages.homeMain));
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setTimeout(() => closeAds(), 500);
    }
  }, [isMobile]);

  return (
    <StartPageElement isMobile={isMobile}>
      {isMobile && (
        <React.Fragment>
          <PopAdsCover
            popAdsImg={state.adsList.launch_random_banner}
            closeAds={closeAds}
            adsList={state.adsList}
          />
          <LoadingContent
            loadingStr={
              !state.adsList
                ? "正在读取"
                : !state.adsList.launch_random_banner
                ? "加载广告"
                : "图片加载中"
            }
          />
        </React.Fragment>
      )}
    </StartPageElement>
  );
};

export default StartPage;

const StartPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isMobile"].includes(prop),
})`
  /*  */
  position: relative;
  z-index: 21;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #fff;
  background-image: url(${({ isMobile }) => isMobile && startpageBg});
  ${LoadingContentElement} {
    position: absolute;
    bottom: 11%;
    left: 50%;
    transform: translateX(-50%);
  }
  ${DownloadCoverElement} {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 3;
  }
  ${PopAdsCoverElement} {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
  }
`;
