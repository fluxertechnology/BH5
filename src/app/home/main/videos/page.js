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
import { useTranslations } from "next-intl";

const HomeVideosPage = ({ containerRef, hideImageCarousel }) => {
  const { isMobile, isTablet } = useMediaQuery();
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

  const [tabHeight, setTabHeight] = useState(0);
  const [tabHeightState, setTabHeightState] = useState(false);
  const tabRef = useRef(null);
  const t = useTranslations();

  const videoTabListRef = useRef(null);
  const showBtnRef = useRef(null);
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
      updateCateVideoData(state.homeVideo.nowTab, () => { });
    }
    return () => {
      tabBar.removeEventListener("wheel", videoWheelEvent);
      window.removeEventListener("scroll", scrollEvent);
    };
  }, [state.homeVideo.nowTab]);

  const [is750, setIs750] = useState(false);

  useEffect(() => {

    const updateIs750 = () => {
      const width = window.innerWidth;
      setIs750(width > 749);
    };

    window.addEventListener("resize", updateIs750);
    updateIs750();

    return () => {
      window.removeEventListener("resize", updateIs750);
    };
  }, []);

  useEffect(() => {
    getTabHeight();

  }, [is750, isMobile, tabHeight]);

  const toggleTabHeight = useCallback(() => {
    if (!videoTabListRef) return;
    if (videoTabListRef.current.offsetHeight === tabHeight) {
      if (isMobile) {
        videoTabListRef.current.style.height = is750 ? "98px" : "14vw";
      } else {
        videoTabListRef.current.style.height = isTablet ? "108px" : "98px";
      }
      setTabHeightState(false);
    } else {
      videoTabListRef.current.style.height = tabHeight + "px";
      setTabHeightState(true);
    }

  }, [is750, isMobile, tabHeight, videoTabListRef]);

  const getTabHeight = useCallback(() => {
    if (!videoTabListRef) return;

    videoTabListRef.current.style.height = "unset";
    setTabHeight(videoTabListRef.current.offsetHeight);
    if (isMobile) {
      videoTabListRef.current.style.height = is750 ? "98px" : "14vw";
    } else {
      videoTabListRef.current.style.height = isTablet ? "108px" : "98px";
    }

    if(videoTabListRef.current.offsetHeight >= tabHeight){
      videoTabListRef.current.style.height = tabHeight + "px";
      showBtnRef.current.style.display = "none";
    }else {
      showBtnRef.current.style.display = "block";
    }
    
  }, [is750, isMobile, tabHeight, videoTabListRef, showBtnRef]);

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
  const updateCateVideoData = (cateid, scrollColdEnd = () => { }) => {
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
      <div className={`nav_container ${hideImageCarousel ? "hidden" : ""}`}>
        <div className={`nav_list ${!isMobile ? "mx-indent" : "mobile-width"}`}>
          {type.map((item) => (
            <div
              key={item.id}
              className={`nav_list_tag ${currentTypeId === item.id ? "active" : ""
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
          className={`nav_list ${!isMobile ? "mx-indent" : "mobile-width"
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
        <div
          className="show-less-btn cursor"
          onClick={toggleTabHeight}
          ref={showBtnRef}
        >
          <WavaButton className="category_container_content_btn_button">
            &lt;&nbsp;&nbsp;&nbsp;
            {tabHeightState ? t("Global.show_less") : t("Global.show_more")}
            &nbsp;&nbsp;&nbsp;&gt;
          </WavaButton>
        </div>
        <div className={`nav_list ${!isMobile ? "mx-indent" : "mobile-width"}`}>
          {paidType.map((item, index) => (
            <div
              key={item.id}
              className={`nav_list_tag ${currentPaidId === item.id ? "active" : ""
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
        className={`video_content ${!isMobile ? "px-indent" : "mobile-width"
          } mt-2 `}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={isMobile ? 1 : 2}
          rowSpacing={isMobile ? 5.7 : 5}
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

        @media (max-width: 749px){
          width: 16.67vw;
        }

        @media (min-width: 899px) {
          width: auto;
          min-width: 4.69vw;
          height: 31px;
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

          @media (max-width: 749px){
            padding: 2px 10px;
          }

          @media (min-width: 899px) {
            font-size: 16px;
          }
        }
      }
    }

    .nav_cateogry {
      margin-bottom: 2.3vw;
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

  .nav_list{
    overflow: hidden;
  }
`;
