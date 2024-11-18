"use client";

import { useTranslations } from "next-intl";
import { adsKeys, colors, requestUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useEffect, useState } from "react";
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

import Image from "next/image";

import mangaIcon from "@public/images/home/manga.svg";
import newIcon from "@public/images/home/new.svg";
import AllIcon from "@public/images/home/list.svg";
import starIcon from "@public/images/home/star.svg";
import gameIcon from "@public/images/home/game.svg";
import picIcon from "@public/images/home/pic.svg";
import videoIcon from "@public/images/home/video.svg";
import novelIcon from "@public/images/home/novel.svg";

const { getNewAnimeHome, postRefreshAnime, postContinueHistory } =
  requestUrlConstants;

export default function HomePage() {
  const t = useTranslations();

  const { state } = useGlobalContext();

  const [videoTabValue, setVideoTabValue] = useState();
  const [photoTabValue, setPhotoTabValue] = useState();
  const { isMobile } = useMediaQuery();

  const getLocalState = () => {
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
  };

  const [localState, setLocalState] = useState(getLocalState());

  useEffect(() => {
    setLocalState(getLocalState());
  }, [state.homeData]);

  useEffect(() => {
    if (!localState.video_category_list.length)
      useGlobalDispatch(getHomeData());
    else useGlobalDispatch(getContinueWatchData());
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
              <p className="home_Main_container_title_text">
                <Image
                  className="home_Main_container_title_text_img"
                  src={newIcon}
                  width={0}
                  height={0}
                  alt={t("Home.continue_watch")}
                />
                <span className="home_Main_container_title_text_span">
                  {intl.formatMessage({ id: "HOME.MAIN.CONTINUE_WATCH" })}
                </span>
              </p>
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
            <p className="home_Main_container_title_text">
              <Image
                className="home_Main_container_title_text_img"
                src={newIcon}
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
            </p>
          </div>
          <SlideCarousel items={localState.weekComicList} />
        </section>

        <section
          className={`home_Main_container home_Main_hot_comic ${
            isMobile ? " g-flex-column-start " : "g-start"
          }  gap-3`}
        >
          <section className={`${isMobile ? "w-100" : "f-60"}`}>
            <div className="home_Main_container_title">
              <p className="home_Main_container_title_text">
                <img
                  className="home_Main_container_title_text_img"
                  src={mangaIcon}
                  alt={t("Home.popular_comic")}
                />
                <span className="home_Main_container_title_text_span">
                  alt={t("Home.popular_comic")}
                </span>
              </p>
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
            className={`home_main_container_ranking g-flex-column-start ${
              isMobile ? "w-100" : "f-35"
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
              className={`g-flex-column-space-around h-100 ${
                isMobile && "w-100 g-overflow-auto"
              } gap-2`}
            >
              <ComicRankingItem list={localState.rank_comic_list} />
            </span>
          </section>
        </section>

        <section className="home_Main_container home_Main_all_comic">
          <div className="home_Main_container_title g-flex-space-between">
            <p className="home_Main_container_title_text">
              <img
                className="home_Main_container_title_text_img"
                src={AllIcon}
                alt={t("Home.all_comic")}
              />
              <span className="home_Main_container_title_text_span">
                {t("Home.all_comic")}
              </span>
            </p>
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
