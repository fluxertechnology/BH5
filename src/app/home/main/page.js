"use client";

import { useTranslations } from "next-intl";
import { adsKeys, colors, pageUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useEffect, useMemo, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  getHomeData,
  getContinueWatchData,
} from "@/store/actions/pages/homeMainAction";
import styled from "styled-components";

import ImageCarousel from "@/components/common/ImageCarousel";
import SlideCarousel from "@/components/common/SlideCarousel";
import RefreshBtn from "@/components/index/RefreshBtn";
import ShowItem from "@/components/index/ShowItem";
import ComicRankingItem from "@/components/index/ComicRankingItem";
import TopTabBar from "@/components/common/TopTabBar";
import { pushRoutes } from "@/store/actions/historyActions";
import Image from "next/image";

import ContinueWatchSlideCarousel from "@/components/index/ContinueWatchSlideCarousel";

import { AntTab, StyledTabs, TabPanel } from "@/components/common/MuiTabItem";
import OriginalCarousel from "@/components/common/OriginalCarousel";
import { refreshAnimeData } from "@/store/actions/pages/homeMainAction";
import { getVendorListAction } from "@/store/actions/pages/vendorMainAction.js";
import {
  postAttentionEventAction,
  postScribeEventAction,
} from "@/store/actions/pages/postCardItemAction";
import { vendorUrl } from "@/lib/constants/index.js";
import {
  getNovelsTabAction,
  setNowTabList,
} from "@/store/actions/pages/homeNovelsAction";
import { getNovelsDataAction } from "@/store/actions/pages/homeNovelsListAction";
import Grid from "@mui/material/Grid";
import NovelCard from "@/components/common/NovelCard";
import { getHomeLeaderBoardDataAction } from "@/store/actions/pages/homeLeaderboardAction";

const { home, vendor } = pageUrlConstants;

