"use client";

import { useEffect, useState, useRef, createRef } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import ProfileMainHeader from "@/components/profile/ProfileMainHeader";
import ProfileMainNav from "@/components/profile/ProfileMainNav";
import ProfileMainMissionCenter from "@/components/profile/ProfileMainMissionCenter";
import ProfileMainOptionList from "@/components/profile/ProfileMainOptionList";
import Image from "next/image";
import {
  downloadPage,
  officialContact,
  pageUrlConstants,
  profileFeedback,
  profileService,
} from "@/lib/constants";

import useMediaQuery from "@/hooks/useMediaQuery";

import FirstRecharge from "@/components/common/FirstRechargeCover";
import { toScroll, pushRoutes } from "@/store/actions/historyActions";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { updateUserDataAction } from "@/store/actions/user";
import { dailyLoginAction } from "@/store/actions/pages/profileMainAction";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import { toggleMentionAppCoverAction } from "@/store/actions/showCoverCenter";
import StickyShareButton from "@/components/common/StickyShareButton";

const number = 6 * 60 * 60;
const ProfileMain = ({ children }) => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  const mentionDescription = useRef();

  const {
    id,
    username,
    nick_name,
    avatar,
    sex,
    time,
    rank = "",
    day_usedviewcount,
    day_maxviewcount,
    day_share,
    sign,
    money,
    free_gashapon,
  } = state.user;
  let storeTime = Number(
    typeof window !== "undefined"
      ? window.localStorage.getItem("firstChargeTime")
      : 0
  );
  const [reciprocal, setReciprocal] = useState(storeTime);
  const times = {
    hour: `${0}${~~(reciprocal / 60 / 60)}`,
    min: `${(reciprocal / 60) % 60 <= 10 ? 0 : ""}${~~(
      (reciprocal / 60) %
      60
    )}`,
    sec: `${~~(reciprocal % 60) <= 9 ? 0 : ""}${~~(reciprocal % 60)}`,
  };
  const [mentionAppValue, setMentionAppValue] = useState(true);
  const firstChargeRef = createRef(null);
  const { size, isMobile } = useMediaQuery();
  const width = size[0];

  useEffect(() => {
    if (state.user.id !== "guest") {
      updataUser();
    }

    setOptionEvent({
      mission,
      switchLanguage,
      manualRecharge,
      myorder,
      purchase,
      feedback,
      socialGroup,
      notification,
      app,
      share,
      bundle,
      collect,
      watchHistory,
      service,
    });

    setTimeout(() => {
      setMentionAppValue(false);
      setTimeout(() => {
        if (mentionDescription.current)
          mentionDescription.current.style.display = "none";
      }, 1550);
    }, 6000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareThisRef = useRef(null);
  const isClientSide = typeof window !== "undefined";
  if (isClientSide) {
    useEffect(() => {
      //h5控制 shareThis位於底部nav上方位置
      function scrollEvent() {
        if (isMobile) {
          document.body.style.paddingBottom = 0;
          const shareRef = shareThisRef.current;
          if (shareRef) {
            const shareButtonRef = shareRef.buttons.current;
            if (
              window.scrollY >
              document.body.clientHeight -
                window.innerHeight -
                state.navbar.bottomNavHeight
            ) {
              shareButtonRef.style.display = "flex";
              shareButtonRef.style.bottom = `${state.navbar.bottomNavHeight}px`;
              shareButtonRef.style.zIndex = 10;
            } else {
              shareButtonRef.style.display = "none";
            }
          }
        }
        return;
      }
      scrollEvent();
      window.addEventListener("scroll", scrollEvent);
      return () => window.removeEventListener("scroll", scrollEvent);
    }, [isMobile, window.location.href]);
  }

  const [optionEvent, setOptionEvent] = useState({});

  function mission() {
    pushRoutesFunction(
      pageUrlConstants.profile.pages.profileMain.pages.profileMission
    );
  }
  function switchLanguage() {
    pushRoutesFunction(pageUrlConstants.profile.pages.profileSwitchLanguage);
  }
  function redirectBuy() {
    pushRoutesFunction(pageUrlConstants.profile.pages.profileDirectBuyVip);
  }
  function manualRecharge() {
    let link = document.createElement("a");
    link.href = state.config.group_cs ?? "";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  function app() {
    // pushRoutes(pageUrlConstants.profile.pages)
    // console.log("app");
    window.open(downloadPage[2]);
  }
  function share() {
    pushRoutesFunction(pageUrlConstants.profile.pages.profileShare);
  }
  function bundle() {
    pushRoutesFunction(
      pageUrlConstants.profile.pages.profileBundle.pages.profileBundleCoupon
    );
  }
  function collect() {
    pushRoutesFunction(
      pageUrlConstants.profile.pages.profileMyCollect.pages
        .profileMyCollectComic
    );
  }
  function service() {
    window.open(profileService);
  }
  function myorder() {
    pushRoutesFunction(pageUrlConstants.profile.pages.profileMyorder);
  }

  function watchHistory() {
    pushRoutesFunction(
      pageUrlConstants.profile.pages.profileWatchHistory.pages
        .profileWatchHistoryComic
    );
  }

  function purchase() {
    pushRoutesFunction(
      pageUrlConstants.profile.pages.profilePurchaseRecord.pages
        .profilePurchaseRecordComic
    );
  }
  function feedback() {
    window.open(profileFeedback);
  }

  function socialGroup() {
    window.open(officialContact);
  }
  function buyDiscount() {
    openFirstCharge();
  }

  function notification() {
    pushRoutesFunction(pageUrlConstants.notice);
  }
  function openFirstCharge() {
    firstChargeRef.current.handleOpen();
  }

  useEffect(() => {
    if (storeTime == null || storeTime <= 0) {
      window.localStorage.setItem("firstChargeTime", number);
    }
    const time = setInterval(() => {
      setReciprocal((prev) => {
        if (prev > 0) {
          window.localStorage.setItem("firstChargeTime", prev - 1);
          return prev - 1;
        } else {
          window.localStorage.setItem("firstChargeTime", number);
          return number;
        }
      });
    }, 1000);
    return () => time;
  }, []);
  useEffect(() => {
    return () => toScroll();
  }, []);

  const updataUser = () => {
    useGlobalDispatch(updateUserDataAction());
  };
  const dailyLogin = () => {
    if (state.user.id === "guest") {
      useGlobalDispatch(pushRoutes(pageUrlConstants.login));
    } else {
      useGlobalDispatch(dailyLoginAction(t));
    }
  };
  const pushRoutesFunction = (routes) => {
    useGlobalDispatch(pushRoutes(routes));
  };
  const showMentionAppCover = () => {
    useGlobalDispatch(toggleMentionAppCoverAction(true));
  };
  const dailyEvent = () => {
    useGlobalDispatch(dailyLoginAction(t));
  };
  const gosharef = () => {
    useGlobalDispatch(pushRoutes(pageUrlConstants.profile.pages.profileShare));
  };

  useEffect(() => {
    if (isMobile) {
      let Element = document.getElementsByTagName("header");
      if (Element.length) {
        Element[0].style.setProperty("display", "none");
      }
    }
    return () => {
      if (isMobile) {
        let Element = document.getElementsByTagName("header");
        if (Element.length) {
          Element[0].style.setProperty("display", "block");
        }
      }
    };
  }, [isMobile]);

  useEffect(() => {
    // if (!isMobile) {
    //   let Element = document.getElementsByClassName("PCFooterElement");
    //   if(Element.length){
    //     Element[0].style.setProperty("display", "none");
    //   }
    // }
    return () => {
      if (!isMobile) {
        let Element = document.getElementsByClassName("PCFooterElement");
        if (Element.length) {
          Element[0].style.setProperty("display", "block");
        }
      }
    };
  }, [isMobile]);

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        show: !isMobile,
      },
    });
  }, [isMobile]);

  return (
    <ProfileMainElement
      main_height={state.navbar.mainHeight}
      isMobile={isMobile}
    >
      <FirstRecharge ref={firstChargeRef} user={state.user} times={times} />
      <ProfileMainHeader
        id={id}
        username={username}
        nick_name={nick_name}
        avatar={avatar}
        sex={sex}
        time={time}
        rank={rank}
        day_usedviewcount={day_usedviewcount}
        day_maxviewcount={day_maxviewcount}
        day_share={day_share}
        dailyLogin={dailyLogin}
        redirectBuy={redirectBuy}
      />
      <ProfileMainNav
        free_gashapon={free_gashapon}
        group_cs={state.config.group_cs ?? ""}
        sign={sign}
        money={money}
      />
      {id !== "guest" && (
        <ProfileMainMissionCenter
          optionEvent={optionEvent}
          config={state.config}
          dailyEvent={dailyEvent}
          gosharef={gosharef}
        />
      )}
      <ProfileMainOptionList
        optionEvent={optionEvent}
        buyDiscount={buyDiscount}
      />
      <MentaionAppBannerElement root_width={width}>
        <div
          className="container"
          onClick={() => {
            showMentionAppCover();
            setMentionAppValue(false);
          }}
        >
          <div
            ref={mentionDescription}
            className={
              "container_description " + (mentionAppValue ? "open" : "")
            }
          >
            {t("Profile.main.label.description")}
            <div className="container_description_arrow">
              <div className="main_arrow">
                <div className="main_arrow_gap main_arrow_gap4"></div>
                <div className="main_arrow_body"></div>
                <div className="main_arrow_gap main_arrow_gap3"></div>
                <div className="main_arrow_body"></div>
                <div className="main_arrow_gap main_arrow_gap2"></div>
                <div className="main_arrow_body"></div>
                <div className="main_arrow_gap main_arrow_gap1"></div>
                <div className="main_arrow_body"></div>
                <div className="main_arrow_body"></div>
                <div className="main_arrow_arrowhead"></div>
              </div>
            </div>
          </div>
          <div className="container_icon">
            {/* TODO(ZY): render svg for svg path click */}
            {/* <Downloadapp className="container_icon_svg" alt="app" /> */}
            <Image
              className="container_icon_svg"
              src="/images/profile/phone.svg"
              width={0}
              height={0}
              alt="app"
            />
          </div>
        </div>
      </MentaionAppBannerElement>
      {children}
      {isMobile && (
        <StickyShareButton ref={shareThisRef} />
      )}
    </ProfileMainElement>
  );
};

