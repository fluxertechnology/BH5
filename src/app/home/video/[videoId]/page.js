"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ImageComponent from "@/components/common/ImageComponent";
import LinkComponent from "@/components/common/LinkComponent";
import ReactPlayerComponent, {
  PlyrVideoType,
} from "@/components/common/ReactPlayerComponent";
import HomeVideos from "@/app/home/main/videos/page";
import { adsKeys, pageUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  addMissionRecordAction,
  pushRoutes,
} from "@/store/actions/historyActions";
import { checkinPageConditioncheckAction } from "@/store/actions/utilities";
import { toggleVideoCollectAction } from "@/store/actions/pages/homeVideoContentAction";
import VideoContentLayout from "@/components/common/VideoContentLayout";
import Image from "next/image";
import { getPrice } from "@/lib/services/price";

const HomeVideoContent = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const videoId = useParams().videoId;

  const videoData = useMemo(() => {
    console.log(state.homeVideoList,'state.homeVideoList');
    return state.homeVideoContent[videoId]
      ? { ...state.homeVideoContent[videoId] }
      : {
          ...state.homeVideoList[state.homeVideo.nowTab]?.videolist.filter(
            (data) => data.id == videoId
          )[0],
        };
  }, [state.homeVideoContent, state.homeVideoList]);

  useEffect(() => {
    if (videoId) {
      checkUser({
        id: videoId,
      });
    }
  }, [videoId, state.user.id]);

  useEffect(() => {
    if (videoData.url) {
      addMissionRecord(5);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoData.url]);

  const getVideoData = () => {
    useGlobalDispatch(getHomeVideoData());
  };

  const getVideo = useCallback(() => {
    getVideoData();
  }, []);

  function collectEvent() {
    toggleVideoCollect({
      video_id: videoId,
      type: 0,
      status: videoData.is_collect ? 0 : 1,
      vod_name: videoData.title,
      vod_pic: videoData.img,
      vod_url: videoData.url,
    });
  }

  const toRecommendVideo = (id, title) => {
    useGlobalDispatch(
      pushRoutes({
        name: home.pages.homeMain.pages.homeVideoContent.name + title,
        path: home.pages.homeMain.pages.homeVideoContent.path,
        dynamic: {
          videoId: id,
        },
      })
    );
  };

  const toggleVideoCollect = (data) => {
    useGlobalDispatch(toggleVideoCollectAction(data));
  };

  const checkUser = (data) => {
    useGlobalDispatch(
      checkinPageConditioncheckAction({
        itemId: data.id,
        itemType: 4,
        checkOnPage: true,
      })
    );
  };

  const addMissionRecord = (mission_id) => {
    useGlobalDispatch(addMissionRecordAction(mission_id));
  };

  return (
    <VideoContentLayout
      hideBack
      adsKey={adsKeys.video_banner}
      playerComponent={
        <ReactPlayerComponent
          img={videoData.img}
          src={videoData.url}
          title={videoData.title}
          subTitle="相关影片"
          is_collect={videoData.is_collect}
          collectEvent={collectEvent}
          videoType={PlyrVideoType.video}
          videoId={videoId}
        />
      }
      rightSectionContent={state.homeVideoList[
        state.homeVideo.nowTab
      ]?.videolist
        .slice(0, 9)
        .map((data) => (
          <LinkComponent
            className="container_item"
            routes={{
              name:
                pageUrlConstants.home.pages.homeVideoSwitch.pages
                  .homeVideoContent.name + data.title,
              path: pageUrlConstants.home.pages.homeVideoSwitch.pages
                .homeVideoContent.path,
              dynamic: { videoId: data.id },
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
                  <h5>{data.title}</h5>
                  <p>2025-03-11</p>
                </div>
                <div className="flex items-center relative">
                  <Image
                    src="/images/icons/diamond.png"
                    width={192}
                    height={192}
                    alt="diamond icon"
                    className="diamon_icon"
                  />
                  <p>{getPrice(t,data)}</p>
                </div>
              </div>
            </div>
          </LinkComponent>
        ))}
      recommendContent={<HomeVideos hideImageCarousel />}
    />
  );
};

export default HomeVideoContent;
