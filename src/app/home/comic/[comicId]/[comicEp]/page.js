"use client";

// 跟美圖幾乎一模一樣，記得兩邊都要修改沒有寫共用　ｏｒｚ

import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";

import WavaButton from "@/components/layout/Header/WavaButton";
import ImageComponent from "@/components/common/ImageComponent";
import { padding } from "@/lib/constants";

import ListsideBar from "@/components/common/ListSideBar";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import ReportCoverComponent, {
  ReportType,
} from "@/components/common/ReportCoverComponent";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useParams } from "next/navigation";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { checkinPageConditioncheckAction } from "@/store/actions/utilities";
import {
  collectComicAnimeContentAction,
  getComicAnimeContentAction,
} from "@/store/actions/comicAnimeActionData";

let mouseMoveBasePoint = 0;
let move = 0;

const HomeComicListContentView = () => {
  const { state, dispatch } = useGlobalContext();
  const t = useTranslations();

  const { isMobile } = useMediaQuery();

  const navRef = useRef(null);

  let [view_type, setView_type] = useState(0); // 0 scroll 1 swiper

  let [comic_pages, set_comic_pages] = useState(0);
  const [show_setcomic_pages, set_show_setcomic_pages] = useState(false);

  const [comic_pages_offset, set_comic_pages_offset] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const [showOptionNav, setShowOptionNav] = useState(true);
  const [reportCoverShow, setReportCoverShow] = useState(false);

  const params = useParams();
  const comicId = params.comicId;
  const comicEp = params.comicEp;

  const comicData = state.homeComicContentData[comicId]
    ? { ...state.homeComicContentData[comicId] }
    : {};
  const comic_view = state.homeComicViewData[comicId]
    ? state.homeComicViewData[comicId][comicEp]
      ? state.homeComicViewData[comicId][comicEp]
      : []
    : [];

  useEffect(() => {
    if (!comicData.id) {
      getComicContent(comicId, comicEp, (data) => {
        setTimeout(() => {
          checkUser({
            id: data.id,
            jinbi: comicData.jinbi,
            episode: comicEp,
          });
          // if(comic_view.length === 0) getComicViewPhotos(comicId, comicEp);
        }, 0);
      });
    } else {
      checkUser({
        id: comicData.id,
        jinbi: comicData.jinbi,
        episode: comicEp,
      });
      // if(comic_view.length === 0) getComicViewPhotos(comicId, comicEp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user.id]);

  function clickCollectEvent() {
    collectEvent(comicId);
  }

  function scrollToImage() {
    window.scroll({
      top: document.getElementsByClassName("container_card")[comic_pages]
        .offsetTop,
      left: 0,
    });
  }

  function pagesRangeChange(e) {
    comic_pages = parseInt(e.target.value);
    set_comic_pages(comic_pages);
    if (!view_type) {
      scrollToImage();
    }
  }

  function sliderStart(e) {
    if (view_type) {
      mouseMoveBasePoint = e.changedTouches
        ? e.changedTouches[0].clientX || 0
        : e.clientX;
      move = 0;
      window.addEventListener("mousemove", sliderMove);
      window.addEventListener("touchmove", sliderMove);
      window.addEventListener("mouseup", sliderDone);
      window.addEventListener("mouseout", sliderDone);
      window.addEventListener("touchend", sliderDone);
    }
  }

  function sliderMove(e) {
    move =
      (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) -
      mouseMoveBasePoint;
    if (comic_pages === 0 && move > 0) {
      move = 0;
    } else if (comic_pages === comic_view.length - 1 && move < 0) {
      move = 0;
    }
    set_comic_pages_offset(move);
  }

  function sliderDone(e) {
    window.removeEventListener("mousemove", sliderMove);
    window.removeEventListener("touchmove", sliderMove);
    window.removeEventListener("mouseup", sliderDone);
    window.removeEventListener("mouseout", sliderDone);
    window.removeEventListener("touchend", sliderDone);
    if (move >= 100) {
      set_comic_pages(comic_pages - 1);
    } else if (move <= -100) {
      set_comic_pages(comic_pages + 1);
    }
    set_comic_pages_offset(0);
  }

  /**
   * @description 從 src\pages\homeComicListContent\HomeComicListContentRender.js 複製過來的
   *
   * @param {*} page
   * @return {*}
   */
  function checkLock(page) {
    return comicData.buy_episode
      ? state.user.time === "-1" || Date.now() < state.user.time * 1000
        ? false
        : state.user.day_usedviewcount < state.user.day_maxviewcount
        ? false
        : comicData.total_free >= page
        ? false
        : comicData.buy_episode.indexOf(page) !== -1
        ? false
        : true
      : true;
  }

  function clickPageEvent(ep) {
    toComicEpPage(comicId, ep);
  }

  function toggleOptionNav() {
    setShowOptionNav(!showOptionNav);
  }

  const checkUser = (data) => {
    useGlobalDispatch(
      checkinPageConditioncheckAction({
        itemId: data.id,
        itemType: 2,
        episode: data.episode,
        checkOnPage: true,
      })
    );
  };
  const getComicContent = (id, episode, callback) => {
    useGlobalDispatch(
      getComicAnimeContentAction(id, episode, "INIT_COMICCONTENT", callback)
    );
  };
  const collectEvent = (id) => {
    useGlobalDispatch(collectComicAnimeContentAction(parseInt(id)));
  };
  const toComicEpPage = (id, ep) => {
    useGlobalDispatch(
      checkinPageConditioncheckAction({
        itemId: id,
        itemType: 2,
        episode: ep,
      })
    );
  };

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <CSSTransition
            timeout={200}
            in={showOptionNav}
            classNames="CSSTransition_opacity"
            unmountOnExit
            key="CSSTransition_top_nav"
            nodeRef={navRef}
          >
            <TopBarContainer>
              <TopTitleBar
                title={comicData.title}
                showBack={true}
                back_color={"#000a"}
                show_back_color={"#ffffff"}
              >
                <div
                  className="header_comic"
                  onClick={() => {
                    setReportCoverShow(true);
                  }}
                >
                  <FontAwesomeIcon
                    className="header_comic_icon"
                    icon={faBullhorn}
                  />
                </div>
              </TopTitleBar>
            </TopBarContainer>
          </CSSTransition>
        ),
      },
    });
  }, [showOptionNav]);

  return (
    <HomeComicListContentViewElement
      view_type={view_type}
      onMouseDown={sliderStart}
      onTouchStart={sliderStart}
    >
      <CSSTransition
        timeout={200}
        in={reportCoverShow}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_OutOfQuotaPortal"
        nodeRef={navRef}
      >
        <ReportCoverComponent
          report_type={ReportType.comic}
          reportId={comicId}
          reportEp={comicEp}
          setReportCoverShow={setReportCoverShow}
        />
      </CSSTransition>
      <CSSTransition
        timeout={200}
        in={showMore}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_show_cover"
        nodeRef={navRef}
      >
        <ListsideBar
          is_in={showMore}
          nowIndex={parseInt(comicEp)}
          totalIndex={comicData.total_episode}
          checkLock={checkLock}
          clickCallback={clickPageEvent}
          clickClose={setShowMore}
        />
      </CSSTransition>
      <div
        className="container"
        onClick={toggleOptionNav}
        style={{
          width: view_type
            ? comic_view.length + "00%"
            : !isMobile
            ? "50%"
            : "100%",
          height: view_type ? "calc(var(--vh, 1vh) * 100)" : "auto",
          transform: view_type
            ? "translateX(calc( " +
              comic_pages_offset +
              "px + -" +
              (100 / comic_view.length) * comic_pages +
              "%))"
            : "unset",
          transition: comic_pages_offset ? "unset" : ".2s",
        }}
      >
        {comic_view.map((data) => {
          return (
            <div
              className="container_card"
              style={{
                width: view_type ? 100 / comic_view.length + "%" : "100%",
              }}
              key={data}
            >
              <ImageComponent
                className="container_card_img"
                style={
                  view_type
                    ? {
                        paddingBottom: 0,
                        height: "100%",
                      }
                    : {}
                }
                src={data}
                alt={comicData.title}
                border_radius={0}
                toFixSize={true}
                height={30}
                background_color="#000"
              />
            </div>
          );
        })}
      </div>
      <CSSTransition
        timeout={200}
        in={showOptionNav}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_bottom_nav"
        nodeRef={navRef}
      >
        <div ref={navRef} className="bottom_nav">
          <div
            className="bottom_nav_pages"
            style={
              show_setcomic_pages
                ? {
                    top: "-30px",
                    height: "30px",
                    opacity: 1,
                  }
                : {}
            }
          >
            <div className="bottom_nav_pages_range">
              <input
                className="bottom_nav_pages_range_input"
                type="range"
                min="0"
                max={comic_view.length - 1}
                step="1"
                value={comic_pages}
                onChange={pagesRangeChange}
              />
            </div>
            <div className="bottom_nav_pages_show">
              <p className="bottom_nav_pages_show_text">
                {comic_pages + 1}/{comic_view.length}
              </p>
            </div>
          </div>
          <div
            className="bottom_nav_item"
            onClick={(e) => {
              e.stopPropagation();
              set_show_setcomic_pages(!show_setcomic_pages);
            }}
          >
            <WavaButton
              className="bottom_nav_item_box"
              currentRefs={[navRef]}
              type={1}
            >
              <div className="bottom_nav_item_box_icon">
                <Image
                  className="bottom_nav_item_box_icon_img"
                  src="/images/icons/book.svg"
                  width={0}
                  height={0}
                  alt="pages"
                />
              </div>
              <div className="bottom_nav_item_box_text">
                {t("Global.page_amount")}
              </div>
            </WavaButton>
          </div>
          <div
            className="bottom_nav_item"
            onClick={() => {
              view_type = !view_type;
              setView_type(view_type);
              setTimeout(() => {
                scrollToImage();
              }, 500);
            }}
          >
            <WavaButton
              className="bottom_nav_item_box"
              currentRefs={[navRef]}
              type={1}
            >
              <div className="bottom_nav_item_box_icon">
                <Image
                  className="bottom_nav_item_box_icon_img"
                  src={
                    view_type
                      ? "/images/icons/book_open.svg"
                      : "/images/icons/scroll.svg"
                  }
                  width={0}
                  height={0}
                  alt="type"
                />
              </div>
              <div className="bottom_nav_item_box_text">
                {view_type
                  ? t("Global.action.turn_scroll")
                  : t("Global.action.turn_pages")}
              </div>
            </WavaButton>
          </div>
          <div className="bottom_nav_item" onClick={clickCollectEvent}>
            <WavaButton
              className="bottom_nav_item_box"
              currentRefs={[navRef]}
              type={1}
            >
              <div className="bottom_nav_item_box_icon">
                <Image
                  className="bottom_nav_item_box_icon_img"
                  src={
                    comicData?.is_collect == "1"
                      ? "/images/icons/star_fill.svg"
                      : "/images/icons/star.svg"
                  }
                  width={0}
                  height={0}
                  alt="collect"
                />
              </div>
              <div className="bottom_nav_item_box_text">
                {t("Global.action.collect")}
              </div>
            </WavaButton>
          </div>
          <div
            className="bottom_nav_item"
            onClick={() => {
              setShowMore(true);
            }}
          >
            <WavaButton
              className="bottom_nav_item_box"
              currentRefs={[navRef]}
              type={1}
            >
              <div className="bottom_nav_item_box_icon">
                <Image
                  className="bottom_nav_item_box_icon_img"
                  src="/images/icons/catalog.svg"
                  width={0}
                  height={0}
                  alt="catalog"
                />
              </div>
              <div className="bottom_nav_item_box_text">{t("Global.list")}</div>
            </WavaButton>
          </div>
        </div>
      </CSSTransition>
    </HomeComicListContentViewElement>
  );
};

