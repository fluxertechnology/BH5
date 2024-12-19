import React, { memo, useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import Image from "next/image";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie"; // Make sure to import Cookies
import store from "@/store";
import Searchbar from "@/components/common/Searchbar";
import {
  colors,
  downloadPage,
  padding,
  pageUrlConstants,
} from "@/lib/constants";
import { backRoutes, pushRoutes } from "@/store/actions/historyActions";
import WavaButton from "@/components/layout/Header/WavaButton";
import { setLanguage, useLang } from "@/i18n/Metronici18n";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { updateRechargeStateAction } from "@/store/actions/config";

import ImageComponent from "@/components/common/ImageComponent";

import { dailyLoginAction } from "@/store/actions/pages/profileMainAction";
import callToast from "@/lib/services/toastCall";
import { userFBLoginOutAction, userLoginOutAction } from "@/store/actions/user";
import { clearVipInfoAction } from "@/store/actions/pages/profileBuyVipCommonAction";
import { initPostData } from "@/store/actions/pages/postMainAction";
import { postSearchWatchHistoryAction } from "@/store/actions/pages/profileWatchHistory";
import ProfileWatchHistoryAnimeHandle from "@/app/profile/watch_history/anime/page";
import ProfileWatchHistoryComicHandle from "@/app/profile/watch_history/comic/page";

const { home, post, social, vendor, profile, notice, login } = pageUrlConstants;
const areEqual = (pre, next) => {
  return JSON.stringify(pre) === JSON.stringify(next);
};
let timer;
let touchduration = 500;

const QrCode = ({ scroll }) => {
  const t = useTranslations();
  function qrcodeStart(e) {
    timer = setTimeout(qrcodeLong, touchduration);
  }
  function qrcodeEnd(e) {
    if (timer) {
      clearTimeout(timer);
    }
  }

  function qrcodeLong() {
    let link = document.createElement("a");
    link.href = downloadPage[1];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }
  return (
    <QrCodeElement scroll={scroll}>
      <div className="qrcode">
        <Image
          className={"search_bar_nav_item_btn_img"}
          src={
            scroll
              ? "/images/header/topbar/download_dark.svg"
              : "/images/header/topbar/download.svg"
          }
          width={0}
          height={0}
          alt={"download"}
        />
        {t("Global.action.download_app")}
        <div className="qrcode_float">
          <div className="qrcode_float_left">
            <div className="qrcode_float_left_top">
              {t("Global.action.download_app_description")}
            </div>
            <div className="qrcode_float_left_bottom">
              {t("Global.action.download_app_description_1")}
            </div>
          </div>

          <QRCode
            className="qrcode_img"
            value={downloadPage[1]}
            onTouchStart={qrcodeStart}
            onTouchEnd={qrcodeEnd}
          />
        </div>
      </div>
    </QrCodeElement>
  );
};
const QrCodeElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["scroll"].includes(prop),
})`
  /*  */
  display: flex;
  align-items: center;
  .qrcode {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    white-space: nowrap;
    font-size: 12px;
    border-radius: 4px;
    border: solid 2px ${({ scroll }) => (scroll ? colors.text_grey : "#fff")};
    padding: 5px;
    color: ${({ scroll }) => (scroll ? colors.text_grey : "#fff")};

    &_img {
      width: 70px !important;
      height: 70px !important;
    }

    &_float {
      display: none;

      &_left {
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        &_top {
          font-weight: 600;
          color: ${colors.back_dark_pink};
          margin-bottom: 5px;
        }
        &_bottom {
          color: #d5d5d5;
        }
      }
    }
    li {
      margin: 5px;
    }
    &:hover {
      .qrcode_float {
        padding: 5px;
        gap: 10px;
        color: ${colors.text_grey};
        background-color: #fff;
        text-align: center;
        position: absolute;
        display: flex;
        top: 40px;
        right: 0;
        z-index: 999;
        border-radius: 5px;
        box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
        z-index: 1;
      }
    }
  }
`;

