"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ImageComponent from "@/components/common/ImageComponent";
import LinkComponent from "@/components/common/LinkComponent";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faLock,
  faAngleUp,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import { adsKeys, pageUrlConstants, colors } from "@/lib/constants";

import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  collectComicAnimeContentAction,
  getComicAnimeContentAction,
} from "@/store/actions/comicAnimeActionData";
import { checkinPageConditioncheckAction } from "@/store/actions/utilities";
import useMediaQuery from "@/hooks/useMediaQuery";
import ListSideBar from "@/components/common/ListSideBar";
import { CSSTransition } from "react-transition-group";
import ReactPlayerComponent from "@/components/common/ReactPlayerComponent";
import VideoContentLayout from "@/components/common/VideoContentLayout";
import Image from "next/image";
import { getPrice } from "@/lib/services/price";
import ComicRankingItem from "@/components/index/ComicRankingItem";

const HomeAnimesContent = () => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const t = useTranslations();
  const pageRef = useRef(null);
  const nodeRef = useRef(null);

  const { animeId, animeEp } = useParams();
  const [nowPage, setNowPage] = useState(animeEp);
  const [showMore, setShowMore] = useState(false);
  const [button_width, set_button_width] = useState(300);
  const { home } = pageUrlConstants;
  const [showAll, setShowAll] = useState(false);
  const [rowHeight, setRowHeight] = useState(0);

  const animeData = useMemo(() => {
    console.log(state.homeAnimesContentData[animeId]);
    return state.homeAnimesContentData[animeId] || {};
  }, [state.homeAnimesContentData, animeId]);

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
      set_button_width(isMobile ? 111 : 121);
      pageList.addEventListener("wheel", pageWheelEvent);
      return () => {
        pageList.removeEventListener("wheel", pageWheelEvent);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, animeEp, state.user.id]);

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
    // 免费集数
    if (animeData.total_free >= page) return false;
    // 已购买集数
    if (animeData.buy_episode && animeData.buy_episode.includes(page))
      return false;
    // 无限观看
    if (state.user.time === "-1" || Date.now() < state.user.time * 1000)
      return false;
    // 还有观看次数
    // if (state.user.day_usedviewcount < state.user.day_maxviewcount)
    //   return false;
    return true;
  }

  const pageWheelEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    pageRef.current.scrollLeft += e.deltaY;
  };

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

  const togglePagesBtn = () => {
    setShowAll((prev) => !prev);
  };

  const episodes = Array.from(
    { length: animeData.total_episode || 0 },
    (_, i) => i + 1
  );

  // 如果收起，只显示第一排
  useEffect(() => {
    if (pageRef.current) {
      const firstRowHeight = pageRef.current.firstChild?.offsetHeight || 0;
      setRowHeight(firstRowHeight);
    }
  }, [episodes, button_width]);

  const pickEpisodeList = (
    <div className="pick">
      <div className="pick_header">
        <p className="pick_header_part mb-2">
          {animeData.process ? t("Global.update_to") : t("Global.total")}
          {animeData.total_episode || 0}
          {t("Global.word")}
        </p>
        {/* <p className="pick_header_more" onClick={() => setShowMore(true)}>
          <span className="pick_header_more_text">{t("Global.more")}</span>
          <FontAwesomeIcon
            className="pick_header_more_icon"
            icon={faAngleRight}
          />
        </p> */}
      </div>

      <div
        ref={pageRef}
        className={`pick_pages ${showAll ? "open" : "closed"}`}
        onWheel={pageWheelEvent}
      >
        {episodes.map((pageNum) => (
          <div
            key={pageNum}
            className={
              "pick_pages_item " +
              (nowPage === pageNum ? "active " : "") +
              (checkLock(pageNum) ? "lock" : "")
            }
            style={{ width: button_width + isMobile ? "vw" : "px" }}
            onClick={() =>
              buyAnimes({
                id: animeData.id,
                jinbi: animeData.jinbi,
                episode: pageNum,
              })
            }
          >
            <p className="pick_pages_item_text">{pageNum}</p>
            <FontAwesomeIcon className="pick_pages_item_lock" icon={faLock} />
          </div>
        ))}
      </div>

      {episodes.length >
        Math.floor(pageRef.current?.clientWidth / button_width) && (
        <button onClick={togglePagesBtn} className="pick_more">
          {showAll ? (
            <>
              收起 <FontAwesomeIcon icon={faAngleUp} />
            </>
          ) : (
            <>
              查看所有章节 <FontAwesomeIcon icon={faAngleDown} />
            </>
          )}
        </button>
      )}

      <style jsx>{`
        .pick_pages {
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .pick_pages.closed {
          max-height: ${rowHeight || 0}px;
        }
        .pick_pages.open {
          max-height: 1000px; /* 足够大以容纳所有行 */
        }
      `}</style>
    </div>
  );

  const localState = useMemo(() => {
    function fillDataArray(item, length) {
      if (state.homeData?.[item] && state.homeData[item].length) {
        return [...state.homeData[item]];
      } else {
        return Array.from({ length: length || 8 }).map((data, index) => {
          return { id: index };
        });
      }
    }
    return {
      user: state.user,
      rank_anime_list: fillDataArray("rank_anime_list"),
    };
  }, [state.homeData, state.homeData.hot_comic_list]);

  const toDetailPage = (type) => {
    let url = "";
    let category = "";
    switch (type) {
      case "anime_ranking":
        url = home.pages.homeLeaderboard.pages.homeLeaderboardAnime.path;
        break;
      default:
        break;
    }
  };

  return (
    <HomeAnimesContentElement main_height={state.navbar.mainHeight}>
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
          clickCallback={(number) =>
            buyAnimes({
              id: animeData.id,
              jinbi: animeData.jinbi,
              episode: number,
            })
          }
          clickClose={setShowMore}
        />
      </CSSTransition>

      <VideoContentLayout
        adsKey={adsKeys.anime_video_banner}
        playerComponent={
          <>
            <ReactPlayerComponent
              src={state.homeAnimesViewData[animeId]?.[animeEp]}
              title={animeData.title}
              tabList={animeData.tag_gp}
              description={animeData.description}
              is_collect={animeData.is_collect == "1"}
              img={animeData.img}
              collectEvent={() => collectEvent(animeId)}
              videoId={animeId}
              videoEp={animeEp}
              type="anime"
              animeLastWatchTime={animeData.second}
              animeNextRecommend={
                state.homeAnimesViewData[animeId]?.["recommend"]
              }
            />
            {pickEpisodeList}
          </>
        }
        rightSectionContent={animeData.recommend_list
          ?.slice(0, 11)
          .map((data) => (
            <LinkComponent
              className="container_item"
              routes={{
                name:
                  pageUrlConstants.home.pages.homeAnimesSwitch.pages
                    .homeAnimesContent.name + data.title,
                path: pageUrlConstants.home.pages.homeAnimesSwitch.pages
                  .homeAnimesContent.path,
                dynamic: { animeId: data.id, animeEp: 1 },
              }}
              key={"video" + data.id}
            >
              <div className="intro-item" key={data.id}>
                <ImageComponent
                  src={data.img}
                  alt={data.title}
                  title={data.title}
                  width={0}
                  height={0}
                  border_radius="5px"
                  cover
                  is_cover
                />
                <div className="info-container">
                  <div>
                    <p className="episode_div">
                      {data.process === 1
                        ? t("Global.update_to")
                        : t("Global.total")}
                      {data.total_episode}
                      {t("Global.word")}
                    </p>
                    <h5>{data.title}</h5>
                  </div>
                  <div className="flex items-center relative">
                    <Image
                      src="/images/icons/diamond.png"
                      width={192}
                      height={192}
                      alt="diamond icon"
                      className="diamon_icon"
                    />
                    <p>{getPrice(t, data)}</p>
                  </div>
                </div>
              </div>
            </LinkComponent>
          ))}
        recommendTitle={t("Global.you_also_like")}
        recommendContent={
          <div
            className={`video_content ${
              !isMobile ? "px-indent" : "mobile-width"
            } mt-2 `}
          >
            <Grid
              container
              spacing={isMobile ? 1 : 2}
              rowSpacing={isMobile ? 5.7 : 5}
            >
              {animeData.recommend_list?.slice(0, 5)?.map((data) => (
                <Grid item md={2.4} xs={6} key={data.id}>
                  <CoverCubeItem data={data} isVideo type="animated" />
                </Grid>
              ))}
            </Grid>
          </div>
        }
      />
      <div
        className={`anime_content ${!isMobile ? "px-indent" : "mobile-width"} `}
      >
        <article className="anime_area">
          <section className="home_Main_container home_Main_rank_anime">
            <div className="home_Main_container_title g-flex-space-between">
              <div>
                <div className="g-flex items-center gap-2 lg:gap-3">
                  <span className="home_Main_container_title_text_span">
                    {t("Home.ranking.anime")}
                  </span>
                  <div className="btn-daily-ranking cursor">
                    <span className="text-white">日排行榜</span>
                  </div>
                  <div className="btn-weekly-ranking cursor">
                    <span className="text-white">周排行榜</span>
                  </div>
                  <div className="btn-monthly-ranking cursor">
                    <span className="text-white">月排行榜</span>
                  </div>
                </div>
              </div>
              <p
                className="home_Main_container_subtitle"
                onClick={() => toDetailPage("anime_ranking")}
              >
                {t("Common.see_all")}&gt;
              </p>
            </div>

            <div
              className={`g-flex-start overflow-auto h-100 ${
                isMobile && "w-100 g-overflow-auto"
              } gap-3`}
            >
              <ComicRankingItem
                list={localState.rank_anime_list}
                type="animated"
                rankStyle
              />
            </div>
          </section>
        </article>
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
  .pick {
    padding-top: 10px;
    width: 100%;
    position: relative;

    @media (max-width: 899px) {
      padding: 0 2.67vw;
    }

    &_tab {
      padding: 5px 3px;
    }

    &_header {
      display: flex;
      justify-content: space-between;
      padding: 0 3px;

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
      flex-wrap: wrap;
      padding: 0;
      width: 100%;
      gap: 14px 9px;
      margin-top: 0.85vw;
      
      @media (max-width: 899px) {
        gap: 14px 1.0vw;
      }

      &_item {
        user-select: none;
        flex-shrink: 0;
        position: relative;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 121px;
        height: 40px;

        @media (max-width: 899px) {
          width: 14.81vw;
        }

        &_text {
          cursor: pointer;
          // padding: 15px 0;
          text-align: center;
          width: 100%;
          height: 100%;
          background-color: #f3f3f3;
          border-radius: 5px;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &_lock {
          position: absolute;
          top: 50%;
          transform: translateY(-40%);
          right: 15px;
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

    &_more {
      font-size: 14px;
      font-family: "Microsoft YaHei";
      color: rgb(111, 111, 111);
      line-height: 2.571;
      text-align: center;
      cursor: pointer;
      width: 100%;
      border-top: 1px solid #f3f3f3;
      padding-top: 0.95vw;
      margin-top: 1.93vw;
      margin-bottom: 2.4vw;

      @media (max-width: 899px) {
        padding-top: 1.25vw;
        margin-top: 2.93vw;
        margin-bottom: 5.4vw;
        font-size: 2.4vw;
        color: #333333;
      }
    }
  }

  .anime_content{
    margin-top: -0.72vw;
    @media (max-width: 899px) {
      display: none;
    }

    .home_Main {

      &_container {
        margin-bottom: 6.05vw;

        @media (max-width: 899px) {
          padding: 0.5em;
        }

        &:last-child {
          margin-bottom: none;
          border-bottom: none;
        }

        &_title {
          display: flex;
          justify-content: space-between;
          align-items: center;
              margin-bottom: 1.1vw;

          @media (max-width: 899px) {
            // margin-bottom: 0px;
          }

          &_wrapper{
            display: flex;
            gap: 1.09vw;
          }

          &_text {
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: 900;
            &_img {
              width: 35px;
              height: 35px;
              vertical-align: middle;
              @media (max-width: 899px) {
                width: 25px;
                height: 25px;
              }
            }

            &_span {
              vertical-align: middle;
              font-size: 16px;
              font-weight: 600;
              @media (max-width: 899px) {
                font-size: max(0.94rem, 3.47vw);
              }
              &_marked {
                color: ${colors.back_dark_pink};
              }
            }
          }

          .inactive{
            color: #666666;
          }
        }

        &_subtitle {
          cursor: pointer;
          font-size: 3.2vw;
          @media (min-width: 899px) {
            font-size: 16px;
          }
        }

        &_ranking {
          &_top {
            color: #000000;
            border-radius: 5px;
            // background-image: linear-gradient(99deg, #86b7f7 49%, #5a65f2);
            margin-bottom: 10px;
            box-sizing: border-box;
            &_title {
              font-weight: 600;
              font-size: 14px;
              @media (min-width: 899px) {
                font-size: 20px;
              }
            }
          }
        }

        .btn-daily-ranking{
          background: linear-gradient(to right, #335fc2, #873fdb);
          width: 90px;
          height: 30px;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;

          @media (max-width: 898px){
            width: 14.32vw;
            height: 4.56vw;
            border-radius: 2.29vw;
            font-size: 2.34vw;
          }
        }

        .btn-weekly-ranking{
          background: linear-gradient(to right, #c92379, #74478c);
          width: 90px;
          height: 30px;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;

          @media (max-width: 898px){
            width: 14.32vw;
            height: 4.56vw;
            border-radius: 2.29vw;
            font-size: 2.34vw;
          }
        }

        .btn-monthly-ranking{
          background: linear-gradient(to right, #1494e2, #23ddc3);
          width: 90px;
          height: 30px;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;

          @media (max-width: 898px){
            width: 14.32vw;
            height: 4.56vw;
            border-radius: 2.29vw;
            font-size: 2.34vw;
          }
        }

        .item_body div{
          min-height: 2vw !important; 
          padding-bottom: 5.2vw !important;

          @media (max-width: 898px){
            padding-bottom: 5.2vw !important;
          }
        }

        .item_footer_description_text{
          margin-top: 0.1vw;
        }

        .item_footer_gold{
            margin-top: 0.85vw;
        }

        .comic_ranking_number{
          height: 1.8em;
          top: -0.3em;
          left: -3.01em;
        }
      }
    }
  }

  .video_content.mobile-width {
    width: 94.67vw;
    margin: auto;
  }
`}
`;
