"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";

import TopBarContainer, {
  main_height,
  sub_height
} from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { replaceRoutes } from "@/store/actions/historyActions";
import { pageUrlConstants } from "@/lib/constants";
const { profile } = pageUrlConstants;
import React, { useEffect } from "react";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import TopTabBar from "@/components/common/TopTabBar";

function ProfileMyCollect({ children }) {
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const { dispatch } = useGlobalContext();
  let labelList = {
    comic: {
      name: t("Profile.my.collect.comic"),
    },
    anime: {
      name:  t("Profile.my.collect.anime"),
    },
    video: {
      name:  t("Profile.my.collect.video"),
    },
    novel: {
      name:  t("Profile.my.collect.novel"),
    },
    photo: {
      name:  t("Profile.my.collect.photo"),
    },
  };

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
              <TopTitleBar
                title={t("Profile.my.collect.own.collect")}
                showBack={true}
                show_back_color="#ffffff"
              />
              <TopTabBar labelList={labelList} callback={clickTabLabel} />
            </TopBarContainer>
          </>
        ),
      }
    });
  }, [isMobile]);

  return (
    <ProfileMyCollectElement>
      <div className="container">
        {/* <SwitchRoute routes={routes} routesStep={2} /> */}
        {children}
      </div>
    </ProfileMyCollectElement>
  );
}

const clickTabLabel = (key) => {
  let upCass = key.slice(0, 1);
  upCass = upCass.toUpperCase();
  useGlobalDispatch(
    replaceRoutes(profile.pages.profileMyCollect.pages["profileMyCollect" + upCass + key.slice(1)])
  );
};


export const ProfileMyCollectElement = styled.div`
  /*  */
  padding-top: ${main_height + sub_height}px;

  .container {
    position: relative;
  }
`;

export default ProfileMyCollect;
