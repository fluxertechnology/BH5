import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  main_height,
  sub_height,
} from "@/components/layout/Header/TopBarContainer";
import { colors, pageUrlConstants, vendorUrl } from "@/lib/constants";

import streamIcon from "@public/images/topbar/stream.svg";
import gameIcon from "@public/images/topbar/game.svg";
import shopIcon from "@public/images/topbar/shop.svg";
import foldArrowIcon from "@public/images/topbar/fold_arrow.svg";

import { getVendorGameListAction } from "@/store/actions/pages/vendorMainAction";
import ImageComponent from "@/components/common/ImageComponent";
import LinkComponent from "@/components/common/LinkComponent";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import Image from "next/image";
import Cookies from "js-cookie";

const GameProps = createContext("");
const GamePropsProvider = GameProps.Provider;
const { vendor, home } = pageUrlConstants;
const areEqual = (pre, next) => {
  return JSON.stringify(pre) === JSON.stringify(next);
};

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ theme }) => ({
  "& .MuiTabs-root": {
    overflowX: "auto",
  },
  "& .MuiTabs-indicator": {
    display: "none",
    backgroundColor: colors.back_dark_pink,
    [theme.breakpoints?.up("sm")]: {
      height: "2px",
    },
    [theme.breakpoints?.down("sm")]: {
      height: "2px",
    },
  },
  "& .MuiTabs-flexContainer": {
    height: "100%",
    display: "flex",
    flexWrap: "nowrap", // Prevent line breaks
    justifyContent: "start", // Align items at the start
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    backgroundColor: colors.back_dark_pink,
  },
  "& .MuiTabs-fixed": {
    // maxHeight: sub_height,
    // height: "40px",
  },
  "& .MuiTabs-scroller": {
    overflowX: "auto", // Allow horizontal scrolling
    flexWrap: "nowrap", // Prevent tabs from wrapping into multiple rows
    WebkitOverflowScrolling: "touch", // Smooth scrolling for mobile
  },
  "& .Mui-disabled": {
    display: "none",
  }

}));
const lang = Cookies.get("NEXT_LOCALE");

const AntTab = styled((props) => <Tab disableRipple {...Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'bgColors'))} />)(
  ({ theme, bgColors }) => {
    const backgroundColor = Array.isArray(bgColors) && bgColors.length === 2
      ? `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`
      : bgColors[0] || "#333333";

    return {
      textTransform: "none",
      minWidth: 0,
      padding: "0px !important",
      fontSize: lang == 'en' ? "max(10px,0.739vw) !important" : "max(12px,0.885vw) !important",
      fontFamily: "Microsoft YaHei !important",
      fontWeight: "700  !important",
      alignSelf: "center !important",
      width: "max(50px,5.365vw) !important",
      height: "max(30px,2.083vw) !important",
      minHeight: "20px !important",
      maxHeight: "45px !important",
      borderRadius: "min(13px,0.677vw) !important",
      background: backgroundColor, // Use `background` for gradient support
      color: "#fff !important",
      transition: "0.3s !important",
      marginRight: "0.521vw !important",
      [theme.breakpoints?.down("sm")]: {
        width: "auto",
        fontSize: "14px",
      },
      "&:hover": {
        color: colors.text_grey,
        opacity: 1,
      },
      "&.Mui-selected": {
        color: "#fff !important",
        // fontWeight: theme.typography?.fontWeightMedium,
      },
    };
  }
);