const LanguageList = [
  { name: "簡體中文", lang: "tc" },
  { name: "English", lang: "en" },
];

const TopSearchBar = ({ isPlaceholder = true }) => {
  const t = useTranslations();
  const router = useRouter();

  const changeLanguage = (newLocale) => {
    Cookies.set("NEXT_LOCALE", newLocale, { path: "/" });
    router.refresh();
  };
  const lang = Cookies.get("NEXT_LOCALE");

  // const lang = useLang();
  const ContainerRef = useRef();
  const [scroll, setScroll] = useState(false);
  const [questInfoList, setQuestInfoList] = useState([]);
  const [membershipDate, setMembershipDate] = useState("");
  const [tabValue, setTabValue] = React.useState(1);

  const { state } = useGlobalContext();
  const location = usePathname();

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

  const [navList] = useState(() => [
    {
      intlKey: "Navbar.bottom_navigator_index",
      name: home.pages.homeMain.name,
      path: home.pages.homeMain.path,
      image: "/images/header/home.svg",
      activeImage: "/images/header/home_selected_btn.png",
    },
    {
      intlKey: "Navbar.bottom_navigator_dynamic",
      name: post.pages.postMain.name,
      path: post.pages.postMain.path,
      image: "/images/header/feed.svg",
      activeImage: "/images/header/feed_selected_btn.png",
    },
    // {
    //   cname: intl.formatMessage({ id: "BOTTOM.NAVIGATOR.AND_CHILL" }),
    //   name: social.name,
    //   path: social.path,
    //   image: socialIcon,
    //   activeImage: socialIconSelected,
    // },
    {
      intlKey: "Navbar.bottom_navigator_mall",
      name: vendor.name,
      path: vendor.path,
      image: "/images/header/vendor.svg",
      activeImage: "/images/header/shop_selected_btn.png",
    },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onScroll = () => {
        let { scrollY } = window;
        setScroll(Boolean(scrollY));
        let TargetStyle = ContainerRef?.current?.style; //不加問號目前好像動作太快會故障
        if (TargetStyle) {
          TargetStyle.transition = "0.2s";
          if (scrollY) {
            TargetStyle.backgroundColor = "#fff";
            TargetStyle.borderBottom = "0.5px grey dotted";
          } else {
            TargetStyle.backgroundColor = colors.dark_pink;
            TargetStyle.borderBottom = "none";
          }
        }
      };
      window.addEventListener("scroll", onScroll);
      return function cleanup() {
        window.removeEventListener("scroll", onScroll);
      };
    }
  });

  // useEffect(() => {
  //   const onScroll = () => {
  //     let { scrollY } = window;
  //     setScroll(Boolean(scrollY));
  //     console.log("set scroll", scroll, Boolean(scrollY));
  //     let TargetStyle = ContainerRef?.current?.style; //不加問號目前好像動作太快會故障
  //     if (TargetStyle) {
  //       TargetStyle.transition = "0.2s";
  //       if (scrollY) {
  //         TargetStyle.backgroundColor = "#fff";
  //         TargetStyle.borderBottom = "0.5px grey dotted";
  //       } else {
  //         TargetStyle.backgroundColor = colors.dark_pink;
  //         TargetStyle.borderBottom = "none";
  //       }
  //     }
  //   };
  //   window.addEventListener("scroll", onScroll);
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, []);

  useEffect(() => {
    let daily = [
      {
        icon: "/images/icons/coin.svg",
        title: t("Profile.permission.signin.everyday"),
        content:
          state.config.signinbegin +
          "-" +
          state.config.signinend +
          t("Global.gold_money"),
        description: t("Profile.permission.signin.click.award"),
        button: t(
          state.user.id === "guest"
            ? "Login.login"
            : "Profile.permission.signin.now"
        ),
        buttonEvent: state.user.id === "guest" ? toLoginPage : dailyEvent,
      },
      {
        title: t("Profile.permission.invite_friend"),
        content:
          t("Navbar.top_navigator_float_invite_description1") +
          " :" +
          (state.user.id === "guest" ? "------" : state.user.share_ma),
        description: t("Navbar.top_navigator_float_invite_description"),
        button: t(
          state.user.id === "guest"
            ? "Login.login"
            : "Navbar.top_navigator_float_invite"
        ),
        buttonEvent: state.user.id === "guest" ? toLoginPage : saveUrl,
      },
    ];
    setQuestInfoList(daily);
  }, [state.config, state.user]);

  useEffect(() => {
    const variable =
      state.user.time === "-1"
        ? t("Profile.buy.watch.forever_1")
        : Date.now() > state.user.time * 1000
        ? t("Profile.main.vip.maturity")
        : new Date(state.user.time * 1000).toLocaleDateString().toString();
    setMembershipDate(variable);
  }, [state.user.time]);
  useEffect(() => {
    postSearchWatchHistoryEvent(tabValue);
  }, [tabValue]);

  const judgeSwitchLangImg = scroll
    ? lang === "tc"
      ? "/images/header/topbar/switch_lang_dark.svg"
      : "/images/header/topbar/switch_lang_en_dark.svg"
    : lang === "tc"
    ? "/images/header/topbar/switch_lang.svg"
    : "/images/header/topbar/switch_lang_en.svg";

  async function saveUrl() {
    // navigatorShare({
    //   title: "",
    //   text:
    //     intl.formatMessage({ id: "PROFILE.SHARE.DESCRIPTION_1" }) +
    //     (user.share_ma
    //       ? intl.formatMessage({ id: "PROFILE.SHARE.DESCRIPTION_2" }) +
    //         user.share_ma
    //       : "") +
    //     intl.formatMessage({ id: "PROFILE.SHARE.DESCRIPTION_3" }),
    //   url: downloadPage[1] + "?utm_source=" + user.share_ma,
    // });
    navigator.clipboard
      .writeText(downloadPage[1] + "?utm_source=" + state.user.share_ma)
      .then(() => {
        callToast("复制成功");
      })
      .catch((err) => {
        callToast("复制失敗");
      });
  }

  function toLoginPage() {
    clickLogin();
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const clickItem = (routes) => {
    useGlobalDispatch(pushRoutes(routes));
  };
  const clearUserData = () => {
    useGlobalDispatch(userLoginOutAction());
    useGlobalDispatch(clearVipInfoAction());
    useGlobalDispatch(backRoutes());
    useGlobalDispatch(userFBLoginOutAction());
    useGlobalDispatch(initPostData());
  };
  const clickSearch = () => {
    useGlobalDispatch(pushRoutes(home.pages.homeSearch));
  };
  const clickService = () => {
    window.open("https://bli2pay.com/8jcng");
  };
  const toPaymentPage = () => {
    useGlobalDispatch(updateRechargeStateAction(true));
    useGlobalDispatch(pushRoutes(profile.pages.profilePayment));
  };
  const clickNew = () => {
    useGlobalDispatch(pushRoutes(notice));
  };
  const clickAvatar = () => {
    const userData = store.getState().user;
    if (userData.id !== "guest") {
      useGlobalDispatch(pushRoutes(profile.pages.profileMain));
    } else {
      useGlobalDispatch(pushRoutes(login));
    }
  };
  const clickLogin = () => {
    useGlobalDispatch(pushRoutes(login));
  };
  const clickCollect = () => {
    useGlobalDispatch(
      pushRoutes(profile.pages.profileMyCollect.pages.profileMyCollectComic)
    );
  };
  const clickSetting = () => {
    useGlobalDispatch(
      pushRoutes(profile.pages.profileEdit.pages.profileEditInfo)
    );
  };
  const clickVip = () => {
    useGlobalDispatch(
      pushRoutes(profile.pages.profileBuyVip.pages.profileBuyVipCommon)
    );
  };
  const dailyEvent = () => {
    useGlobalDispatch(dailyLoginAction(t));
  };
  const postSearchWatchHistoryEvent = (type) => {
    useGlobalDispatch(postSearchWatchHistoryAction(type));
  };

  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    setIsLogin(state.user.id !== "guest");
  }, [state.user.id]);

  return (
    <TopsearchBarElement
      main_height={state.navbar.mainHeight}
      ref={ContainerRef}
      scroll={scroll}
    >
      <div className="search_bar">
        <div className="search_bar_item">
          <Image
            src={
              scroll
                ? "/images/header/topbar/logo_p.svg"
                : "/images/header/topbar/logo_w.svg"
            }
            width={0}
            height={0}
            alt="B次元 LOGO"
            className="logo cursor"
            onClick={() => clickItem(navList[0])}
          />
          {navList.map((navItem) => (
            <div
              className="search_bar_nav cursor"
              key={navItem.name}
              style={{
                animation: scroll ? "1s recharge-move 2" : "",
              }}
              onClick={(e) => {
                clickItem(navItem);
              }}
            >
              <WavaButton
                className={
                  "search_bar_nav_item_btn " +
                  (location.indexOf(navItem.path) !== -1 ? "active" : "")
                }
              >
                <div className="search_bar_nav_item_cover" />
                <Image
                  className={"search_bar_nav_item_btn_img"}
                  width={0}
                  height={0}
                  src={scroll ? navItem.activeImage : navItem.image}
                  alt={navItem.name}
                />
                <div className="search_bar_nav_item_btn_title_text">
                  {t(navItem.intlKey)}
                </div>
              </WavaButton>
            </div>
          ))}
        </div>
        <div className="search_bar_item" />
        <div className="search_bar_main cursor">
          <Searchbar
            callback={clickSearch}
            isPlaceholder={isPlaceholder}
            scroll={scroll}
          />
        </div>
        <div className="search_bar_item">
          <div className="search_bar_recharge">
            <Image
              className={
                "search_bar_recharge_img " +
                (state.config.highlightRechargeState ? "" : "active")
              }
              onClick={toPaymentPage}
              src={
                !state.config.highlightRechargeState
                  ? "/images/home/recharge_highlight.svg"
                  : scroll
                  ? "/images/header/topbar/recharge_highlight_dark.svg"
                  : "/images/home/recharge.svg"
              }
              width={0}
              height={0}
              alt="recharge"
            />
            <div className="search_bar_recharge_float">
              <div>{t("Navbar.bar_recharge_description")}</div>
              <div className="search_bar_recharge_float_description">
                <span>
                  <Image
                    src="/images/header/topbar/free-nor.svg"
                    width={0}
                    height={0}
                    alt="free"
                  />

                  {t("Navbar.bar_recharge_description_1")}
                </span>
                <span>
                  <Image
                    src="/images/header/topbar/fast-nor.svg"
                    width={0}
                    height={0}
                    alt="fast"
                  />
                  {t("Navbar.bar_recharge_description_2")}
                </span>
              </div>
              <div
                className={"search_bar_recharge_button"}
                onClick={toPaymentPage}
              >
                <WavaButton>
                  {t(
                    isLogin
                      ? "Navbar.bar_recharge_button_notlogin"
                      : "Navbar.bar_recharge_button"
                  )}
                </WavaButton>
              </div>
              <div
                className={"search_bar_recharge_button_light"}
                onClick={clickVip}
              >
                <WavaButton>{t("Navbar.bar_recharge_button_1")}</WavaButton>
              </div>
            </div>
          </div>

          <div className="search_bar_history">
            <Image
              src={
                scroll
                  ? "/images/header/topbar/history_dark.svg"
                  : "/images/header/topbar/history.svg"
              }
              width={0}
              height={0}
              alt="service"
              className="search_bar_history_img"
            />
            <div className="search_bar_history_cover">
              <TabContext value={tabValue}>
                <Box className="search_bar_history_tab_container">
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="H漫" value={1} />
                    <Tab label="番剧" value={0} />
                  </TabList>
                </Box>
                <TabPanel value={1}>
                  <ProfileWatchHistoryComicHandle disabledScrollRefresh />
                </TabPanel>
                <TabPanel value={0}>
                  <ProfileWatchHistoryAnimeHandle disabledScrollRefresh />
                </TabPanel>
              </TabContext>
            </div>
          </div>

          <div className="search_bar_switch">
            <Image
              src={judgeSwitchLangImg}
              width={0}
              height={0}
              alt="switch"
              className="search_bar_switch_img"
            />
            <div className="search_bar_switch_cover">
              <div className="search_bar_switch_cover_content">
                {LanguageList.map((list) => (
                  <div
                    key={list.name}
                    className="cursor"
                    onClick={() => changeLanguage(list.lang)}
                  >
                    {list.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="search_bar_task ">
            <Image
              src={
                scroll
                  ? "/images/header/topbar/task_dark.svg"
                  : "/images/header/topbar/task.svg"
              }
              width={0}
              height={0}
              alt="task"
              className="search_bar_float_img"
            />

            <div className={`search_bar_float search_bar_task_float`}>
              {questInfoList?.map((daliy, index) => (
                <React.Fragment key={index}>
                  <ol>
                    <li className="search_bar_float_title">{daliy.title}</li>
                    <li>{daliy.description}</li>
                    <li
                      className={`search_bar_float_content ${!index && "gold"}`}
                    >
                      {!index && (
                        <Image
                          src={daliy.icon}
                          width={0}
                          height={0}
                          alt="coin"
                          className="search_bar_float_img"
                        />
                      )}

                      {daliy.content}
                    </li>
                    <li>
                      <div
                        className="search_bar_float_button"
                        onClick={daliy.buttonEvent}
                      >
                        {daliy.button}
                      </div>
                    </li>
                  </ol>
                  <ol style={{ display: index && "none" }}>
                    <div className="divider" />
                  </ol>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="search_bar_service" onClick={clickService}>
            <Image
              width={42}
              height={42}
              src={
                scroll
                  ? "/images/header/topbar/service_dark.svg"
                  : "/images/header/topbar/service.svg"
              }
              alt="service"
              className="search_bar_service_img"
            />
          </div>

          <div className="search_bar_news" onClick={clickNew}>
            <Image
              src={
                scroll
                  ? "/images/header/topbar/news_dark.svg"
                  : "/images/header/topbar/news.svg"
              }
              width={0}
              height={0}
              alt="news"
              className="search_bar_news_img"
            />
            {newNotice ? (
              <span className="search_bar_news_number">{newNotice}</span>
            ) : (
              ""
            )}
          </div>
          <div className="search_bar_avatar_container">
            <div className="search_bar_avatar" onClick={clickAvatar}>
              {isLogin ? (
                <ImageComponent
                  is_cover={true}
                  src={state.user.avatar}
                  background_color="transparent"
                  border_radius="50%"
                  placeholderImg="/images/imgPlaceholder/avatar.png"
                />
              ) : (
                <div className="search_bar_avatar_login">
                  {t("Login.login")}
                </div>
              )}
            </div>
            <div className="search_bar_avatar_cover">
              {!isLogin ? (
                <>
                  <div className="search_bar_avatar_cover_user_info vertical">
                    <div>{t("Login.have_good_experiences")}</div>
                  </div>
                  <div onClick={clickAvatar}>
                    <WavaButton className="search_bar_avatar_button_login">
                      {t("Login.login_now")}
                    </WavaButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="search_bar_avatar_cover_user_info">
                    <div className="search_bar_avatar_cover_user_info_avatar">
                      <ImageComponent
                        is_cover={true}
                        src={state.user.avatar}
                        background_color="transparent"
                        border_radius="50%"
                        placeholderImg="/images/imgPlaceholder/avatar.png"
                      />
                    </div>
                    <div className="search_bar_avatar_cover_user_info_item">
                      <div className="search_bar_avatar_cover_user_info_item_name">
                        {state.user.nick_name}
                      </div>
                      <div className="search_bar_avatar_cover_user_info_item_description g-center gap-1">
                        {state.user.time === "-1" ||
                        Date.now() < state.user.time * 1000 ? (
                          <Image
                            className="search_bar_avatar_cover_user_info_crown"
                            src="/images/icons/crown.png"
                            width={0}
                            height={0}
                            alt="crown"
                          />
                        ) : (
                          ""
                        )}
                        {membershipDate}
                      </div>
                    </div>
                    <div
                      className="search_bar_avatar_cover_user_info_setting cursor"
                      onClick={clickSetting}
                    >
                      {t("Personal.setting")}
                      &gt;
                    </div>
                  </div>
                  <div onClick={clickCollect}>
                    <WavaButton className="search_bar_avatar_button_t ">
                      {t("Search.collect.recent")}
                    </WavaButton>
                  </div>
                  <div onClick={clearUserData}>
                    <WavaButton className="search_bar_avatar_button_b">
                      {t("Login.logout")}
                    </WavaButton>
                  </div>
                </>
              )}
              {/* </div> */}
            </div>
          </div>
          <QrCode scroll={scroll} />
        </div>
      </div>
    </TopsearchBarElement>
  );
};

const TopsearchBarElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["scroll", "main_height"].includes(prop),
})`
  ${({ main_height, scroll }) => `
    /*  */
    padding-right: ${padding}px;
    padding-left: ${padding}px;
    height: ${main_height}px;
    background-color: ${colors.dark_pink};

    .logo {
      width: 110px;
      margin-right: 15px;
    }
    @keyframes fade-in {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }
    .search_bar_task {
      display: flex;
      align-items: center;
      position: relative;
      white-space: nowrap;
      font-size: 14px;
      color: ${scroll ? colors.text_grey : "#fff"};
      &_float {
        position: absolute;
        z-index: 999;
        visibility: hidden;
        top: 41px !important;
      }
      li {
        margin: 5px;
      }
      &:hover {
        .search_bar_float_img {
          animation: navbar-jump 1.5s;
        }
        .qrcode_float {
          color: ${colors.text_grey};
          background-color: #fff;
          padding: 5px;
          text-align: center;
          display: flex;
          top: 50px;
          border-radius: 5px;
          box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
          z-index: 1;
        }
      }
    }

    .search_bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      &_main {
        display: flex;
        justify-content: end;
      }
      &_item {
        display: flex;
      }

      &_nav {
        white-space: nowrap;
        margin-right: 0.5em;

        &_item {
          position: relative;
          cursor: pointer;
          user-select: none;
          &_cover {
            display: none;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: #fff;
            opacity: 20%;
            border-radius: 5px;
          }

          &_btn {
            display: flex;
            padding: 4px 8px;
            &:hover {
              animation: navbar-jump infinite 1.5s;
            }
            &_img {
              width: 22px;
              height: 22px;
              margin-right: 2px;
              vertical-align: middle;
              transition: 0.3s;
            }
            &_title {
              &_text {
                align-self: center;
                font-size: 14px;
                color: #fff;
                font-weight: 600;
                color: ${scroll ? colors.text_grey : "#fff"};
              }
            }

            &.active {
              cursor: default;
              transform: translateY(-3px) scale(1.05);
              transform-origin: bottom center;
              font-size: 16px;
              color: ${colors.text_grey};
              text-shadow: 0.09px 0px ${colors.text_grey};

              .search_bar_nav_item_cover {
                display: block;
              }
            }
          }
        }
      }

      &_avatar,
      &_main,
      &_news,
      &_service,
      &_switch,
      &_history,
      &_recharge {
        margin-right: 10px;
      }
      &_avatar {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-self: center;
        margin-left: 10px;
        width: ${main_height * 0.55}px;
        height: ${main_height * 0.55}px;
        font-size: 14px;
        color: ${colors.dark_pink};
        font-weight: 900;
        text-shadow: 0.2px 0.2px ${colors.dark_pink};
        align-self: center;
        &_login {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          background-color: #fffa;
        }

        &_cover {
          position: absolute;
          z-index: 999;
          visibility: hidden;
          min-width: 250px;
          &_user_info {
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 15px;
            white-space: nowrap;
            color: black;
            font-weight: 500;
            margin-bottom: 5px;
            font-size: 13px;
            &.vertical {
              flex-direction: column;
            }

            &_item {
              display: flex;
              flex-direction: column;
              align-items: start;
              font-weight: 600;
            }

            &_setting {
              color: ${colors.text_grey};
            }
          }
        }

        &_container {
          position: relative;
          align-self: center;

          &:hover {
            .search_bar_avatar_login,
            img {
              animation: navbar-jump 1.5s;
            }
            .search_bar_avatar_cover {
              background-color: #fff;
              padding: 20px 25px;
              text-align: center;
              visibility: visible;
              display: flex;
              flex-direction: column;
              top: 40px;
              right: 0;
              gap: 10px;
              border-radius: 5px;
              box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
              &_user_info {
                &_crown {
                  width: 20px;
                  margin-right: 5px;
                }
                &_avatar {
                  width: 42px;
                  height: 42px;
                }
              }
            }

            .search_bar_avatar {
              &_button {
                &_login,
                &_t,
                &_b {
                  cursor: pointer;
                  word-break: keep-all;
                  font-size: 12px;
                  padding: 5px 10px;
                  border-radius: 100px;
                }
                &_login {
                  background: ${colors.back_dark_pink};
                  color: #fff;
                  border: solid 1px ${colors.dark_pink};
                }
                &_t {
                  color: ${colors.dark_pink};
                  border: solid 1px ${colors.dark_pink};
                }
                &_b {
                  color: ${colors.text_light_grey};
                  border: solid 1px #f3f4f5;
                  background: #f3f4f5;
                  border: solid 1px #f3f4f5;
                }
              }
            }
          }
        }
      }

      &_main {
        flex-grow: 0.5;
        white-space: nowrap;
      }

      &_switch {
        align-self: center;
        position: relative;

        &_cover {
          position: absolute;
          display: none;
          z-index: 999;
        }

        &:hover {
          .search_bar_switch_img {
            animation: navbar-jump 1.5s;
          }
          .search_bar_switch_cover {
            left: -10px;
            display: block;
            position: absolute;
            &_content {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              padding: 10px 0;
              gap: 5px;
              top: 40px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
              white-space: nowrap;
              &:hover {
                .search_bar_switch_cover {
                  display: block;
                }
              }
              > div {
                margin: 5px;
                width: 100%;
                font-size: 14px;
                &:hover {
                  background-color: #f3f4f5;
                }
              }
            }
          }
        }
        &_img {
          width: 35px;
          height: 35px;
        }
      }

      &_history {
        position: relative;
        align-self: center;
        &_img {
          cursor: pointer;
          width: 35px;
          margin-bottom: 4px;
        }
        &_cover {
          z-index: 999;
          display: none;
          cursor: default;
        }
        &:hover {
          .search_bar_history {
            &_img {
              animation: navbar-jump 1.5s;
            }
            &_cover {
              background-color: #fff;
              padding: 15px;
              font-size: 12px;
              text-align: center;
              position: absolute;
              gap: 10px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              top: 40px;
              right: -20em;
              width: 25em;
              border-radius: 5px;
              box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
            }
            &_tab_container {
              border-bottom: 1;
              border-color: divider;
              width: 100%;
            }
          }
          .MuiTabPanel-root {
            padding: 0px !important;
          }
          .MuiTab-root {
            color: #000000;
            width: 50%;
          }

          .Mui-selected {
            color: ${colors.back_dark_pink};
          }

          .MuiTabs-indicator {
            background: ${colors.back_dark_pink};
          }
        }
      }

      &_service {
        cursor: pointer;
        &:hover {
          animation: navbar-jump infinite 1.5s;
        }
      }

      &_float,
      &_recharge {
        align-self: center;
        margin-right: 10px;
        position: relative;
        &_img {
          width: 30px;
          height: 30px;
          margin-bottom: 4px;

          &.active {
            animation: 1s recharge-move infinite;

            @keyframes recharge-move {
              0% {
                transform: rotate(0) translateX(0) translateY(5px);
              }

              10% {
                transform: rotate(20deg) translateX(5px) translateY(-5px);
              }

              20% {
                transform: rotate(0deg) translateX(0) translateY(5px);
              }

              30% {
                transform: rotate(-20deg) translateX(-5px) translateY(-5px);
              }

              40% {
                transform: rotate(0deg) translateX(0) translateY(5px);
              }

              50% {
                transform: rotate(0deg) translateX(0) translateY(0);
              }
            }
          }
        }
      }

      &_recharge {
        &_float {
          z-index: 999;
          display: none;
          cursor: default;
          &_description {
            display: flex;
            gap: 15px;
            > span {
              gap: 5px;
              display: flex;
              align-items: center;
              > img {
                width: 25px;
                height: 25px;
              }
            }
          }
        }

        &:hover {
          .search_bar_recharge_float {
            min-width: 468.34px;
            background-color: #fff;
            padding: 15px 35px;
            font-size: 12px;
            text-align: center;
            position: absolute;
            gap: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            top: 40px;
            left: -370%;
            border-radius: 5px;
            box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
          }
        }
        &_button,
        &_button_light {
          cursor: pointer;
          padding: 10px 0;
          margin: auto;
          margin-top: 5px;
          width: 100%;
          text-align: center;
          text-decoration: none;
          color: #fff;
          background-color: ${colors.dark_pink};
          border-radius: 30px;
        }
        &_button_light {
          background-color: #fff;
          color: ${colors.dark_pink};
          border-radius: 21px;
          border: solid 1px ${colors.dark_pink};
        }
      }

      &_task {
        // margin: 0px 6px;
        &:hover {
          .search_bar_float {
            z-index: 999;
            visibility: visible;
          }
        }
      }
      &_news {
        position: relative;
        margin-right: 10px;
        align-self: center;
        cursor: pointer;
        &:hover {
          animation: navbar-jump infinite 1.5s;
        }
        &_img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
          color: #fff;
        }

        &_number {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 14px;
          height: 14px;
          font-size: 12px;
          line-height: 14px;
          text-align: center;
          padding: 1%;
          color: ${scroll ? "#fff" : colors.dark_pink};
          background-color: ${scroll ? "red" : "#fff"};
          border-radius: 50%;
        }
      }
      &_float {
        z-index: 999;
        position: absolute;
        visibility: hidden;
        display: flex;
        top: 30px;
        right: -230px;
        cursor: default;

        &_title {
          color: black;
          font-weight: 700;
        }

        .gold {
          color: #f4eb0b;
        }

        &_content {
          color: black;
          font-weight: 700;
          img {
            width: 15px;
            height: 15px;
          }
        }

        &_img {
          margin-right: 5px;
        }

        &_button {
          cursor: pointer;
          word-break: keep-all;
          color: ${colors.dark_pink};
          font-size: 14px;
          padding: 10px 14px;
          width: 100%;
          border: solid 1px ${colors.dark_pink};
          border-radius: 100px;
        }
        ol {
          color: ${colors.text_light_grey};
        }
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1% 0%;
        }
        color: ${colors.text_grey};
        background-color: #fff;
        padding: 5px;
        text-align: center;
        position: absolute;
        top: 45px;
        border-radius: 5px;
        box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
      }
    }

    .divider {
      height: 100%;
      margin: 0% 1em;
      width: 0.2px;
      background-color: gray;
    }

    @media (min-width: 899px) {
      .search_bar_news_img {
        height: 30px;
        width: 30px;
      }

      .search_bar_recharge_img {
        height: 35px;
        width: 35px;
      }
      .search_bar_avatar_login {
        background-color: ${scroll && "#1a2950"};
        color: ${scroll && "#fff"};
        font-size: 16px;
      }
    }
  `}
`;

export default memo(TopSearchBar, areEqual);
