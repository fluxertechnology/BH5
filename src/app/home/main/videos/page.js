"use client";

import { useEffect, useRef, useCallback } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import WavaButton from "@/components/layout/Header/WavaButton";

import ImageCarousel from "@/components/common/ImageCarousel";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import { adsKeys, colors } from "@/lib/constants";

import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import useMediaQuery from "@/hooks/useMediaQuery";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  getCateVideoData,
  getHomeVideoData,
  setNowTabList,
} from "@/store/actions/pages/homeVideoAction";

const HomeVideosPage = ({ containerRef, hideImageCarousel }) => {
  const { isMobile } = useMediaQuery();
  const { state } = useGlobalContext();

  const videoTabListRef = useRef(null);
  const getVideo = useCallback(() => {
    getVideoData();
  }, []);

  useEffect(() => {
    if (Object.keys(state.homeVideoList).length <= 1) {
      getVideo();
    }
  }, []);
  useEffect(() => {
    let tabBar = videoTabListRef.current;
    tabBar.addEventListener("wheel", videoWheelEvent);
    window.addEventListener("scroll", scrollEvent);
    if (
      (state.homeVideo.nowTab,
      state.homeVideoList,
      !state.homeVideoList[state.homeVideo.nowTab]?.page)
    ) {
      updateCateVideoData(state.homeVideo.nowTab, () => {});
    }
    return () => {
      tabBar.removeEventListener("wheel", videoWheelEvent);
      window.removeEventListener("scroll", scrollEvent);
    };
  }, [state.homeVideo.nowTab]);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      updateCateVideoData(state.homeVideo.nowTab, scrollColdEnd);
    });
  }

  function videoWheelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    videoTabListRef.current.scrollLeft += e.deltaY;
  }

  const getVideoData = () => {
    useGlobalDispatch(getHomeVideoData());
  };
  const clickTabEvent = (cateid) => {
    useGlobalDispatch(setNowTabList(cateid));
  };
  const updateCateVideoData = (cateid, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getCateVideoData(cateid, scrollColdEnd));
  };
  return (
    <HomeVideosPageElement>
      {!hideImageCarousel && (
        <ImageCarousel
          adsKey={adsKeys.home}
          threeInOneBanner={!isMobile}
          is_cover
          size="banner_main"
        />
      )}
      <div
        ref={videoTabListRef}
        className={`nav_list ${!isMobile && "mx-indent"}`}
        onWheel={videoWheelEvent}
      >
        {Object.keys(state.homeVideoList).map((key, i) => {
          return (
            <div
              className={
                "nav_list_tag " +
                (state.homeVideo.nowTab === state.homeVideoList[key].cateid
                  ? "active"
                  : "")
              }
              style={{
                order: state.homeVideoList[key].sort,
              }}
              key={state.homeVideoList[key].cateid + "_" + i}
              onClick={() => {
                clickTabEvent(state.homeVideoList[key].cateid);
              }}
            >
              <WavaButton currentRefs={containerRef ? [containerRef] : []}>
                <p className="nav_list_tag_text">
                  {state.homeVideoList[key].title}
                </p>
              </WavaButton>
            </div>
          );
        })}
      </div>
      <div className={`video_content ${!isMobile && " px-indent"} mt-2 `}>
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={isMobile ? 1 : 4}
        >
          {state.homeVideoList[state.homeVideo.nowTab]?.videolist
            .filter((key, index) => {
              return (
                !state.homeVideoList[state.homeVideo.nowTab].isNew ||
                index < state.homeVideoList[state.homeVideo.nowTab].page * 30
              );
            })
            .sort((a, b) => b.id - a.id)
            .map((data) => {
              return (
                <Grid item md={3} xs={6} key={data.title + "_" + data.id}>
                  <CoverCubeItem
                    data={data}
                    user={state.user}
                    type="video"
                    total_view_show
                  />
                </Grid>
              );
            })}
          <ScrollToTop />
        </Grid>
      </div>
    </HomeVideosPageElement>
  );
};

export default HomeVideosPage;

export const HomeVideosPageElement = styled.div`
  /*  */
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

  .video_content {
    display: flex;
    flex-wrap: wrap;
  }
`;
