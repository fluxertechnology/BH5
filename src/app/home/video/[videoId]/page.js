"use client";

import { useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import ReactPlayerComponent, {
  PlyrVideoType,
} from "@/components/common/ReactPlayerComponent";
import {
  adsKeys,
  colors,
  side_padding,
  pageUrlConstants,
} from "@/lib/constants";
import ImageCarousel from "@/components/common/ImageCarousel";
import ImageComponent from "@/components/common/ImageComponent";
import HomeVideos from "@/app/home/main/videos/page";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useParams } from "next/navigation";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  addMissionRecordAction,
  pushRoutes,
} from "@/store/actions/historyActions";
import { checkinPageConditioncheckAction } from "@/store/actions/utilities";
import { toggleVideoCollectAction } from "@/store/actions/pages/homeVideoContentAction";
import LinkComponent from "@/components/common/LinkComponent";

const HomeVideoContent = ({}) => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();

  const videoId = useParams().videoId;
  const videoData = useMemo(() => {
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
    // getVideoContent(videoId, ()=>{
    //   getFavorVideo();
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        isShowFooter: false,
      },
    });
  }, []);
  return (
    <HomeVideoContentElement main_height={state.navbar.mainHeight}>
      <TopBarContainer
        not_fixed={true}
        show_shadow={false}
        z_index={8}
        top="unset"
      >
        <TopTitleBar
          showBack={false}
          back_color={"transparent"}
          show_back_color={"#fff"}
        />
      </TopBarContainer>
      <div
        className={`main-container ${!isMobile ? "mx-indent" : "mobile-width"}`}
      >
        <div className="left-section">
          <ReactPlayerComponent
            img={videoData.img}
            src={videoData.url}
            title={videoData.title}
            subTitle="相关影片"
            is_collect={videoData.is_collect}
            collectEvent={() => {
              collectEvent();
            }}
            videoType={PlyrVideoType.video}
            videoId={videoId}
          />
          <div className="w-full carousel-container">
            <ImageCarousel
              adsKey={adsKeys.video_banner}
              threeInOneBanner={!isMobile}
              size="banner_animated"
              is_cover
              customSlidesPerView={isMobile ? 1 : 2}
            />
          </div>
        </div>
        <div className="right-section">
          {state.homeVideoList[state.homeVideo.nowTab]?.videolist
            .slice(0, 9) // 只取前 5 个
            .map((data) => {
              return (
                <LinkComponent
                  className="container_item"
                  routes={{
                    name:
                      pageUrlConstants.home.pages.homeVideoSwitch.pages
                        .homeVideoContent.name + data.title,
                    path: pageUrlConstants.home.pages.homeVideoSwitch.pages
                      .homeVideoContent.path,
                    dynamic: {
                      videoId: data.id,
                    },
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
                      cover={true}
                      is_cover={true}
                    />
                    <div className="info-container">
                      <h5>{data.title}</h5>
                      <p>2025-03-11</p>
                      <p>{data.need_money}</p>
                    </div>
                  </div>
                </LinkComponent>
              );
            })}
        </div>
      </div>
      <HomeVideos hideImageCarousel />
      {/* <div className="recommend px-indent mt-5">
        <Grid container direction="row" alignItems="center" spacing={4}>
          {videoData.recommend
            ? videoData.recommend.map((data) => {
                return (
                  <Grid item md={3} xs={12} key={data.id}>
                    <div
                      className="recommend_item"
                      onClick={() => {
                        toRecommendVideo(data.id, data.title);
                      }}
                    >
                      <div className="recommend_item_cover">
                        <ImageComponent
                          src={data.img}
                          alt={data.title}
                          title={data.title}
                          height={50}
                          cover={true}
                          is_cover={true}
                        />
                        <span className="recommend_item_cover_gold">
                          {data.need_jinbi}{" "}
                          {intl.formatMessage({ id: "GLOBAL.GOLD_MONEY" })}
                        </span>
                      </div>
                      <div className="recommend_item_info">
                        <div className="recommend_item_info_title">
                          <p className="recommend_item_info_title_text my-2">
                            {data.title}
                          </p>
                        </div>
                        <div className="recommend_item_info_description">
                          <p className="recommend_item_info_description_text">
                            {data.biaoqian}
                          </p>
                          <p className="recommend_item_info_description_text view">
                            {data.bfcs >= 1000
                              ? Math.floor(data.bfcs / 100) -
                                10 +
                                intl.formatMessage({
                                  id: "GLOBAL.NUMBER_PLAYS",
                                })
                              : data.bfcs}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Grid>
                );
              })
            : ""}
        </Grid>
      </div> */}
    </HomeVideoContentElement>
  );
};

export default HomeVideoContent;

const HomeVideoContentElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
  /*  */
  padding: ${main_height}px 0;


  .main-container {
    display: flex;
    position: relative;
    gap: 1.46vw;
    margin-top: 1.98vw;
    margin-bottom: 3.55vw;

    .left-section {
      width: 51.3vw;

      .banner-padding{
        width: 100%;
      }
      @media (min-width: 899px) {
        padding-bottom: 1vw;
      }

      .carousel-container{
        @media (min-width: 899px) {
          margin-top: 0.55vw;
        }
      }
    }
    .right-section {
  
      @media (min-width: 899px) {
        width: 23.44vw;
        padding-bottom: 1vw;
        gap: 0.57vw;
        display: flex;
        flex-direction: column;
      }

      .intro-item{
        display: flex;
        height: 5.73vw;
        gap: 16px;
        position: relative;

        .info-container {
            @media (min-width: 899px) {
              flex-shrink: 0;
              width: 13.91vw;
            }
            
        }
      }
    }
  }
  .nav_list {
    display: flex;
    overflow: auto;
    white-space: nowrap;

    &_tag {
      cursor: pointer;
      flex-shrink: 0;
      display: inline-block;
      overflow: hidden;
      margin: 10px;
      color: ${colors.dark_pink};
      border: 1px solid ${colors.dark_pink};
      border-radius: 30px;

      &.active {
        color: #fff;
        background-color: ${colors.dark_pink};
      }

      &_text {
        padding: 5px 10px;
        font-size: 18px;
      }
    }
  }
  .recommend {
    &_item {
      cursor: pointer;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        right: ${side_padding}px;
        bottom: -0.5px;
        left: ${side_padding}px;
        height: 1px;
        background-color: #e1e1e1;
      }

      &:last-of-type {
        &::after {
          content: unset;
        }
      }

      &_cover {
        flex-shrink: 0;
        position: relative;
        width: 100%;

        &_gold {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 12px;
          color: #fff;
        }
      }

      &_info {
        &_title {
          &_text {
            overflow: hidden;
            height: 36px;
            font-size: 18px;
            line-height: 18px;
            letter-spacing: 1px;
            font-weight: 900;
          }
        }

        &_description,
        &_viewtime {
          &_text {
            font-size: 16px;
            letter-spacing: 1px;
            color: ${colors.text_grey};
            font-weight: 700;

            &.view {
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
`}
`;
