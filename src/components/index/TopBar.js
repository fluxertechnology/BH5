import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { main_height } from "@/components/layout/Header/TopBarContainer";
import Searchbar from "@/components/common/Searchbar";
import { colors, downloadPage } from "@/lib/constants";

import ImageComponent from "@/components/common/ImageComponent";

import avatarPlaceholder from "@public/images/imgPlaceholder/avatar_1.png";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import { navigatorShare } from "@/store/actions/utilities";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import Image from "next/image";
import { pushRoutes } from "@/store/actions/historyActions";
import { openPopup } from "@/store/actions/user";
import { pageUrlConstants } from "@/lib/constants";
const { home, profile, notice, login } = pageUrlConstants;
import { updateRechargeStateAction } from "@/store/actions/config";
import { usePathname } from "next/navigation";

const TopBar = () => {
  const { state } = useGlobalContext();

  const location = usePathname();
  const t = useTranslations();
  function handleShare() {
    navigatorShare({
      title: "",
      text:
        t("Profile.share.description_1") +
        (state.user.share_ma
          ? t("Profile.share.description_2") + state.user.share_ma
          : "") +
        t("Profile.share.description_3"),
      url: downloadPage[1] + "?utm_source=" + state.user.share_ma,
    });
  }
  function clickService() {
    window.open("https://bli2pay.com/8jcng");
  }

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const clickAvatar = () => {
    // console.log("這邊要判斷登入狀態");
    const userData = state.user;
    if (userData.id !== "guest") {
      useGlobalDispatch(pushRoutes(profile.pages.profileMain));
    } else {
      // useGlobalDispatch(pushRoutes(login));
      useGlobalDispatch(openPopup("login"));
    }
  };
  const clickSearch = () => {
    useGlobalDispatch({
      type: "UPDATE_NAVBAR",
      key: "isShowSearch",
      data: true,
    });

    useGlobalDispatch({
      type: "UPDATE_NAVBAR",
      key: "isShowMore",
      data: setIsMoreOpen(false),
    });
    // useGlobalDispatch(pushRoutes(home.pages.homeSearch));
  };
  const clickHome = () => {
    useGlobalDispatch(pushRoutes(home.pages.homeMain));
  };
  const clickNew = () => {
    useGlobalDispatch(pushRoutes(notice));
  };

  const pushRoutesFunction = (routes) => {
    useGlobalDispatch(pushRoutes(routes));
  };

  const switchLanguage = () => {
    pushRoutesFunction(pageUrlConstants.profile.pages.profileSwitchLanguage);
  };

  const notification = () => {
    pushRoutesFunction(pageUrlConstants.notice);
  };

  const toPaymentPage = () => {
    useGlobalDispatch(updateRechargeStateAction(true));
    useGlobalDispatch(pushRoutes(profile.pages.profilePayment));
  };

  const moreComponent = () => {
    setIsMoreOpen((prevState) => !prevState);
    useGlobalDispatch({
      type: "UPDATE_NAVBAR",
      key: "isShowMore",
      data: !isMoreOpen,
    });
    useGlobalDispatch({
      type: "UPDATE_NAVBAR",
      key: "isShowSearch",
      data: false,
    });
  };
  // 特定页面显示H1标签
  const routesToShowLogo = ["/posts/main", "/vendor"];

  const shouldShowLogo =
    location.startsWith("/home") || routesToShowLogo.includes(location);

  return (
    <TopBarElement main_height={state.navbar.mainHeight}>
      <div className="search_bar">
        <div className="search_bar_logo">
          <div onClick={clickHome} className="search_bar_logo_img">
            {shouldShowLogo && <h1>{t("Home.name")}</h1>}
          </div>
        </div>
        <div className="search_bar_main">
          {/* <Searchbar
            callback={clickSearch}
            isPlaceholder={state.navbar.isPlaceholder}
          /> */}
          <Image
            src="/images/header/topbar/search_1.png"
            width={27}
            height={27}
            alt="search"
            onClick={clickSearch}
          />
        </div>
        {/* <div className="search_bar_share" onClick={toPaymentPage}>
          <img
            className={
              "search_bar_recharge_img " +
              (highlightRechargeState ? "" : "active")
            }
            src={highlightRechargeState ? recharge : recharge_highlight}
            alt="B次元分享连结"
          />
        </div> */}

        {/* <div className="search_bar_recharge" onClick={toPaymentPage}>
          <Image
            className={"search_bar_recharge_img "}
            src={
              state.config.highlightRechargeState
                ? "/images/header/topup.png"
                : "/images/header/topup_pink.png"
            }
            width={21}
            height={20}
            alt="recharge"
          />
        </div> */}

        {/* <div className="search_bar_notification">
          <Image
            className={"search_bar_notification_img "}
            onClick={notification}
            src={"/images/header/notification.png"}
            width={21}
            height={19}
            alt="switch language"
          />
        </div> */}

        {/* <div className="search_bar_more">
          <Image
            className={"search_bar_more_img "}
            onClick={moreComponent}
            src={"/images/header/more.png"}
            width={19}
            height={19}
            alt="more tool"
          />
        </div> */}

        <div className="search_bar_avatar" onClick={clickAvatar}>
          {state.user.id !== "guest" ? (
            <ImageComponent
              is_cover={true}
              src={state.user.avatar}
              background_color="transparent"
              border_radius="0%"
              placeholderImg={avatarPlaceholder}
            />
          ) : (
            // <div className="search_bar_avatar_login bg-[#000]">{t("Login.login")}</div>
            <Image
              className={"search_bar_avatar_login bg-[#000]"}
              onClick={() => useGlobalDispatch(pushRoutes(home.pages.homeMain))}
              src={avatarPlaceholder}
              width={68}
              height={43}
              alt="switch language"
            />
          )}
        </div>

        <div className="search_bar_language">
          <Image
            className={"search_bar_language_img "}
            onClick={switchLanguage}
            src={"/images/header/translation_1.png"}
            width={68}
            height={43}
            alt="switch language"
          />
        </div>
        {/* <div className="search_bar_service" onClick={clickService}>
          <img
            src={service}
            alt="service"
            className="search_bar_service_icon"
          />
        </div> */}

        {/* <div className="search_bar_share" onClick={handleShare}>
          <ShareIcon className="search_bar_share_icon" />
        </div> */}

        {/* <div className="search_bar_news" onClick={clickNew}>
          <FontAwesomeIcon className="search_bar_news_img" icon={faBell} />
          {newNotice ? (
            <span className="search_bar_news_number">{newNotice}</span>
          ) : (
            ""
          )}
        </div> */}
      </div>
    </TopBarElement>
  );
};