export default HomeComicListContentView;

export const HomeComicListContentViewElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["view_type"].includes(prop),
})`
  /*  */
  box-sizing: border-box;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  display: ${({ view_type }) => (view_type ? "block" : "flex")};
  justify-content: center;

  .header_comic {
    width: 20px;
    height: 20px;
    &_icon {
      width: 100%;
      height: 100%;
    }
  }

  input[type="range"] {
    height: 5px;
    background-color: transparent;
    border: 1px solid #fff;
    border-radius: 10px;
    outline: none; /* 避免點選會有藍線或虛線 */
    appearance: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    appearance: none;
    transition: 0.2s;
  }

  input[type="range"]::-moz-range-thumb {
    cursor: pointer;
    width: 16px;
    height: 16px;
    background: #fff;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .bottom_nav {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    margin: auto;
    background-color: #000a;
    height: 80px;

    &_pages {
      user-select: none;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 0 ${padding}px;
      height: 0;
      background-color: #000a;
      opacity: 0%;
      transition: 0.2s;

      &_range {
        flex-grow: 1;

        &_input {
          width: 100%;
        }
      }

      &_show {
        width: 70px;
        text-align: right;

        &_text {
          color: #fff;
        }
      }
    }

    &_item {
      cursor: pointer;
      user-select: none;
      flex-grow: 1;

      &_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;

        &_icon {
          width: 35px;
          height: 35px;

          &_img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
          }
        }

        &_text {
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
`;
