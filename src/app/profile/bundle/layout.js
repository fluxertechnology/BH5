"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";

import TopBarContainer, {
  main_height,
  sub_height,
} from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import TopTabBar from "@/components/common/TopTabBar";
// import SwitchRoute from "../component/SwitchRoute";
import useMediaQuery from "@/hooks/useMediaQuery";
import { replaceRoutes } from "@/store/actions/historyActions";
import { pageUrlConstants, requestUrlConstants } from "@/lib/constants";
import React, { useEffect } from "react";
import store, { useGlobalContext, useGlobalDispatch } from "@/store";
import axiosRequest from "@/lib/services/axios";

function ProfileBundleMain({ children }) {
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const { dispatch } = useGlobalContext();

  const makeCouponRead = () => {
    useGlobalDispatch({
      type: "INIT_USER",
      data: {
        new_coupon_notification: false,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer show_shadow={false}>
              <TopTitleBar
                title={t("Profile.build.label.my_gift")}
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

  useEffect(() => {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    axiosRequest
      .post(requestUrlConstants.postReadCouponUrl, formData)
      .then(() => {
        makeCouponRead();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let labelList = {
    reward: {
      name: t("Profile.build.label.reward"),
    },
    coupon: {
      name: t("Profile.build.label.coupon"),
    },
    // gift:{
    //   name: "礼物"
    // },
  };
  return (
    <ProfileBundleMainElement>
      <div className="bundle_container">
        {/* <SwitchRoute routes={routes} routesStep={3} /> */}
        {children}
      </div>
    </ProfileBundleMainElement>
  );
};

const clickTabLabel = (key) => {
  let upCass = key.slice(0, 1);
  upCass = upCass.toUpperCase();
  useGlobalDispatch(
    replaceRoutes(
      pageUrlConstants.profile.pages.profileBundle.pages[
        "profileBundle" + upCass + key.slice(1)
      ]
    )
  );
};

export const ProfileBundleMainElement = styled.div`
  /*  */
  padding-top: ${main_height + sub_height}px;

  .bundle_container {
    position: relative;
  }
`;

export default ProfileBundleMain;