export default TopBar;

export const TopBarElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["scroll", "main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding: 0 2.67vw;
    height: ${main_height}px;
    background-color: #fff;

    .search_bar {
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      height: 100%;

      &_news,
      &_share,
      &_recharge {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &_avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: ${main_height * 0.45}px;
        height: ${main_height * 0.45}px;
        margin-right: 2.4vw;
        font-size: 14px;
        color: #000;
        border-radius: 0%;
        font-weight: 900;
        text-shadow: 0.2px 0.2px ${colors.dark_pink};

        &_login {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: #fffa;
        }
      }
      &_logo {
        flex: 30%;
        &_img {
          width: ${main_height * 1.9}px;
          height:${main_height}px;
          color: transparent;
          background:url('/images/header/topbar/logo.png') no-repeat center;
          background-size: contain;
          margin:auto 0;
        }
      }
      &_main {
        // flex-grow: 1;
        margin-right: 3.6vw;
      }

      &_share_icon {
        color: #fff;
        font-size: 30px;
        padding-bottom: 0.1em;
      }

      &_language ,
      &_more {
        margin-right: 10px;

        &_img {
          width: ${main_height * 0.7167}px;
          height: ${main_height * 1.141}px;
          object-fit:contain;
        } 
      }  

      &_notification {
        margin-right: 10px;

        &_img {
          width: 19px;
          height: 21px;
          object-fit:contain;
        } 
      }
      &_recharge {
        margin-right: 10px;

        &_img {
          width: 21px;
          height: 20px;
          object-fit:contain;

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

      &_news {
        position: relative;

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
          color: ${colors.dark_pink};
          background-color: #fff;
          border-radius: 50%;
        }
      }
    }
    .search_bar_service_icon {
      width: 40px;
      margin-right: 6px;
    }
  `}
`;
