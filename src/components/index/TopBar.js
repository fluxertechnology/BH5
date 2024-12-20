import { useTranslations } from "next-intl";
import styled from "styled-components";
import { main_height } from "@/components/layout/Header/TopBarContainer";
import Searchbar from "@/components/common/Searchbar";
import { colors, downloadPage } from "@/lib/constants";

import ImageComponent from "@/components/common/ImageComponent";

import avatarPlaceholder from "@public/images/imgPlaceholder/avatar.png";

import { navigatorShare } from "@/store/actions/utilities";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import Image from "next/image";
import { pushRoutes } from "@/store/actions/historyActions";
import { pageUrlConstants } from "@/lib/constants";
const { home, profile, notice, login } = pageUrlConstants;

const TopBar = () => {
  const { state } = useGlobalContext();

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

  const clickAvatar = () => {
    // console.log("這邊要判斷登入狀態");
    const userData = state.user;
    if (userData.id !== "guest") {
      useGlobalDispatch(pushRoutes(profile.pages.profileMain));
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
  return (
    <TopBarElement main_height={state.navbar.mainHeight}>
      <div className="search_bar">
        <div className="search_bar_logo ">
          <Image
            src="/images/topbar/logo_w.svg"
            width={0}
            height={0}
            alt="bh5_logo"
            onClick={clickHome}
          />
        </div>
        <div className="search_bar_main">
          <Searchbar
            callback={clickSearch}
            isPlaceholder={state.navbar.isPlaceholder}
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
        <div
          className="search_bar_recharge"
          onClick={state.navbar.toPaymentPage}
        >
          <Image
            className={
              "search_bar_recharge_img " +
              (state.config.highlightRechargeState ? "" : "active")
            }
            src={
              state.config.highlightRechargeState
                ? "/images/home/recharge.svg"
                : "/images/home/recharge_highlight.svg"
            }
            width={0}
            height={0}
            alt="recharge"
          />
        </div>
        <div className="search_bar_avatar" onClick={clickAvatar}>
          {state.user.id !== "guest" ? (
            <ImageComponent
              is_cover={true}
              src={state.user.avatar}
              background_color="transparent"
              border_radius="50%"
              placeholderImg={avatarPlaceholder}
            />
          ) : (
            <div className="search_bar_avatar_login">{t("Login.login")}</div>
          )}
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
    padding: 0 5%;
    height: ${main_height}px;
    background-color: ${colors.dark_pink};

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
        width: ${main_height * 0.65}px;
        height: ${main_height * 0.65}px;
        font-size: 14px;
        color: ${colors.dark_pink};
        border-radius: 50%;
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
        img {
          width: 90px;
        }
      }
      &_main {
        flex-grow: 1;
        margin: 0 10px;
      }

      &_share_icon {
        color: #fff;
        font-size: 30px;
        padding-bottom: 0.1em;
      }

      &_recharge {
        margin-right: 10px;

        &_img {
          width: 30px;
          height: 30px;

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