const TopTabBar = ({
  labelList,
  callback,
  disabledIndent = false,
  type = 1, // 0 main tab 1 sub tab
  indexColumn = false,
  isListOnly = false,
}) => {
  const { isMobile } = useMediaQuery();
  const t = useTranslations();

  const pathname = usePathname();
  const [labelListKey] = useState(Object.keys(labelList));
  const [nowKey, setNowKey] = useState(labelListKey[0]);
  const [drawer, setDrawer] = useState(false);
  const [gameFloatStatus, setGameFloatStatus] = useState(false);
  const handleChange = (_, newValue) => {
    setNowKey(newValue);
  };

  const { state } = useGlobalContext();

  const gameListData = useMemo(() => {
    return state.vendorGameListData.vendorList?.slice(0, 5) || [];
  }, [state.vendorGameListData.vendorList]);

  const getVendorGameList = () => {
    useGlobalDispatch(getVendorGameListAction());
  };

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
      onMouseEnterEvent: () => setGameFloatStatus((pre) => !pre),
    },
    {
      name: t("Navbar.top_navigator_shop"),
      url: "",
      icon: shopIcon,
      color: "#ff5610",
      onClickEvent: () => window.open(vendorUrl),
    },
  ];
  useEffect(() => {
    if (!gameListData.length) getVendorGameList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    var url = pathname;
    var lastIndex = url.lastIndexOf("/");
    var lastParam = decodeURIComponent(url.substring(lastIndex + 1));
    switch (lastParam) {
      case t("Navbar.top_navigator_kcomics"):
        setNowKey("k-comics");
        break;
      case t("Navbar.top_navigator_doujin"):
        setNowKey("doujin");
        break;
      case t("Navbar.top_navigator_3d"):
        setNowKey("3D");
        break;
      case t("Navbar.top_navigator_free_watch"):
        setNowKey("free");
        break;
      default:
        for (let i = 0; i < labelListKey.length; i++) {
          if (lastParam.indexOf(labelListKey[i]) !== -1) {
            setNowKey(labelListKey[i]);
            return;
          }
        }
        setNowKey(labelListKey[0]);
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function onClickTab(labelKey) {
    if (indexColumn) {
      const temp = labelList[labelKey];
      switch (labelKey) {
        //韓漫、同人、3D、free 再種類裡面所以特別處理
        case "k-comics":
        case "doujin":
        case "3D":
        case "free":
          callback("category", temp.name);
          break;
        case "comic":
          callback("category", temp.name);
          break;
        case "animes":
          callback("category", temp.name);
          break;
        case "photos":
          callback("category", t("Global.visual_text"));
          break;
        case "novels":
          callback("category", temp.name);
          break;
        default:
          callback(labelKey);
          break;
      }
    } else {
      callback(labelKey);
    }
  }

  const categoryColors = [
    ["#ff487f", "#fa719a"], // Ani-Manga
    ["#33b7c3", "#7fc28f"], // Video
    ["#4aeba8", "#fcb423"], // Image
    ["#f80f6e", "#595292"], // Novel
    ["#1289e7", "#24e5c0"], // K-Comics
    ["#2065bc", "#923bde"], // Dojin
    ["#5eaeef", "#f3305f"], // 3D
    ["#ea2c38", "#ea9d3c"], // RANKS
    ["#0f74c7", "#7acfec"], // Free Watch
    ["#ffb321", "#ff8921"], // Customer Support
    ["#ff4b80", "#ff4b60"], // Download APP
    ["#ff4b80"],           // PINK
  ];

  return (
    <>
      {isMobile ? (
        <H5TopTabBarElement drawer={drawer} type={type}>
          <div
            className={`top_bar_container`}
          >
            <div className="top_bar_url">
              {labelListKey.map((labelKey, index) => {
                const bgColors = categoryColors[index % categoryColors.length] || ["#333333"];
                const backgroundColor = Array.isArray(bgColors) && bgColors.length === 2
                  ? `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`
                  : bgColors[0] || "#333333";

                return (
                  <div
                    key={labelKey}
                    className="top_bar_url_item"
                    style={{
                      color: nowKey === labelKey ? '#fff' : "#fff",
                      background: backgroundColor,
                      // padding: '10px',
                      borderRadius: '1.733vw',
                      // marginRight: '5px', 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      onClickTab(labelKey);
                    }}
                  >
                    {labelList[labelKey].name}
                  </div>
                );
              })}
            </div>
            {/* <div className="top_bar_control">
              {!drawer && (
                <Image
                  src={foldArrowIcon}
                  width={0}
                  height={0}
                  className={`${!disabledIndent && "px-indent"} top_bar_arrow ${drawer && "disabled"
                    } `}
                  onClick={() => setDrawer((pre) => !pre)}
                  alt="arrow"
                />
              )}
            </div> */}
          </div>
          {/* {drawer && (
            <div
              className={`${!disabledIndent && "px-indent"} top_bar_control ${!drawer && "disabled"
                }`}
            >
              <Image
                src={foldArrowIcon}
                width={0}
                height={0}
                className={`top_bar_arrow reverse`}
                onClick={() => setDrawer((pre) => !pre)}
                alt="arrow"
              />
            </div>
          )} */}
        </H5TopTabBarElement>
      ) : (
        <TopTabBarElement
          type={type}
          className={`${!disabledIndent && "w-auto"}`}
          isListOnly={isListOnly}
        >
          <StyledTabs value={nowKey} onChange={handleChange} className={"category_list"} variant="scrollable"
            scrollButtons="auto" >
            {labelListKey.map((labelKey, index) => {

              const bgColors = categoryColors[index % categoryColors.length] || ["#333333"];

              return (
                <AntTab
                  length={labelListKey.length}
                  value={labelKey}
                  label={
                    labelList[labelKey].intlKey
                      ? t(labelList[labelKey].intlKey)
                      : labelList[labelKey].name
                  }
                  key={labelKey}
                  bgColors={bgColors}
                  onClick={() => {
                    onClickTab(labelKey);
                  }}
                />
              );
            })}
          </StyledTabs>
          <div className={`g-center gap-3 my-auto ${!isListOnly ? '':'display-none'}`}>
            {linkItems.map((data, index) => {
              const { onMouseEnterEvent, onClickEvent, color, icon, name } =
                data;
              return (
                <div
                  key={index}
                  className={`g-center gap-1 ${index !== 1 && "cursor"}`}
                  onMouseEnter={onMouseEnterEvent && onMouseEnterEvent}
                  onMouseLeave={onMouseEnterEvent && onMouseEnterEvent}
                  onClick={onClickEvent && onClickEvent}
                  style={{ color: color, fontSize: 'max(12px,0.833vw)' }}
                >
                  <Image src={icon} width={0} height={0} alt={name} />
                  <p>{name}</p>
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
        </TopTabBarElement>
      )}
    </>
  );
};

const FeatureGameItem = () => {
  const t = useTranslations();
  const { picurl, title, total_like, id } = useContext(GameProps);
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
  /*  */
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

export default React.memo(TopTabBar, areEqual);

export const TopTabBarElement = styled.div.withConfig({
	shouldForwardProp: (prop) => !['isListOnly'].includes(prop) 
})`
  /*  */
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding-top:3px;
  height: ${({ type }) => (type === 1 ? sub_height : main_height)}px;
  background-color: #fff;
  padding-right: 5vw;
  padding-left: 5vw;
  box-sizing: content-box;
  width: ${({ isListOnly }) => !isListOnly ? 'initial' : '100%'};
  padding: ${({ isListOnly }) => isListOnly ? '0 !important' : ''};

  @media (max-width: 1024px) {
    padding-right: 1vw;
    padding-left: 1vw;
  }
  
  @media (min-width: 1400px) {
    padding-right: 11.927vw;
    padding-left: 11.927vw;
  }

  .category_list{
    width: 57.5vw;
    overflow-x:auto;

    @media (min-width: 769px) and (max-width: 1536px) {
      margin: auto 0;
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      width: 65vw;
    }
  }

  img {
    width: 25px;
    height: 25px;
    border-radius: 5%;
  }
  .float {
    position: absolute;
    background-color: #fff;
    padding: 15px;
    font-size: 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 48px;
    width: 25em;
    border-radius: 5px;
    box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
    color: black;
    &_button {
      color: #fff;
      border-radius: 20px;
      text-decoration: none;
      background: ${colors.back_dark_pink};
      padding: 5px 15px;
      width: 60%;
    }
  }
  .display-none {
    display:none;
  }
`;

export const H5TopTabBarElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["type", "drawer", "sub_height", "main_height"].includes(prop),
})`
  /*  */
  display: flex;
  background-color: #fff;
  flex-direction: column;

  .top_bar {
    &_container {
      position: relative;
      // display: flex;
      display: block;
      justify-content: center;
      align-items: center;
      height: ${({ type, drawer }) =>
    type === 1 ? (drawer ? "auto" : sub_height) : main_height}px;
      min-height: ${sub_height}px;
      
      img {
        width: 25px;
        height: 25px;
        border-radius: 5%;
      }
    }
    &_url {
      flex: 0 0 ${({ drawer }) => (drawer ? "90%" : "85%")};
      display: flex;
      flex-wrap: nowrap; // Prevent wrapping
      overflow-x: auto; // Enable horizontal scrolling
      overflow-y: hidden; // Hide vertical overflow
      gap: ${({ drawer }) => (drawer ? "1rem" : "1.333vw")};
      padding: 4px 0;
      font-size: 16px;
      text-align: center;
      align-items: center;
      white-space: nowrap; 
      height: ${({ drawer }) => (drawer ? "100%" : "auto")};

      &_item {
        display: flex;
        justifycontent: center;
        flex: 0 0 ${({ drawer }) => (drawer ? "auto" : "15%")};
        text-wrap: nowrap;
        flex-wrap: nowrap;
        min-width:103px;
        height:40px;

        @media (max-width: 768px) {
          font-size:14.1825px;
          font-weight:700;
          width:103px;
          height:40px;
        }

      }
      &_item:first-child{
        margin-left:3.867vw;
      }
      &_item:last-child{
        margin-right:3.867vw;
      }
    }
    &_control {
      text-align: center;
    }
    &_arrow {
      align-self: center;
      width: 36px !important;
      height: 20px !important;
      &.disabled {
        display: none;
      }
      &.reverse {
        transform: scaleY(-1);
      }
    }
  }
  .float {
    position: absolute;
    background-color: #fff;
    padding: 15px;
    font-size: 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 34px;
    width: 25em;
    border-radius: 5px;
    box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
    color: black;
    &_button {
      color: #fff;
      border-radius: 20px;
      text-decoration: none;
      background: ${colors.back_dark_pink};
      padding: 5px 15px;
      width: 60%;
    }
  }
`;
