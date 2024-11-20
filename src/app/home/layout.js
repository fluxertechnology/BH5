"use client";

import { useState, useRef, useEffect, createRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";

import TopTabBar from "@/components/common/TopTabBar";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import FloatAds from "@/components/index/FloatAds";
import StickyShareButton from "@/components/common/StickyShareButton";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import Image from "next/image";

import useMediaQuery from "@/hooks/useMediaQuery";
import {
  capsuleUrl,
  colors,
  downloadPage,
  pageUrlConstants,
} from "@/lib/constants";
import DraggableComponent from "@/components/index/DraggableComponent";
import WavaButton from "@/components/layout/Header/WavaButton";
import { pushRoutes } from "@/store/actions/historyActions";

const { home } = pageUrlConstants;
const store =
  typeof window !== "undefined" &&
  window.sessionStorage.getItem("downloadAppTipShowed");

const HomeLayout = ({ children }) => {
  const t = useTranslations();
  const { state, dispatch } = useGlobalContext();

  const shareThisRef = useRef(null);
  const firstChargeRef = createRef(null);
  const [slide_height, setSlide_height] = useState(0);

  // let storeTime = Number(window.localStorage.getItem("firstChargeTime"));
  // const [reciprocal, setReciprocal] = useState(storeTime);

  const { isMobile } = useMediaQuery();
  const isClientSide = typeof window !== "undefined";

  // const times = {
  //   hour: `${0}${~~(reciprocal / 60 / 60)}`,
  //   min: `${(reciprocal / 60) % 60 <= 10 ? 0 : ""}${~~(
  //     (reciprocal / 60) %
  //     60
  //   )}`,
  //   sec: `${~~(reciprocal % 60) <= 9 ? 0 : ""}${~~(reciprocal % 60)}`,
  // };
  // const { hour, min, sec } = times;

  // useEffect(() => {
  //   if (storeTime == null || storeTime <= 0) {
  //     window.localStorage.setItem("firstChargeTime", number);
  //   }
  //   const time = setInterval(() => {
  //     setReciprocal((prev) => {
  //       if (prev > 0) {
  //         window.localStorage.setItem("firstChargeTime", prev - 1);
  //         return prev - 1;
  //       } else {
  //         window.localStorage.setItem("firstChargeTime", number);
  //         return number;
  //       }
  //     });
  //   }, 1000);
  //   return () => time;
  // }, []);

  let labelList = {
    anime: {
      name: t("Navbar.top_navigator_animate_comic"),
    },
    videos: {
      name: t("Navbar.top_navigator_video"),
    },
    photos: {
      name: t("Navbar.top_navigator_meitu"),
    },
    novels: {
      name: t("Navbar.top_navigator_novel"),
    },
    // streams: {
    //   name: t('Navbar.top_navigator_stream')
    // },
    // doujin 韓漫
    "k-comics": {
      name: t("Navbar.top_navigator_kcomics"),
    },
    // doujin 同人
    doujin: {
      name: t("Navbar.top_navigator_doujin"),
    },
    "3D": {
      name: t("Navbar.top_navigator_3d"),
    },
    ranking: {
      name: t("Navbar.top_navigator_ranking"),
    },
    free: {
      name: t("Navbar.top_navigator_free_watch"),
    },
  };
  labelList = isMobile
    ? {
        ...labelList,
        comic: {
          name: t("Global.comics"),
        },
        animes: {
          name: t("Global.animate"),
        },
        games: {
          name: t("Game.label.game"),
        },
      }
    : labelList;

  function sliderMove(el) {
    setSlide_height(el.el.offsetHeight);
  }

  const newNotice = useMemo(() => {
    let newNotice = 0;
    let noticeList = state.noticeList || [];
    let noticeListRead = state.noticeListRead || [];
    for (let i = 0; i < noticeList.length; i++) {
      if (noticeListRead.indexOf(noticeList[i].id) === -1) {
        newNotice++;
      }
    }
    return newNotice;
  }, [state.noticeList, state.noticeListRead]);

  const clickAvatar = () => {
    // console.log("這邊要判斷登入狀態");
    const userData = state.user;
    if (userData.id !== "guest") {
      useGlobalDispatch(pushRoutes(profile));
    } else {
      useGlobalDispatch(pushRoutes(login));
    }
  };
  const clickSearch = () => {
    useGlobalDispatch(pushRoutes(home.pages.homeSearch));
  };
  const clickHome = () => {
    useGlobalDispatch(pushRoutes(home.pages.homeMain));
  };
  const clickNew = () => {
    useGlobalDispatch(pushRoutes(notice));
  };
  const clickTabLabel = (key, dynamic) => {
    console.log(key, "key");
    if (key === "ranking") {
      useGlobalDispatch(
        pushRoutes(home.pages.homeLeaderboard.pages.homeLeaderboardComic)
      );
    } else if (key === "games") {
      useGlobalDispatch(pushRoutes(home.pages.homeGame));
    } else {
      let upCass = key.slice(0, 1);
      upCass = upCass.toUpperCase();
      useGlobalDispatch(
        pushRoutes({
          name: home.pages.homeMain.pages["home" + upCass + key.slice(1)].name,
          path: home.pages.homeMain.pages["home" + upCass + key.slice(1)].path,
          dynamic: {
            tab: dynamic,
          },
        })
      );
    }
    // useGlobalDispatch(pushRoutes(home.pages.homeMain.pages["home" + upCass + key.slice(1) + (key === "videos" ? "Select" : "")])); 經討論 暫時拔掉影片過度頁
  };
  const closeHomeFloatAds = () => {
    useGlobalDispatch(toggleHomeFloatAdsAction(false));
  };
  const toPaymentPage = () => {
    useGlobalDispatch(updateRechargeStateAction(true));
    useGlobalDispatch(pushRoutes(profile.pages.profilePayment));
  };

  if (isClientSide) {
    useEffect(() => {
      //h5控制 shareThis位於底部nav上方位置
      function scrollEvent() {
        if (isMobile) {
          if (window.location.href.includes(home.pages.homeMain.path)) {
            document.body.style.paddingBottom = "48px";
          } else {
            document.body.style.paddingBottom = 0;
          }
          const shareRef = shareThisRef.current;
          if (shareRef) {
            const shareButtonRef = shareRef.buttons.current;
            if (
              window.scrollY >
              document.body.clientHeight -
                window.innerHeight -
                bottom_nav_height
            ) {
              shareButtonRef.style.display = "flex";
              shareButtonRef.style.bottom = `${bottom_nav_height}px`;
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

  const TopTabBarComponent = () => {
    return (
      <TopTabBar labelList={labelList} callback={clickTabLabel} indexColumn />
    );
  };
  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      data: {
        isPlaceholder: true,
        clickSearch,
        clickHome,
        clickHome,
        clickAvatar,
        clickNew,
        appendComponent: TopTabBarComponent,
      },
    });
  }, []);

  return (
    <HomeLayoutElement
      main_height={state.navbar.mainHeight}
      sub_height={state.navbar.subHeight}
      bottom_nav_height={state.navbar.bottomNavHeight}
    >
      <CSSTransition
        timeout={200}
        in={state.showCoverCenter.homeFloatAds}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_floatAds"
      >
        <FloatAds
          closeHomeFloatAds={() => {
            closeHomeFloatAds();
            setSlide_height(0);
          }}
          callback={sliderMove}
        />
      </CSSTransition>
      {/* PC H5 sharethis  無法熱更新 */}
      <StickyShareButton ref={shareThisRef} />
      <DraggableComponent
        type="capsule"
        slide_height={slide_height}
        key="CSSTransition_floatCapsule"
        position_style={{
          left: "auto",
          bottom: isMobile
            ? slide_height + bottom_nav_height + "px"
            : bottom_nav_height * 3 + "px",
          right: isMobile ? 0 : "85px",
        }}
        direct_route={
          capsuleUrl +
          "?id=" +
          state.user.id +
          "&free=" +
          state.user.free_gashapon
        }
        css_in={~~state.config.gashapon_status === 1}
      >
        <Image
          draggable={false}
          className="capsule_container_link_img"
          width={0}
          height={0}
          src="/images/home/capsule.svg"
          alt="capsule"
        />
      </DraggableComponent>

      {/* <DraggableComponent
          slide_height={slide_height}
          key="CSSTransition_float"
          css_in={~~user.pay_record === 0}
          position_style={{
            left: isMobile ? 0 : "auto",
            bottom: isMobile
              ? slide_height + bottom_nav_height + "px"
              : bottom_nav_height * 1.5 + "px",
            right: isMobile ? "auto" : "85px",
          }}
          onClick={openFirstCharge}
        >
          <div className="recharge">
            <img
              draggable={false}
              className="capsule_container_link_img cursor"
              src={first_charge_img}
              alt="first_charge_img"
            />
            <div className="recharge_float_time">
              <div className="recharge_float_time_bg" />
              <div className="recharge_float_time_text">
                {hour + ":" + min + ":" + sec}
              </div>
            </div>
          </div>
        </DraggableComponent> */}

      {/* <FirstRecharge ref={firstChargeRef} user={user} times={times} /> */}
      {children}
      {isMobile && <MobileBottomDownloadAppTip />}
    </HomeLayoutElement>
  );
};

export default HomeLayout;

const HomeLayoutElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["main_height", "sub_height"].includes(prop),
})`
  ${({ main_height, sub_height }) => `
    /*  */
    padding-top: ${main_height + sub_height}px;
    position: relative;
    @media (max-width: 899px) {
      padding-bottom: ${bottom_nav_height}px;
    }
    .float_category {
      position: fixed;
      overflow: scroll;
      top: ${main_height + sub_height}px;
      right: 0;
      z-index: 10;
      background-color: #fff;
      padding: 10px 0;
      border-radius: 5px;
    }

    .container {
      position: relative;
    }

    .recharge {
      cursor: pointer;
      position: relative;
      &_float_time {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: center;
        width: 100%;
        color: #fff;
        padding: 1px 0;
        &_bg {
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          position: absolute;
          background-color: #010001;
          opacity: 0.55;
          z-index: 9;
        }
        &_text {
          z-index: 10;
        }
      }
    }
  `}
`;

const MobileBottomDownloadAppTip = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    var ua = navigator.userAgent;
    var android = ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1; // android
    if (android == true && store !== "true") {
      setShow(true);
    }
  }, []);
  function handleClose() {
    window.sessionStorage.setItem("downloadAppTipShowed", true);
    setShow(false);
  }
  function handleOpen() {
    window.open(downloadPage[0]);
  }

  return (
    <MobileBottomDownloadAppTipElement show={show}>
      <div className="download_bg" />
      <div className="download_container">
        <Image
          src="/images/shared/close.png"
          width={0}
          height={0}
          alt="BH5 close"
          className="download_container_close"
          onClick={handleClose}
        />
        <Image
          src="/images/shared/bh5.jpg"
          width={0}
          height={0}
          alt="BH5 Logo"
          className="download_container_logo"
        />
        <div className="download_text">
          <div className="download_text_top">前往”B次元”APP</div>
          <div className="download_text_bottom">即刻顺畅观看最新动漫！</div>
        </div>
        <div onClick={handleOpen}>
          <WavaButton className="download_button">下載APP</WavaButton>
        </div>
      </div>
    </MobileBottomDownloadAppTipElement>
  );
};
const MobileBottomDownloadAppTipElement = styled.div`
  /*  */
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 999;
  height: ${bottom_nav_height + 20}px;
  display: ${({ show }) => (show ? "auto" : "none")};
  .download {
    &_bg {
      top: 0;
      bottom: 0;
      right: -1px;
      left: 0;
      background-color: #010001;
      position: absolute;
      opacity: 0.8;
    }

    &_container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-around;
      white-space: nowrap;
      height: 100%;
      gap: 0.5vw;
      @media (min-width: 599px) {
        justify-content: center;
      }
      &_close {
        width: 25px;
      }
      &_logo {
        border-radius: 10px;
        width: 60px;
      }
    }

    &_text {
      display: flex;
      flex-direction: column;
      justify-content: center;

      &_top {
        color: #f24c7c;
        opacity: 0.9;
        font-weight: 600;
      }
      &_bottom {
        color: #a8a8a8;
      }
    }
    &_button {
      flex-shrink: 0;
      display: inline-block;
      overflow: hidden;
      color: #fff;
      background-color: ${colors.back_dark_pink};
      border-radius: 50px;
      padding: 0.6em 1em;
    }
  }
`;
