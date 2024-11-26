"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import TopTabBar from "@/components/common/TopTabBar";
import { pageUrlConstants } from "@/lib/constants";
import { replaceRoutes } from "@/store/actions/historyActions";
import { useEffect } from "react";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const { profile } = pageUrlConstants;

const ProfilePurchaseRecord = ({ children }) => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  let labelList = {
    comic: {
      name: t("Profile.purchase.comic_h"),
    },
    anime: {
      name: t("Profile.purchase.animate"),
    },
    video: {
      name: t("Profile.purchase.video"),
    },
    novel: {
      name: t("Profile.purchase.novel"),
    },
    photo: {
      name: t("Profile.purchase.meitu"),
    },
    social: {
      name: t("Profile.purchase.and_chill"),
    },
  };

  const clickTabLabel = (key) => {
    let upCass = key.slice(0, 1);
    upCass = upCass.toUpperCase();
    useGlobalDispatch(
      replaceRoutes(
        profile.pages.profilePurchaseRecord.pages[
          "profilePurchaseRecord" + upCass + key.slice(1)
        ]
      )
    );
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <TopBarContainer>
            <TopTitleBar
              title={t("Profile.main.option.history.buy")}
              showBack={true}
              show_back_color="#ffffff"
            />
            <TopTabBar labelList={labelList} callback={clickTabLabel} />
          </TopBarContainer>
        ),
      },
    });
  }, []);

  return (
    <ProfilePurchaseRecordElement
      main_height={state.navbar.mainHeight}
      sub_height={state.navbar.subHeight}
    >
      {children}
    </ProfilePurchaseRecordElement>
  );
};

export default ProfilePurchaseRecord;

export const ProfilePurchaseRecordElement = styled.div.withConfig({
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
