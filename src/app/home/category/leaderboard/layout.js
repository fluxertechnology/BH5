"use client";

import { useTranslations } from "next-intl";
import ImageCarousel from "@/components/common/ImageCarousel";
import { adsKeys } from "@/lib/constants";
import styled from "styled-components";

import { replaceRoutes } from "@/store/actions/historyActions";
import { pageUrlConstants } from "@/lib/constants";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useEffect } from "react";
import TopTitleBar from "@/components/common/TopTitleBar";
import TopTabBar from "@/components/common/TopTabBar";

const { home } = pageUrlConstants;

const HomeLeaderboard = ({ children }) => {
  const { state, dispatch } = useGlobalContext();

  const t = useTranslations();
  const { isMobile } = useMediaQuery();

  let labelList = {
    comic: {
      name: t("Leaderboard.tab.h_comic"),
    },
    anime: {
      name: t("Leaderboard.tab.h_animate"),
    },
  };

  const clickTabLabel = (key) => {
    let upCass = key.slice(0, 1);
    upCass = upCass.toUpperCase();
    useGlobalDispatch(
      replaceRoutes(
        home.pages.homeLeaderboard.pages[
          "homeLeaderboard" + upCass + key.slice(1)
        ]
      )
    );
  };

  const CustomTopBar = () => {
    return (
      <>
        <TopTitleBar
          title={t("Leaderboard.")}
          showBack={true}
          show_back_color="#ffffff"
        />
        <TopTabBar
          labelList={labelList}
          callback={clickTabLabel}
          disabledIndent
        />
      </>
    );
  };
  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: CustomTopBar,
      },
    });
  }, []);

  return (
    <HomeLeaderboardElement
      main_height={state.navbar.mainHeight}
      sub_height={state.navbar.subHeight}
    >
      <ImageCarousel
        adsKey={adsKeys.home}
        threeInOneBanner={!isMobile}
        is_cover
        size="banner_main"
      />
      {children}
    </HomeLeaderboardElement>
  );
};

export default HomeLeaderboard;

const HomeLeaderboardElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height", "sub_height"].includes(prop),
})`
  ${({ main_height, sub_height }) => `
    /*  */
    padding-top: ${main_height + sub_height}px;

    .container {
        position: relative;
    }
    `}
`;
