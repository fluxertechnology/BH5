"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import TopTabBar from "@/components/common/TopTabBar";
import { replaceRoutes } from "@/store/actions/historyActions";
import { pageUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const { profile } = pageUrlConstants;
const ProfileWatchHistory = ({ children }) => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  let labelList = {
    comic: {
      name: t("Profile.purchase.comic_h"),
    },
    anime: {
      name: t("Profile.purchase.animate"),
    },
  };

  const clickTabLabel = (key) => {
    let upCass = key.slice(0, 1);
    upCass = upCass.toUpperCase();
    useGlobalDispatch(
      replaceRoutes(
        profile.pages.profileWatchHistory.pages[
          "profileWatchHistory" + upCass + key.slice(1)
        ]
      )
    );
  };
  return (
    <ProfileWatchHistoryElement
      main_height={state.navbar.mainHeight}
      sub_height={state.navbar.subHeight}
    >
      <TopBarContainer>
        <TopTitleBar
          title={t("Profile.main.option.history.watch")}
          showBack={true}
          show_back_color="#ffffff"
        />
        <TopTabBar labelList={labelList} callback={clickTabLabel} />
      </TopBarContainer>
      {children}
    </ProfileWatchHistoryElement>
  );
};

export default ProfileWatchHistory;

export const ProfileWatchHistoryElement = styled.div.withConfig({
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
