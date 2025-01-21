import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
  createContext,
} from "react";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import styled from "styled-components";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTranslations } from "next-intl";
import streamIcon from "@public/images/topbar/stream.svg";
import gameIcon from "@public/images/topbar/game.svg";
import shopIcon from "@public/images/topbar/shop.svg";
import Image from "next/image";
import { pushRoutes } from "@/store/actions/historyActions";
import { colors, pageUrlConstants, vendorUrl } from "@/lib/constants";
import LinkComponent from "@/components/common/LinkComponent";
import { getVendorGameListAction } from "@/store/actions/pages/vendorMainAction";
import ImageComponent from "@/components/common/ImageComponent";

// Create GameProps context
const GameProps = createContext("");

const NavbarMore = ({ show = true }) => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const [gameFloatStatus, setGameFloatStatus] = useState(false);
  const { profile, home } = pageUrlConstants;
  const GamePropsProvider = GameProps.Provider; // Moved here
  const t = useTranslations();

  const callback = (key, dynamic) => {
    if (key === "setting") {
      useGlobalDispatch(
        pushRoutes(profile.pages.profileSet)
      );
    } else if (key === "history") {
      useGlobalDispatch(
        pushRoutes(profile.pages.profileWatchHistory.pages.profileWatchHistoryComic)
      );
    }else if (key === "ranking") {
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
    closeMore();
  };

  const gameListData = useMemo(() => {
    return state.vendorGameListData.vendorList?.slice(0, 5) || [];
  }, [state.vendorGameListData.vendorList]);

  const getVendorGameList = () => {
    useGlobalDispatch(getVendorGameListAction());
  };

  useEffect(() => {
    if (!gameListData.length) getVendorGameList();
  }, []);

  const linkItems = [
    {
      name: t("Navbar.top_navigator_stream"),
      url: "",
      icon: streamIcon,
      color: "#ff0000",
      onClickEvent: () => callback("streams"),
    },
    {
      name: t("Game.label.game"),
      url: "",
      icon: gameIcon,
      color: "#ffbd2b",
      // onClickEvent: () => setGameFloatStatus((pre) => !pre),
      onClickEvent: () => callback("games"),

    },
    {
      name: t("Navbar.top_navigator_shop"),
      url: "",
      icon: shopIcon,
      color: "#ff5610",
      onClickEvent: () => window.open(vendorUrl),
    },
  ];

  const closeMore = () => {
    useGlobalDispatch({
      type: "UPDATE_NAVBAR",
      key: "isShowMore",
      data: false,
    });
  };

  return (
    <WrapperStyles
      main_height={state.navbar.mainHeight}
      bottom_nav_height={state.navbar.bottomNavHeight}
      isMobile={isMobile}
      className={state.navbar.isShowMore ? "open" : ""}
    >
      <div className={state.navbar.isShowMore ? "" : "hide"}>
        <div className="more_component">
          <div className="link_list">
            {linkItems.map((data, index) => {
              const { onMouseEnterEvent, onClickEvent, color, icon, name } = data;
              return (
                <div
                  key={index}
                  className={`link_item gap-1 ${index !== 1 && "cursor"}`}
                  onMouseEnter={onMouseEnterEvent && onMouseEnterEvent}
                  onMouseLeave={onMouseEnterEvent && onMouseEnterEvent}
                  onClick={onClickEvent && onClickEvent}
                  style={{ color: color, fontSize: 'max(12px,1.867vw)', fontWeight: '700' }}
                >
                  <Image src={icon} width={0} height={0} alt={name} style={{ width: '2.8vw', height: '2.8vw', marginRight: '1vw' }} />
                  {name}
                  {gameFloatStatus && index === 1 && (
                    <div className="float">
                      <span>{t("Game.label.featured_game")}</span>
                      {gameListData.map((gameItem) => {
                        const { picurl, title, total_like, id } = gameItem;
                        return (
                          <GamePropsProvider
                            key={id}
                            value={{ picurl, title, total_like, id }}
                          >
                            <FeatureGameItem />
                          </GamePropsProvider>
                        );
                      })}
                      {gameListData.length ? (
                        <LinkComponent
                          className="float_button mt-1"
                          routes={{
                            name: home.pages.homeGame.name,
                            path: home.pages.homeGame.path,
                            dynamic: {
                              category: 1,
                            },
                          }}
                        >
                          {t("Game.label.view_more")}
                        </LinkComponent>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="function_list">
            <div className="function_item" onClick={() => callback("history")}>
              <Image src={'/images/header/history.png'} width={20} height={20} alt={t("Navbar.bar_history")} className="function_item_img" />
              <p>{t("Navbar.bar_history")}</p>
            </div>
            <div className="function_item" onClick={() => callback("setting")}>
              <Image src={'/images/header/setting.png'} width={20} height={20} alt={t("Profile.setting.info.index")} className="function_item_img" />
              <p>{t("Profile.setting.info.index")}</p>
            </div>
          </div>
          <div className="btn_list">
            <div className="btn_item">
              <p>{t("Navbar.bar_customer_support")}</p>
            </div>
            <div className="btn_item">
              <p>{t("Global.action.download_app")}</p>
            </div>
          </div>
        </div>
      </div>
    </WrapperStyles>
  );
};

const WrapperStyles = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["main_height", "bottom_nav_height", "isMobile"].includes(prop),
})`
  ${({ main_height, bottom_nav_height, isMobile }) => `

  .hide{
    display:none;
  }

  .navbar-more-wrapper {
    position: relative;
  }

  &.open::before {
    content: '';
    position: fixed;
    top: ${main_height}px;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 10;
  }

  .more_component {
    padding: ${isMobile ? "2.5vw 4.3vw" : "5px 11.927vw"};
    position: fixed;
    top: ${main_height}px;
    left: 0;
    background-color: #fff;
    width: 100%;
    z-index: 11;
    display: flex;
    border-top: 1px solid #e8e8e8;
    min-height: 25.6vw;
  }

  .link_list{
    width:25.4vw;
  }

  .link_item{
    display: flex;
    align-items: center;
    margin-top: 1vw;
  }

  .link_item:not(:last-child){
    margin-bottom: 3.6vw;
  }

  .search_result_wrapper {
      position: fixed;
      z-index: 11;
      top: ${main_height + 65}px;
      width: 100%;
      height: calc(100vh - ${main_height + 65 + (isMobile ? bottom_nav_height : 0)}px);
      background-color: rgba(0, 0, 0, 0.7);
      overflow-y: auto;
  }

  .navbar-more-wrapper:not(.open) .more_component {
    display: none;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .function_list{
    margin-top: 1vw;
  }

  .function_item{
    display:flex;
    align-items:center;
    font-size: max(12px,1.867vw);
    font-weight: 700;
    color: #000;
    margin-bottom: 4.8vw;
  }

  .function_item_img{
    width: 2.667vw;
    height: 2.667vw;
    object-fit:contain;
    margin-right:1.2vw;
  }

  .btn_list{
    margin-left: auto;  
    margin-top: 0.4vw;
  }

  .btn_item{
    height: 7.333vw;
    width: 31.6vw;
    border-radius:0.667vw;
    display:flex;
    justify-content: center;
    align-items:center;
    font-size: max(12px,2vw);
    font-weight: 700;
    color: #fff;
  }

  .btn_item:nth-child(1){
    background: linear-gradient(to bottom, #ff8a21, #ffb121);
    margin-bottom: 2.7vw;
  }

  .btn_item:nth-child(2){
    background: linear-gradient(to bottom, #fe4b61, #ff4b80);
  }

  .close_btn {
    cursor: pointer;
  }
  `}
`;

const FeatureGameItem = () => {
  const t = useTranslations();
  const { picurl, title, total_like, id } = useContext(GameProps);
  const { vendor } = pageUrlConstants;
  return (
    <FeatureGameItemElement>
      <div className="feature_game_item_img">
        <ImageComponent
          src={picurl}
          alt={title}
          title={title}
          height={100}
          is_cover={true}
        />
      </div>
      <div className="g-flex-column-start " style={{ width: "70%" }}>
        <div className="feature_game_item_title">{title}</div>
        <div className="feature_game_item_subtitle">
          {total_like}
          {t("Navbar.bar_people_like")}
        </div>
      </div>
      <LinkComponent
        className="link_container cursor"
        key={title}
        routes={{
          name: vendor.pages.vendorGoods.name + title,
          path: vendor.pages.vendorGoods.path,
          dynamic: {
            goodsId: id,
          },
        }}
      >
        {t("Navbar.bar_play")}
      </LinkComponent>
    </FeatureGameItemElement>
  );
};

const FeatureGameItemElement = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-align: start;
  align-items: center;
  gap: 1em;
  border-bottom: 1px solid ${colors.text_light_grey};
  padding: 10px;
  &:last-of-type {
    border-bottom: none;
  }
  &:hover {
    background-color: #f3f4f5;
    transition: 1s;
  }
  .feature_game_item {
    &_img {
      width: 100%;
      max-width: 15%;
    }
    &_title {
      width: 100%;
      overflow: hidden;
      height: ${2.5 * 12}px;
      font-size: 12px;
      word-break: break-all;
    }
    &_subtitle {
      color: ${colors.text_grey};
    }
  }
  .link_container {
    flex-shrink: 0;
    text-decoration: none;
    color: ${colors.back_dark_pink};
    height: 100%;
    border-radius: 21px;
    padding: 5px 15px;
    background-color: rgba(250, 113, 154, 0.2);
  }
`;

export default NavbarMore;