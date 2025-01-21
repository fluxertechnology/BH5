"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";

import ReactPlayerComponent from "@/components/common/ReactPlayerComponent";
import ImageCarousel from "@/components/common/ImageCarousel";
import { adsKeys, colors, padding } from "@/lib/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faLock } from "@fortawesome/free-solid-svg-icons";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import { CSSTransition } from "react-transition-group";
import ListSideBar from "@/components/common/ListSideBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useParams } from "next/navigation";

import {
  collectComicAnimeContentAction,
  getComicAnimeContentAction,
} from "@/store/actions/comicAnimeActionData";
import { checkinPageConditioncheckAction } from "@/store/actions/utilities";

const HomeAnimesContent = () => {
  const { state } = useGlobalContext();

  const { isMobile } = useMediaQuery();
  const t = useTranslations();
  const pageRef = useRef(null);

  const params = useParams();
  const animeId = params.animeId;
  const animeEp = params.animeEp;

  const [nowPage, setNowPage] = useState(animeEp);

  const [showMore, setShowMore] = useState(false);

  const [button_width, set_button_width] = useState(300);

  const animeData = useMemo(() => {
    return state.homeAnimesContentData[animeId]
      ? { ...state.homeAnimesContentData[animeId] }
      : {};
  }, [state.homeAnimesContentData]);

  useEffect(() => {
    setNowPage(animeEp);
  }, [animeEp]);

  useEffect(() => {
    if (animeId) {
      const pageList = pageRef.current;
      getAnimeContent(animeId, animeEp, (data) => {
        setTimeout(() => {
          checkUser({
            id: data.id,
            jinbi: data.jinbi,
            episode: animeEp,
            animeLastWatchTime: data.second,
          });
        }, 0);
      });
      set_button_width(
        isMobile
          ? (pageList.offsetWidth - 20) / 4.5
          : (pageList.offsetWidth - 20) / 12
      );
      pageList.addEventListener("wheel", pageWheelEvent);
      return () => {
        pageList.removeEventListener("wheel", pageWheelEvent);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, animeEp]);

  function clickPageEvent(number) {
    buyAnimes({
      id: animeData.id,
      jinbi: animeData.jinbi,
      episode: number,
    });
  }

  /**
   * @description 檢查是不是被鎖住
   *
   * @param {*} page
   * @return {*}
   */
  function checkLock(page) {
    return animeData.buy_episode
      ? state.user.time === "-1" || Date.now() < state.user.time * 1000
        ? false
        : state.user.day_usedviewcount < state.user.day_maxviewcount
          ? false
          : animeData.total_free >= page
            ? false
            : animeData.buy_episode.indexOf(page) !== -1
              ? false
              : true
      : true;
  }

  function pageWheelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    pageRef.current.scrollLeft += e.deltaY;
  }

  const getAnimeContent = (id, ep, callback) => {
    useGlobalDispatch(
      getComicAnimeContentAction(id, ep, "INIT_ANIMESCONTENT", callback)
    );
    // dispatch(getAnimeContentAction(id, ep));
  };
  const checkUser = (data) => {
    useGlobalDispatch(
      checkinPageConditioncheckAction({
        itemId: data.id,
        itemType: 3,
        episode: data.episode,
        checkOnPage: true,
        animeLastWatchTime: data.animeLastWatchTime,
      })
    );
  };
  const buyAnimes = (data) => {
    useGlobalDispatch(
      checkinPageConditioncheckAction({
        itemId: data.id,
        itemType: 3,
        episode: data.episode,
      })
    );
  };
  const collectEvent = (id) => {
    useGlobalDispatch(collectComicAnimeContentAction(id, 2));
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        isShowFooter: false,
      },
    });
  }, []);

  const nodeRef = useRef(null);
  return (
    <HomeAnimesContentElement main_height={state.navbar.mainHeight}>
      <TopBarContainer not_fixed={true} show_shadow={false} z_index={8} top="unset">
        <TopTitleBar
          showBack={true}
          back_color={"transparent"}
          show_back_color={"#fff"}
        />
      </TopBarContainer>
      <CSSTransition
        timeout={200}
        in={showMore}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_show_cover"
        nodeRef={nodeRef}
      >
        <ListSideBar
          is_in={showMore}
          nowIndex={parseInt(animeEp)}
          totalIndex={animeData.total_episode}
          checkLock={checkLock}
          clickCallback={clickPageEvent}
          clickClose={setShowMore}
        />
      </CSSTransition>
      <div className="header">
        <ReactPlayerComponent
          src={state.homeAnimesViewData[animeId]?.[animeEp]}
          title={animeData.title}
          tabList={animeData.tag_gp}
          description={animeData.description}
          is_collect={animeData.is_collect == "1"}
          img={animeData.img}
          collectEvent={() => {
            collectEvent(animeId);
          }}
          videoId={animeId}
          videoEp={animeEp}
          type="anime"
          animeLastWatchTime={animeData.second}
          animeNextRecommend={state.homeAnimesViewData[animeId]?.["recommend"]}
        />
      </div>
      <div className="pick">
        <div className="pick_header">
          <p className="pick_header_part mb-2">
            {animeData.process ? t("Global.update_to") : t("Global.total")}
            {animeData.total_episode || 0}
            {t("Global.word")}
          </p>
          <p
            className="pick_header_more"
            onClick={() => {
              setShowMore(true);
            }}
          >
            <span className="pick_header_more_text">{t("Global.more")}</span>
            <FontAwesomeIcon
              className="pick_header_more_icon"
              icon={faAngleRight}
            />
          </p>
        </div>
        <div ref={pageRef} className="pick_pages mb-2" onWheel={pageWheelEvent}>
          {Array.from(
            {
              length: animeData.total_episode,
            },
            (v, i) => i + 1
          ).map((data) => {
            return (
              //
              <div
                className={
                  "pick_pages_item " +
                  (nowPage === data ? "active " : "") +
                  (checkLock(data) ? "lock" : "")
                }
                style={{
                  width: button_width + "px",
                }}
                key={data}
                onClick={() => {
                  clickPageEvent(data);
                }}
              >
                <p className="pick_pages_item_text">{data}</p>
                <FontAwesomeIcon
                  className="pick_pages_item_lock"
                  icon={faLock}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={isMobile ? "my-2" : "my-5"}>
        <ImageCarousel
          adsKey={adsKeys.anime_video_banner}
          threeInOneBanner={!isMobile}
          size="banner_ads"
        />
      </div>
      <div className="recommend">
        <p className="recommend_title">{t("Global.you_also_like")}</p>
        <div className="recommend_container">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={isMobile ? 1 : 4}
          >
            {animeData.recommend_list
              ? animeData.recommend_list.map((data) => {
                return (
                  <Grid item md={3} xs={6} key={data.id}>
                    <CoverCubeItem data={data} isVideo type="animated" />
                  </Grid>
                );
              })
              : ""}
          </Grid>
        </div>
      </div>
    </HomeAnimesContentElement>
  );
};

export default HomeAnimesContent;

export const HomeAnimesContentElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
${({ main_height }) => `
  /*  */
  padding: ${main_height}px 0;

  .pick {
    padding-top: 10px;
    width: 100%;

    &_tab {
      padding: 5px ${padding}px;
    }

    &_header {
      display: flex;
      justify-content: space-between;
      padding: 0 ${padding}px;

      &_part {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      &_more {
        cursor: pointer;

        &_text {
          font-size: 20px;
          color: ${colors.dark_pink};
        }

        &_icon {
          margin-left: 5px;
          vertical-align: bottom;
          color: ${colors.dark_pink};
        }
      }
    }

    &_pages {
      display: flex;
      overflow: auto;
      padding: 0 10px;

      &_item {
        user-select: none;
        flex-shrink: 0;
        position: relative;
        display: inline-block;
        padding: 5px;
        box-sizing: border-box;

        &_text {
          cursor: pointer;
          padding: 15px 0;
          text-align: center;
          background-color: #f3f3f3;
          border-radius: 5px;
          transition: 0.2s;
        }

        &_lock {
          position: absolute;
          right: 15px;
          bottom: 10px;
          font-size: 12px;
          color: #646464;
          opacity: 0%;
        }

        &.active {
          .pick_pages_item_text {
            color: #fff;
            background-color: ${colors.dark_pink};
          }
        }

        &.lock {
          .pick_pages_item_lock {
            opacity: 100%;
          }
        }
      }
    }
  }

  .recommend {
    margin-top: 10px;
    padding-left: 2%;
    padding-right: 2%;
    @media (min-width: 599px) {
      padding-left: 10%;
      padding-right: 10%;
    }

    &_title {
      font-weight: 900;
      font-size: 18px;
      letter-spacing: 1px;
    }

    &_container {
      display: flex;
      margin-top: 10px;
      flex-wrap: wrap;
    }
  }
`}`;