export default function HomeMainPage() {
  const t = useTranslations();

  const { state } = useGlobalContext();

  const [videoTabValue, setVideoTabValue] = useState();
  const [photoTabValue, setPhotoTabValue] = useState();
  const [novelTabValue, setNovelTabValue] = useState();

  const { isMobile } = useMediaQuery();

  const [showComic, setShowComic] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [page, setPage] = useState(1);

  const nowTab = useMemo(
    () => state.homeNovel.nowTab,
    [state.homeNovel.nowTab]
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
      anime_watch_history: state.homeData.anime_watch_history || [],
      comic_watch_history: state.homeData.comic_watch_history || [],
      weekComicList: fillDataArray("week_comic_list"),
      hot_comic_list: fillDataArray("hot_comic_list"),
      rank_comic_list: fillDataArray("rank_comic_list"),
      all_comic_list: fillDataArray("all_comic_list"),
      week_anime_list: fillDataArray("week_anime_list"),
      rank_anime_list: fillDataArray("rank_anime_list"),
      hot_anime_list: fillDataArray("hot_anime_list"),
      all_anime_list: fillDataArray("all_anime_list"),
      game_list: fillDataArray("game_list"),
      video_list: state.homeData.video_list || {},
      video_category_list: state.homeData.video_category_list || [],
      photo_category_list: state.homeData.photo_category_list || [],
      photo_list: state.homeData.photo_list || {},
      novel_list: fillDataArray("novel_list"),
      creation_list: fillDataArray("creation_list"),
    };
  }, [state.homeData, state.homeData.hot_comic_list]);

  const getLeaderBoardData = (type, range) => {
    // type: 0: 动漫排行, 1: 漫画排行
    // range = 1: 日排行, 2: 周排行, 3: 收藏榜-周, 4: 月排行
    useGlobalDispatch(getHomeLeaderBoardDataAction(type, range));
  };
  useEffect(() => {
    getLeaderBoardData(0, 1);
    getLeaderBoardData(1, 1);
  }, []);

  useEffect(() => {
    if (!localState.video_category_list.length)
      useGlobalDispatch(getHomeData());
    useGlobalDispatch(getContinueWatchData());
  }, [isMobile]);

  const toggleContent = (comic, video) => {
    if (comic) {
      document.querySelectorAll(".c-comic").forEach((element) => {
        element.classList.remove("inactive");
      });
      document.querySelectorAll(".c-video").forEach((element) => {
        element.classList.add("inactive");
      });
    }
    if (video) {
      document.querySelectorAll(".c-comic").forEach((element) => {
        element.classList.add("inactive");
      });
      document.querySelectorAll(".c-video").forEach((element) => {
        element.classList.remove("inactive");
      });
    }

    setShowComic(comic);
    setShowVideo(video);
  };

  const handleVideoIndexChange = (event, newValue) => {
    setVideoTabValue(newValue);
  };

  const handlePhotoIndexChange = (event, newValue) => {
    setPhotoTabValue(newValue);
  };

  const handleNovelIndexChange = (event, newValue) => {
    setNovelTabValue(newValue);
    clickTabEvent(newValue);
  };

  useEffect(() => {
    // let tabBar = novelTabListRef.current;
    // tabBar.addEventListener("wheel", novelWheelEvent);
    // window.addEventListener("scroll", scrollEvent);
    if (
      state.homeNovelsListData[nowTab]?.page === 0 ||
      state.homeNovelsListData[nowTab] === undefined
    ) {
      updateNovelsData(nowTab, () => {});
    }
    // return () => {
    //   tabBar.removeEventListener("wheel", novelWheelEvent);
    //   window.removeEventListener("scroll", scrollEvent);
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowTab]);
  useEffect(() => {
    updateNovelsData(nowTab, () => {});
  }, []);

  useEffect(() => {
    if (localState.video_category_list.length)
      setVideoTabValue(
        localState.video_category_list[
          localState.video_category_list.length - 1
        ].id
      );
    if (localState.photo_category_list.length)
      setPhotoTabValue(
        localState.photo_category_list[
          localState.photo_category_list.length - 1
        ].id
      );

    if (state.homeNovelsList.length === 0) {
      getNovelsTab();
    } else {
      setNovelTabValue(state.homeNovelsList[0].id);
      setNowTabList(state.homeNovelsList[0].id);
    }
  }, [
    localState.video_category_list.length,
    localState.photo_category_list.length,
    state.homeNovelsList.length,
  ]);

  const getNovelsTab = () => {
    useGlobalDispatch(getNovelsTabAction());
  };

  const updateNovelsData = (id, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getNovelsDataAction(id, scrollColdEnd));
  };

  const clickTabEvent = (id) => {
    useGlobalDispatch(setNowTabList(id));
  };

  const refreshData = (key) => {
    useGlobalDispatch(refreshAnimeData(key));
  };
  const toDetailPage = (type) => {
    let url = "";
    let category = "";
    switch (type) {
      case "comic_ranking":
        url = home.pages.homeLeaderboard.pages.homeLeaderboardComic.path;
        break;
      case "all_comic_list":
        url = home.pages.homeMain.pages.homeCategory.path;
        category = {
          tab: t("Global.j_comics"),
        };
        break;
      case "anime_ranking":
        url = home.pages.homeLeaderboard.pages.homeLeaderboardAnime.path;
        break;
      case "all_anime_list":
        url = home.pages.homeMain.pages.homeCategory.path;
        category = {
          tab: t("Global.animate"),
        };
        break;
      case "feature_game":
        url = home.pages.homeGame.path;
        break;
      case "video":
        url = home.pages.homeMain.pages.homeVideos.path;
        break;
      case "photo":
        url = home.pages.homeMain.pages.homeCategory.path;
        category = {
          tab: t("Global.visual_text"),
        };
        break;
      case "novel_list":
        url = home.pages.homeMain.pages.homeCategory.path;
        category = {
          tab: t("Navbar.top_navigator_novel"),
        };
        break;
      case "shop":
        url = vendor.path;
        break;
      default:
        break;
    }
    useGlobalDispatch(pushRoutes({ path: url, dynamic: category }));
  };

  useEffect(() => {
    useGlobalDispatch(getVendorListAction());
  }, [isMobile]);

  let labelList = {
    anime: {
      intlKey: "Navbar.top_navigator_animate_comic",
      name: t("Navbar.top_navigator_animate_comic"),
    },
    videos: {
      intlKey: "Navbar.top_navigator_video",
      name: t("Navbar.top_navigator_video"),
    },
    photos: {
      intlKey: "Navbar.top_navigator_meitu",
      name: t("Navbar.top_navigator_meitu"),
    },
    novels: {
      intlKey: "Navbar.top_navigator_novel",
      name: t("Navbar.top_navigator_novel"),
    },
    // streams: {
    //   name: t('Navbar.top_navigator_stream')
    // },
    // doujin 韓漫
    "k-comics": {
      intlKey: "Navbar.top_navigator_kcomics",
      name: t("Navbar.top_navigator_kcomics"),
    },
    // doujin 同人
    doujin: {
      intlKey: "Navbar.top_navigator_doujin",
      name: t("Navbar.top_navigator_doujin"),
    },
    "3D": {
      intlKey: "Navbar.top_navigator_3d",
      name: t("Navbar.top_navigator_3d"),
    },
    ranking: {
      intlKey: "Navbar.top_navigator_ranking",
      name: t("Navbar.top_navigator_ranking"),
    },
    free: {
      intlKey: "Navbar.top_navigator_free_watch",
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

  const clickTabLabel = (key, dynamic) => {
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

  const postCardScribeMediaEvent = (data, type) => {
    if (localState.user.id === "guest") {
      useGlobalDispatch(pushRoutes(login));
    } else {
      useGlobalDispatch(postScribeEventAction(data, type));
    }
  };
  const postCardAttentionEvent = (data) => {
    if (localState.user.id === "guest") {
      useGlobalDispatch(pushRoutes(login));
    } else {
      useGlobalDispatch(
        postAttentionEventAction({
          uid: data.uid,
          is_attention: data.is_follow,
        })
      );
    }
  };

  const TopTabBarComponent = () => {
    return (
      <TopTabBar labelList={labelList} callback={clickTabLabel} indexColumn />
    );
  };
  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        isPlaceholder: true,
        appendComponent: TopTabBarComponent,
        customComponent: () => false,
      },
    });
  }, []);

  // 商城
  function goToVendor() {
    window.open(vendorUrl);
  }

  const pageSize = 4;

  const list = useMemo(
    () => state.vendorListData?.list || [],
    [state.vendorListData]
  );
  const totalPages = useMemo(() => Math.ceil(list.length / pageSize), [list]);

  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [page, list]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [totalPages, page]);

  return (
    <HomeMainPageElement>
      <ImageCarousel
        adsKey={adsKeys.anime_top_banner}
        threeInOneBanner={!isMobile}
        size="banner_animated"
        is_cover
      />

      {localState.user.id !== "guest" &&
      (localState.anime_watch_history.length > 0 ||
        localState.comic_watch_history.length) ? (
        <article className="anime_continue_watch_history_area">
          <section className="home_Main_container home_Main_new_comic">
            <div className="home_Main_container_title">
              <div className="home_Main_container_title_text">
                <span className="home_Main_container_title_text_span">
                  {t("Home.continue_watch")}
                </span>
              </div>
            </div>
            <ContinueWatchSlideCarousel
              itemsAnime={localState.anime_watch_history ?? []}
              itemsComic={localState.comic_watch_history ?? []}
              continueWatch
            />
          </section>
        </article>
      ) : (
        ""
      )}

      <article className="comic_area">
        <section className="home_Main_container home_Main_new_comic">
          <div className="home_Main_container_title_wrapper g-flex-space-between">
            <div className="home_Main_container_title cursor">
              <div
                className="home_Main_container_title_text"
                onClick={() => toggleContent(true, false)}
              >
                <span className="home_Main_container_title_text_span c-comic">
                  {t("Home.added_this_week")}
                  <span className="home_Main_container_title_text_span_marked c-comic">
                    {t("Global.comics")}
                  </span>
                </span>
              </div>

              <div
                className="home_Main_container_title_text"
                onClick={() => toggleContent(false, true)}
              >
                <span className="home_Main_container_title_text_span c-video inactive">
                  {t("Home.added_this_week")}
                  <span className="home_Main_container_title_text_span_marked c-video inactive">
                    {t("Global.animate")}
                  </span>
                </span>
              </div>
            </div>

            {showComic && (
              <p
                className="home_Main_container_subtitle"
                onClick={() => toDetailPage("all_comic_list")}
              >
                {t("Common.see_all")}&gt;
              </p>
            )}

            {showVideo && (
              <p
                className="home_Main_container_subtitle"
                onClick={() => toDetailPage("all_anime_list")}
              >
                {t("Common.see_all")}&gt;
              </p>
            )}
          </div>
          {showComic && <SlideCarousel items={localState.weekComicList} />}
          {showVideo && (
            <SlideCarousel items={localState.week_anime_list} type="animated" />
          )}
        </section>

        <section className="home_Main_container home_Main_rank_comic">
          <div className="home_Main_container_title g-flex-space-between">
            <div>
              <div className="g-flex items-center gap-2 lg:gap-3">
                <span className="home_Main_container_title_text_span">
                  {t("Home.ranking.comic")}
                </span>
                <div
                  className="btn-daily-ranking cursor"
                  onClick={() => getLeaderBoardData(1, 1)}
                >
                  <span className="text-white">日排行榜</span>
                </div>
                <div
                  className="btn-weekly-ranking cursor"
                  onClick={() => getLeaderBoardData(1, 2)}
                >
                  <span className="text-white">周排行榜</span>
                </div>
                <div
                  className="btn-monthly-ranking cursor"
                  onClick={() => getLeaderBoardData(1, 4)}
                >
                  <span className="text-white">月排行榜</span>
                </div>
              </div>
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("comic_ranking")}
            >
              {t("Common.see_all")}&gt;
            </p>
          </div>

          <div
            className={`g-flex-start overflow-auto h-100 ${
              isMobile && "w-100 g-overflow-auto"
            } gap-3`}
          >
            <ComicRankingItem list={state.homeLeaderBoard.comic} />
          </div>
        </section>
      </article>

      <article className="anime_area">
        <section className="home_Main_container home_Main_rank_anime">
          <div className="home_Main_container_title g-flex-space-between">
            <div>
              <div className="g-flex items-center gap-2 lg:gap-3">
                <span className="home_Main_container_title_text_span">
                  {t("Home.ranking.anime")}
                </span>
                <div
                  className="btn-daily-ranking cursor"
                  onClick={() => getLeaderBoardData(0, 1)}
                >
                  <span className="text-white">日排行榜</span>
                </div>
                <div
                  className="btn-weekly-ranking cursor"
                  onClick={() => getLeaderBoardData(0, 2)}
                >
                  <span className="text-white">周排行榜</span>
                </div>
                <div
                  className="btn-monthly-ranking cursor"
                  onClick={() => getLeaderBoardData(0, 4)}
                >
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
              list={state.homeLeaderBoard.anime}
              type="animated"
              rankStyle
            />
          </div>
        </section>
      </article>

      <article className="anime_area">
        <section className="home_Main_container home_Main_feature_game">
          <div className="home_Main_container_title g-flex-space-between ">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span">
                {t("Game.label.featured_game")}
              </span>
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("feature_game")}
            >
              {t("Common.see_all")}&gt;
            </p>
          </div>
          <SlideCarousel items={localState.game_list} type="game" />
        </section>

        <section className="home_Main_container home_Main_video">
          <div className="home_Main_container_title g-flex-space-between">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span mr-2">
                {t("Global.video")}
              </span>
              {!isMobile && videoTabValue && (
                <StyledTabs
                  value={videoTabValue}
                  onChange={handleVideoIndexChange}
                  aria-label="lab API tabs example"
                >
                  {localState.video_category_list.reverse().map((category) => {
                    if (localState.video_list[category.id].length) {
                      return (
                        <AntTab
                          label={category.title}
                          value={category.id}
                          key={category.id}
                        />
                      );
                    }
                  })}
                </StyledTabs>
              )}
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("video")}
            >
              {t("Common.see_all")}&gt;
            </p>
          </div>
          {isMobile && videoTabValue && (
            <StyledTabs
              value={videoTabValue}
              onChange={handleVideoIndexChange}
              aria-label="lab API tabs example"
            >
              {[...localState.video_category_list].reverse().map((category) => {
                if (localState.video_list[category.id].length) {
                  return (
                    <AntTab
                      label={category.title}
                      value={category.id}
                      key={category.id}
                    />
                  );
                }
              })}
            </StyledTabs>
          )}

          {localState.video_category_list.map((category) => {
            return (
              <TabPanel
                value={videoTabValue}
                index={category.id}
                key={category.id}
              >
                <SlideCarousel
                  items={localState.video_list[category.id]}
                  type="video"
                />
              </TabPanel>
            );
          })}
        </section>

        <section className="home_Main_container home_Main_feature_photo">
          <div className="home_Main_container_title g-flex-space-between">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span mr-2">
                {t("Navbar.top_navigator_meitu")}
              </span>
              {!isMobile && photoTabValue && (
                <StyledTabs
                  value={photoTabValue}
                  onChange={handlePhotoIndexChange}
                  aria-label="lab API tabs example"
                >
                  {[...localState.photo_category_list]
                    .reverse()
                    .map((category) => {
                      if (localState.photo_list[category.id].length) {
                        return (
                          <AntTab
                            label={category.title}
                            value={category.id}
                            key={category.id}
                          />
                        );
                      }
                    })}
                </StyledTabs>
              )}
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("photo")}
            >
              {t("Common.see_all")}&gt;
            </p>
          </div>
          {isMobile && photoTabValue && (
            <StyledTabs
              value={photoTabValue}
              onChange={handlePhotoIndexChange}
              aria-label="lab API tabs example"
            >
              {[...localState.photo_category_list].reverse().map((category) => {
                if (localState.photo_list[category.id].length) {
                  return (
                    <AntTab
                      label={category.title}
                      value={category.id}
                      key={category.id}
                    />
                  );
                }
              })}
            </StyledTabs>
          )}
          {localState.photo_category_list.map((category) => {
            return (
              <TabPanel
                value={photoTabValue}
                index={category.id}
                key={category.id}
              >
                <SlideCarousel
                  items={localState.photo_list[category.id]}
                  type="photo"
                />
              </TabPanel>
            );
          })}
        </section>

        <section
          className={`home_Main_container home_Main_novel ${
            isMobile ? " g-flex-column-start column-reverse" : "g-start"
          }  gap-3`}
        >
          <div className={`${isMobile ? " w-100" : "f-60"}`}>
            <div className="home_Main_container_title g-flex-space-between">
              <div className="home_Main_container_title_text">
                <span className="home_Main_container_title_text_span mr-2">
                  {t("Navbar.top_navigator_novel")}
                </span>
                {!isMobile && novelTabValue && (
                  <StyledTabs
                    value={novelTabValue}
                    onChange={handleNovelIndexChange}
                    aria-label="lab API tabs example"
                  >
                    {[...state.homeNovelsList].map((category) => {
                      if (state.homeNovelsList.length) {
                        return (
                          <AntTab
                            label={category.title}
                            value={category.id}
                            key={category.id}
                          />
                        );
                      }
                    })}
                  </StyledTabs>
                )}
              </div>
              <p
                className="home_Main_container_subtitle"
                onClick={() => toDetailPage("novel_list")}
              >
                {t("Common.see_all")}&gt;
              </p>
            </div>

            {isMobile && novelTabValue && (
              <StyledTabs
                value={novelTabValue}
                onChange={handleNovelIndexChange}
                aria-label="lab API tabs example"
              >
                {[...state.homeNovelsList].map((category) => {
                  if (state.homeNovelsList.length) {
                    return (
                      <AntTab
                        label={category.title}
                        value={category.id}
                        key={category.id}
                      />
                    );
                  }
                })}
              </StyledTabs>
            )}

            {state.homeNovelsList.map((category) => {
              return (
                <TabPanel
                  value={novelTabValue}
                  index={category.id}
                  key={category.id}
                >
                  <SlideCarousel
                    items={
                      state.homeNovelsListData[category.id]?.list
                        ? state.homeNovelsListData[category.id].list.slice(
                            0,
                            20
                          )
                        : []
                    }
                    type="photo"
                  />
                </TabPanel>
              );
            })}

            {/* <SlideCarousel items={localState.novel_list} type="novel" /> */}
          </div>
        </section>

        {/* 商城 */}
        <section
          className={`home_Main_container home_Main_vendor ${
            isMobile ? " g-flex-column-start column-reverse" : ""
          }  gap-3`}
        >
          <div className={`${isMobile ? " w-100" : "f-60"}`}>
            <div
              className={`home_Main_container_title ${
                isMobile ? "mb-[1.87vw]" : ""
              }`}
            >
              <div className="home_Main_container_title_text">
                <span className="home_Main_container_title_text_span">
                  {t("Navbar.bottom_navigator_mall")}
                </span>
              </div>
              <p
                className="home_Main_container_subtitle"
                onClick={() => toDetailPage("shop")}
              >
                {t("Common.see_all")}&gt;
              </p>
            </div>
            <SlideCarousel items={list} type="vendor" />
          </div>
        </section>
      </article>
    </HomeMainPageElement>
  );
}

