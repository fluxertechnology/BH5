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


import {
  refreshAnimeData,
} from "@/store/actions/pages/homeMainAction";

const { home } = pageUrlConstants;

export default function HomeMainPage() {
  const t = useTranslations();

  const { state } = useGlobalContext();

  const [videoTabValue, setVideoTabValue] = useState();
  const [photoTabValue, setPhotoTabValue] = useState();
  const { isMobile } = useMediaQuery();

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

  useEffect(() => {
    if (!localState.video_category_list.length)
      useGlobalDispatch(getHomeData());
    useGlobalDispatch(getContinueWatchData());
  }, [isMobile]);

  const handleVideoIndexChange = (event, newValue) => {
    setVideoTabValue(newValue);
  };

  const handlePhotoIndexChange = (event, newValue) => {
    setPhotoTabValue(newValue);
  };

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
  }, [
    localState.video_category_list.length,
    localState.photo_category_list.length,
  ]);

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
          tab: t("Global.comics"),
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
        url = home.pages.homeMain.pages.homePhotos.path;
        break;
      case "novel_list":
        url = home.pages.homeMain.pages.homeNovels.path;
        break;
      // case "recommend_original":
      //   url = home.pages.homeLeaderboard;
      //   break;
      //   ;
      default:
        break;
    }
    useGlobalDispatch(pushRoutes({ path: url, dynamic: category }));
  };

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
                <Image
                  className="home_Main_container_title_text_img"
                  src="/images/home/new.svg"
                  width={0}
                  height={0}
                  alt={t("Home.continue_watch")}
                />
                <span className="home_Main_container_title_text_span">
                  {t("Home.continue_watch")}
                </span>
              </div>
            </div>
            <ContinueWatchSlideCarousel
              itemsAnime={localState.anime_watch_history}
              itemsComic={localState.comic_watch_history}
              continueWatch
            />
          </section>
        </article>
      ) : (
        ""
      )}

      <article className="comic_area">
        <section className="home_Main_container home_Main_new_comic">
          <div className="home_Main_container_title">
            <div className="home_Main_container_title_text">
              <Image
                className="home_Main_container_title_text_img"
                src="/images/home/new.svg"
                width={0}
                height={0}
                alt={t("Home.added_this_week_comic")}
              />
              <span className="home_Main_container_title_text_span">
                {t("Home.added_this_week")}
                <span className="home_Main_container_title_text_span_marked">
                  {t("Global.comics")}
                </span>
              </span>
            </div>
          </div>
          <SlideCarousel items={localState.weekComicList} />
        </section>

        <section
          className={`home_Main_container home_Main_hot_comic ${isMobile ? " g-flex-column-start " : "g-start"
            }  gap-3`}
        >
          <section className={`${isMobile ? "w-100" : "f-60"}`}>
            <div className="home_Main_container_title">
              <div className="home_Main_container_title_text">
                <Image
                  className="home_Main_container_title_text_img"
                  src="/images/home/manga.svg"
                  width={0}
                  height={0}
                  alt={t("Home.popular_comic")}
                />
                <span className="home_Main_container_title_text_span">
                  {t("Home.popular_comic")}
                </span>
              </div>
              <div
                className="home_Main_container_refresh"
                onClick={() => {
                  refreshData("hot_comic_list");
                }}
              >
                <RefreshBtn />
              </div>
            </div>
            <ShowItem list={localState.hot_comic_list} />
          </section>

          <section
            className={`home_main_container_ranking g-flex-column-start ${isMobile ? "w-100" : "f-35"
              } `}
          >
            <span className="home_Main_container_ranking_top g-flex-space-between  w-100 align-items-center px-3 py-1 ">
              <p className="home_Main_container_ranking_top_title fw-m">
                {t("Home.ranking.comic")}
              </p>
              <p
                className="home_Main_container_subtitle"
                onClick={() => toDetailPage("comic_ranking")}
              >
                {t("Global.see_all")}&gt;
              </p>
            </span>
            <span
              className={`g-flex-column-space-around h-100 ${isMobile && "w-100 g-overflow-auto"
                } gap-2`}
            >
              <ComicRankingItem list={localState.rank_comic_list} />
            </span>
          </section>
        </section>

        <section className="home_Main_container home_Main_all_comic">
          <div className="home_Main_container_title g-flex-space-between">
            <div className="home_Main_container_title_text">
              <Image
                className="home_Main_container_title_text_img"
                src="/images/home/list.svg"
                width={0}
                height={0}
                alt={t("Home.all_comic")}
              />
              <span className="home_Main_container_title_text_span">
                {t("Home.all_comic")}
              </span>
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("all_comic_list")}
            >
              {t("Global.see_all")}&gt;
            </p>
          </div>

          <SlideCarousel items={localState.all_comic_list} />
        </section>
      </article>

      <article className="anime_area">
        <section className="home_Main_container home_Main_new_anime">
          <div className="home_Main_container_title">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span">
                {t("Home.added_this_week")}
                <span className="home_Main_container_title_text_span_marked">
                  {t("Global.animate")}
                </span>
              </span>
            </div>
          </div>
          <SlideCarousel items={localState.week_anime_list} type="animated" />
        </section>

        <section className="home_Main_container home_Main_rank_anime">
          <div className="home_Main_container_title g-flex-space-between">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span">
                {t("Home.ranking.anime")}
              </span>
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("anime_ranking")}
            >
              {t('Common.see_all')}
            </p>
          </div>
          <SlideCarousel items={localState.rank_anime_list} type="animated" rankStyle />
        </section>

        <section className="home_Main_container home_Main_hot_anime">
          <div className="home_Main_container_title">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span">
                {t('Home.popular_animate')}
              </span>
            </div>
            <div
              className="home_Main_container_refresh"
              onClick={() => {
                refreshData("hot_anime_list");
              }}
            >
              <RefreshBtn />
            </div>
          </div>
          <ShowItem list={localState.hot_anime_list} type="animated" />
        </section>

        <section className="home_Main_container home_Main_all_anime">
          <div className="home_Main_container_title g-flex-space-between">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span">
                {t('Home.added_this_week_anime')}
              </span>
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("all_anime_list")}
            >
              {t('Common.see_all')}
            </p>
          </div>
          <SlideCarousel items={localState.all_anime_list} type="animated" />
        </section>
      </article>

      <article className="anime_area">
        <section className="home_Main_container home_Main_feature_game">
          <div className="home_Main_container_title g-flex-space-between ">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span">
                {t('Game.label.featured_game')}
              </span>
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("feature_game")}
            >
              {t('Common.see_all')}
            </p>
          </div>
          <SlideCarousel items={localState.game_list} type="game" />
        </section>

        <section className="home_Main_container home_Main_video">
          <div className="home_Main_container_title g-flex-space-between">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span mr-2">
                {t('Global.video')}
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
              {t('Common.see_all')}
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

        </section>

        <section className="home_Main_container home_Main_feature_photo">
          <div className="home_Main_container_title g-flex-space-between">
            <div className="home_Main_container_title_text">
              <span className="home_Main_container_title_text_span mr-2">
                {t('Navbar.top_navigator_meitu')}
              </span>
              {!isMobile && photoTabValue && (
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
            </div>
            <p
              className="home_Main_container_subtitle"
              onClick={() => toDetailPage("photo")}
            >
              {t('Common.see_all')}
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
                <SlideCarousel items={localState.photo_list[category.id]} type="photo" />
              </TabPanel>
            );
          })}
        </section>

        <section
          className={`home_Main_container home_Main_novel ${isMobile ? " g-flex-column-start column-reverse" : "g-start"
            }  gap-3`}
        >
          <section className={`${isMobile ? " w-100" : "f-60"}`}>
            <div className="home_Main_container_title">
              <div className="home_Main_container_title_text">
                <span className="home_Main_container_title_text_span">
                  {t('Navbar.top_navigator_novel')}
                </span>
              </div>
              <p
                className="home_Main_container_subtitle"
                onClick={() => toDetailPage("novel_list")}
              >
                {t('Common.see_all')}
              </p>
            </div>
            <ShowItem list={localState.novel_list} type="novel" />
          </section>

          <section
            className={`home_main_container_ranking   ${isMobile ? " w-100" : "f-35"
              }
            } `}
          >
            <OriginalCarousel
              items={localState.creation_list}
              postCardScribeMediaEvent={localState.postCardScribeMediaEvent}
              postCardAttentionEvent={localState.postCardAttentionEvent}
            />
          </section>
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
  background: #f3f4f5;
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
        margin-bottom: 10px;
        @media (max-width: 899px) {
          margin-bottom: 0px;
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
              font-size: 14px;
            }
            &_marked {
              color: ${colors.back_dark_pink};
            }
          }
        }
      }

      &_subtitle {
        cursor: pointer;
        font-size: 10px;
        @media (min-width: 899px) {
          font-size: 16px;
        }
      }

      &_refresh {
      }

      &_ranking {
        &_top {
          color: #fff;
          border-radius: 5px;
          background-image: linear-gradient(99deg, #86b7f7 49%, #5a65f2);
          margin-bottom: 10px;
          box-sizing: border-box;
          &_title {
            font-size: 14px;
            @media (min-width: 899px) {
              font-size: 20px;
            }
          }
        }
      }
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
