"use client";

import { useTranslations } from "next-intl";
import { requestUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useEffect, useState } from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  getHomeData,
  getContinueWatchData,
} from "@/store/actions/pages/homeMainAction";

import IndexSwiper from "@/components/index/IndexSwiper";
import ComicSlider from "@/components/index/ComicSlider";
import AnimeSlider from "@/components/index/AnimeSlider";

const { getNewAnimeHome, postRefreshAnime, postContinueHistory } =
  requestUrlConstants;

export default function HomePage() {
  const t = useTranslations("Home");

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
      anime_watch_history: state.homeData?.anime_watch_history || [],
      comic_watch_history: state.homeData?.comic_watch_history || [],
      weekComicList: fillDataArray("week_comic_list"),
      hot_comic_list: fillDataArray("hot_comic_list"),
      rank_comic_list: fillDataArray("rank_comic_list"),
      all_comic_list: fillDataArray("all_comic_list"),
      week_anime_list: fillDataArray("week_anime_list"),
      rank_anime_list: fillDataArray("rank_anime_list"),
      hot_anime_list: fillDataArray("hot_anime_list"),
      all_anime_list: fillDataArray("all_anime_list"),
      game_list: fillDataArray("game_list"),
      video_list: state.homeData?.video_list || {},
      video_category_list: state.homeData?.video_category_list || [],
      photo_category_list: state.homeData?.photo_category_list || [],
      photo_list: state.homeData?.photo_list || {},
      novel_list: fillDataArray("novel_list"),
      creation_list: fillDataArray("creation_list"),
    };
  };

  const [localState, setLocalState] = useState(getLocalState());

  useEffect(() => {
    setLocalState(getLocalState());
  }, [state.homeData]);

  useEffect(() => {
    if (!localState.video_category_list.length) useGlobalDispatch(getHomeData());
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
    <div>
      <h1>{t("title")}</h1> {/* Call the hook with the dictionary key */}
      <IndexSwiper />
      <div style={styles.indexMainCont}>
        <div>
          <h2>COMIC SECTION</h2>
          <ComicSlider />
          <div style={styles.popularMainCont}>
            <h1 style={styles.popularCont}>popular comic</h1>
            <h1 style={styles.rankCont}>ranking comic</h1>
          </div>
          <ComicSlider />
        </div>

        <div>
          <h2>ANIME SECTION</h2>
          <AnimeSlider />
          <h2>&nbsp;</h2>
          <AnimeSlider />
        </div>
      </div>{" "}
    </div>
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