const styles = {
  indexMainCont: {
    width: "100%",
    padding: "0 10%",
    boxSizing: "border-box",
  },
  popularMainCont: {
    display: "flex",
  },
  popularCont: {
    width: "60%",
    backgroundColor: "#999",
    minHeight: "750px",
    margin: 0,
  },
  rankCont: {
    display: "flex",
    backgroundColor: "#eee",
    width: "40%",
    minHeight: "750px",
    margin: 0,
  },
};

export const HomeMainPageElement = styled.div`
  /*  */
  // padding-top: 114px;
  position: relative;
  overflow: hidden;
  // background: #f3f4f5;
  display: flex;
  flex-direction: column;
  article {
    background: #fff;
  }
  .home_Main {
    &_container {
      padding: 1em 0.5em;
      padding-right: 12%;
      padding-left: 12%;
      @media (max-width: 1024px) {
        padding-right: 2.67vw;
        padding-left: 2.67vw;
      }
      @media (max-width: 767px) {
        padding: 0.5em;
      }
      @media (min-width: 768px) and (max-width: 1023px) {
        padding: 2em 0.5em 0.5em;
      }

      &:last-child {
        margin-bottom: none;
        border-bottom: none;
      }

      &_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        @media (max-width: 899px) {
          // margin-bottom: 0px;
        }

        &_wrapper {
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
            margin-left: 5px;
            vertical-align: middle;
            font-size: 20px;
            font-weight: 600;
            @media (max-width: 899px) {
              font-size: max(0.94rem, 3.47vw);
            }
            &_marked {
              color: ${colors.back_dark_pink};
            }
          }
        }

        .inactive {
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

      &_refresh {
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
    }
  }

  .home_Main_new_comic .img_btn_wrapper img {
    top: 5.625rem;

    @media (min-width: 1920px) {
      top: 8.625rem !important;
    }

    @media (min-width: 2540px) {
      top: 12.625rem !important;
    }
  }

  .home_Main_new_comic .box-left,
  .home_Main_new_comic .box-right {
    @media (min-width: 1920px) {
      transform: translate(0, 4.875rem);
    }

    @media (min-width: 2540px) {
      transform: translate(0, 8.875rem);
    }
  }

  .home_Main_rank_anime {
    padding-top: 3.125rem;
  }

  .home_Main_novel .item .item_body div {
    padding-bottom: 100% !important;
  }

  .home_Main_rank_comic .total_view {
    top: 40%;
    bottom: 0;
    justify-content: start;

    @media (min-width: 2540px) {
      top: 56%;
    }
  }

  .home_Main_rank_anime .total_view {
    top: 90%;
    bottom: 0;
    justify-content: start;
  }

  .home_Main_novel .total_view {
    top: 90%;
    bottom: 0;
  }

  .btn-daily-ranking {
    background: linear-gradient(to right, #335fc2, #873fdb);
    width: 90px;
    height: 30px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 898px) {
      width: 14.32vw;
      height: 4.56vw;
      border-radius: 2.29vw;
      font-size: 2.34vw;
    }
  }

  .btn-weekly-ranking {
    background: linear-gradient(to right, #c92379, #74478c);
    width: 90px;
    height: 30px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 898px) {
      width: 14.32vw;
      height: 4.56vw;
      border-radius: 2.29vw;
      font-size: 2.34vw;
    }
  }

  .btn-monthly-ranking {
    background: linear-gradient(to right, #1494e2, #23ddc3);
    width: 90px;
    height: 30px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 898px) {
      width: 14.32vw;
      height: 4.56vw;
      border-radius: 2.29vw;
      font-size: 2.34vw;
    }
  }

  .pc_friendly_url {
    text-align: center;
    padding: 0 10em;

    &_title {
      font-size: 1.6rem;
      font-weight: 600;
      padding: 1em 0;
    }

    &_container {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      white-space: nowrap;
    }

    &_icon {
      margin-right: 0.5em;
      width: 50px;
      height: 50px;
      border-radius: 5px;
    }

    &_text {
      font-size: 1.2rem;
      font-weight: 600;
    }
  }
  .MuiTab-root {
    padding: 5px;
    font-size: 12px;
    min-height: 30px;
  }
  .MuiTabs-root {
    min-height: 30px;
  }
`;