export default ProfileMain;

export const ProfileMainElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height", "isMobile"].includes(prop),
})`
  ${({ main_height, isMobile }) => `
    background-color: #f4f4f4;
    margin-top: ${isMobile ? 0 : main_height}px;
    /*  */
    @media (min-width: 599px) {
        //margin-top: ${main_height}px;
    }
    @media (max-width: 599px) {
        padding-bottom: 15%;
    }
  `}
`;

const MentaionAppBannerElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["root_width"].includes(prop),
})`
  ${({ root_width }) => `
    /*  */
    position: fixed;
    right: 10px;
    bottom: calc(${bottom_nav_height}px + 5px);
    z-index: 1;

    @media only screen and (min-width: 599px) {
        right: 50%;
        bottom: 2%;
        transform: ${"translateX(" + root_width * 0.49 + "px)"};
        display: flex;
        justify-content: center;
    }

    .container {
        font-size: 12px;
        color: #fff;
        display: flex;
        justify-content: center;

        &_description,
        &_icon {
        cursor: pointer;
        display: inline-block;
        }

        &_icon {
        padding: 7px;
        background-color: #f14c7b;
        border-radius: 50%;

        &_svg {
            width: 24px;
            height: 24px;
            vertical-align: top;
            transition: 1s 1.5s;
        }
        }

        &_description {
        place-self: center;
        padding: 4px 10px;
        margin-right: 5px;
        box-sizing: border-box;
        clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
        background-color: #f14c7b;
        border-radius: 16px;
        opacity: 0%;
        transition: 1s 0.5s;

        &_arrow {
            display: inline-block;
            margin-left: 5px;
            width: 50px;
            vertical-align: text-top;
        }

        &.open {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
            opacity: 100%;

            & + .container_icon .container_icon_svg {
            width: 24px;
            height: 24px;
            transition: 0s;
            }
        }
        }
    }

    .main_arrow {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .main_arrow_gap {
        width: 6%;
    }

    .main_arrow_gap1 {
        animation: 2s arrow-gap-1 infinite;
    }

    .main_arrow_gap2 {
        animation: 2s arrow-gap-2 infinite;
    }

    .main_arrow_gap3 {
        animation: 2s arrow-gap-3 infinite;
    }

    .main_arrow_gap4 {
        animation: 2s arrow-gap-4 infinite;
    }

    .main_arrow_body {
        width: 12%;
        height: 8px;
        background-color: #fff;
    }

    .main_arrow_arrowhead {
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid #fff;
        animation: 2s arrow-head infinite;
    }

    @keyframes arrow-gap-1 {
        0% {
        width: 4%;
        }

        50% {
        width: 4%;
        }

        85% {
        width: 6%;
        }

        88% {
        width: 3%;
        }

        100% {
        width: 4%;
        }
    }

    @keyframes arrow-gap-2 {
        0% {
        width: 4%;
        }

        50% {
        width: 4%;
        }

        85% {
        width: 6%;
        }

        91% {
        width: 3%;
        }

        100% {
        width: 4%;
        }
    }

    @keyframes arrow-gap-3 {
        0% {
        width: 4%;
        }

        50% {
        width: 4%;
        }

        85% {
        width: 6%;
        }

        94% {
        width: 3%;
        }

        100% {
        width: 4%;
        }
    }

    @keyframes arrow-gap-4 {
        0% {
        width: 4%;
        }

        50% {
        width: 4%;
        }

        85% {
        width: 6%;
        }

        97% {
        width: 3%;
        }

        100% {
        width: 4%;
        }
    }

    @keyframes arrow-head {
        0% {
        transform: scale(1);
        }

        50% {
        transform: scale(1);
        }

        75% {
        transform: scale(1, 0.8);
        }

        95% {
        transform: scale(1, 1.05);
        }

        100% {
        transform: scale(1, 1);
        }
    }
  `}
`;
