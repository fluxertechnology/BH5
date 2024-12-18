"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { pageUrlConstants } from "@/lib/constants";
import { replaceRoutes } from "@/store/actions/historyActions";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const { profile } = pageUrlConstants;

const ProfileBuyVip = ({ children }) => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  const clickTabLabel = (key) => {
    let upCass = key.slice(0, 1);
    upCass = upCass.toUpperCase();
    useGlobalDispatch(
      replaceRoutes(
        profile.pages.profileBuyVip.pages[
          "profileBuyVip" + upCass + key.slice(1)
        ]
      )
    );
  };
  return (
    <ProfileBuyVipElement
      main_height={state.navbar.mainHeight}
      bottom_nav_height={state.navbar.bottomNavHeight}
    >
      <TopBarContainer>
        <TopTitleBar
          showBack={true}
          show_back_color="#ffffff"
          title={t("Profile.build.label.card.member")}
        />
      </TopBarContainer>
      {children}
    </ProfileBuyVipElement>
  );
};

export default ProfileBuyVip;

const ProfileBuyVipElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["main_height", "bottom_nav_height"].includes(prop),
})`
  ${({ main_height, bottom_nav_height }) => `
    /*  */
    padding-top: ${main_height}px;
    padding-bottom: ${bottom_nav_height}px;

    .grid {
        background-color: #fff;
    }

    .container {
        position: relative;
    }
  `}
`;
