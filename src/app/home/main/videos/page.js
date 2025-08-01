"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

  const type = [
    {
      id: 1,
      name: "视频",
    },
  ];

  const paidType = [
    {
      id: 1,
      name: "全部",
    },
    {
      id: 2,
      name: "免费",
    },
    {
      id: 3,
      name: "付费",
    },
  ];

  const [currentTypeId, setCurrentTypeId] = useState(type[0].id);
  const [currentPaidId, setCurrentPaidId] = useState(paidType[0].id);

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
      console.log(state.homeVideoList);
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
          size="banner_animated"
        />
      )}
      <div className="nav_container">
        <div className={`nav_list ${!isMobile ? "mx-indent" : "mobile-width"}`}>
          {type.map((item) => (
            <div
              key={item.id}
              className={`nav_list_tag ${
                currentTypeId === item.id ? "active" : ""
              }`}
              onClick={() => setCurrentTypeId(item.id)}
            >
              <WavaButton>
                <p className="nav_list_tag_text">{item.name}</p>
              </WavaButton>
            </div>
          ))}
        </div>
        <div
          ref={videoTabListRef}
          className={`nav_list ${
            !isMobile ? "mx-indent" : "mobile-width"
          } nav_cateogry`}
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
        <div className="show-less-btn">&lt;显示较少&gt;</div>
        <div className={`nav_list ${!isMobile ? "mx-indent" : "mobile-width"}`}>
          {paidType.map((item, index) => (
            <div
              key={item.id}
              className={`nav_list_tag ${
                currentPaidId === item.id ? "active" : ""
              }`}
              onClick={() => setCurrentPaidId(item.id)}
            >
              <WavaButton>
                <p className="nav_list_tag_text">{item.name}</p>
              </WavaButton>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`video_content ${
          !isMobile ? "px-indent" : "mobile-width"
        } mt-2 `}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={isMobile ? 1 : 2}
          rowSpacing={isMobile ? 5.7 : 5.2}
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
                <Grid item md={2.4} xs={6} key={data.title + "_" + data.id}>
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
  .nav_container {
    @media (min-width: 899px) {
      margin-top: 2.05vw;
      margin-bottom: 2.85vw;
    }

    margin-top: 5.75vw;
    margin-bottom: 6.95vw;

    .nav_list {
      display: flex;
      flex-wrap: wrap;
      white-space: nowrap;
      margin-bottom: 2.53vw;
      @media (min-width: 899px) {
        margin-bottom: 0.53vw;
      }

      &_tag {
        cursor: pointer;
        flex-shrink: 0;
        display: inline-block;
        overflow: hidden;
        color: #333333;
        // border: 1px solid ${colors.dark_pink};
        border-radius: 5px;
        background-color: #f3f3f3;
        text-align: center;
        margin: 0.65vw 0.7vw;
        width: 14.67vw;
        height: 5.33vw;

        @media (min-width: 899px) {
          width: auto;
          min-width: 4.69vw;
          height: auto;
          margin: 7px;
        }

        &.active {
          color: #fff !important;
          background-color: ${colors.clasic_pink};
        }

        &_text {
          padding: 5px 10px;
          font-size: 3.2vw;
          font-family: "Microsoft YaHei";
          text-align: center;

          @media (min-width: 899px) {
            font-size: 16px;
          }
        }
      }
    }

    .nav_cateogry {
      padding-bottom: 2.3vw;
      border-bottom: 1px solid #f3f3f3;

      @media (min-width: 899px) {
        padding-bottom: 1vw;
      }
    }

    .show-less-btn {
      font-family: "Microsoft YaHei";
      color: rgb(51, 51, 51);
      font-size: 2.4vw;
      line-height: 1.222;
      text-align: center;
      padding-top: 0.5vw;
      padding-bottom: 4.2vw;

      @media (min-width: 899px) {
        line-height: 1.571;
        padding-top: 0.2vw;
        padding-bottom: 1.2vw;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .video_content {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10.4vw !important;

    @media (min-width: 899px) {
      margin-bottom: 5vw;
    }
  }

  .mobile-width {
    width: 94.67vw;
    margin: auto;
  }
`;
