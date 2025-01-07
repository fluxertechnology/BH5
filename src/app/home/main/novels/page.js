"use client";

import { useEffect, useMemo, useRef } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import ImageCarousel from "@/components/common/ImageCarousel";
import { adsKeys, colors } from "@/lib/constants";
import useMediaQuery from "@/hooks/useMediaQuery";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import WavaButton from "@/components/layout/Header/WavaButton";
import NovelCard from "@/components/common/NovelCard";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useTranslations } from "next-intl";
import { useGlobalContext, useGlobalDispatch } from "@/store";

import { getNovelsDataAction } from "@/store/actions/pages/homeNovelsListAction";
import { getNovelsTabAction, setNowTabList } from "@/store/actions/pages/homeNovelsAction";

const HomeNovelsPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const novelTabListRef = useRef(null);
  const { isMobile } = useMediaQuery();

  const nowTab = useMemo(
    () => state.homeNovel.nowTab,
    [state.homeNovel.nowTab]
  );
  useEffect(() => {
    if (state.homeNovelsList.length === 0) {
      getNovelsTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let tabBar = novelTabListRef.current;
    tabBar.addEventListener("wheel", novelWheelEvent);
    window.addEventListener("scroll", scrollEvent);
    if (
      state.homeNovelsListData[nowTab]?.page === 0 ||
      state.homeNovelsListData[nowTab] === undefined
    ) {
      updateNovelsData(nowTab, () => {});
    }
    return () => {
      tabBar.removeEventListener("wheel", novelWheelEvent);
      window.removeEventListener("scroll", scrollEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowTab]);
  useEffect(() => {
    updateNovelsData(nowTab, () => {});
  }, []);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      updateNovelsData(nowTab, scrollColdEnd);
    });
  }

  function novelWheelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    novelTabListRef.current.scrollLeft += e.deltaY;
  }

  const getNovelsTab = () => {
    useGlobalDispatch(getNovelsTabAction());
  };
  const updateNovelsData = (id, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getNovelsDataAction(id, scrollColdEnd));
  };
  const clickTabEvent = (id) => {
    useGlobalDispatch(setNowTabList(id));
  };
  return (
    <HomeNovelsPageElement>
      <ImageCarousel
        adsKey={adsKeys.home}
        threeInOneBanner={!isMobile}
        is_cover
        size="banner_main"
      />
      <div
        ref={novelTabListRef}
        className={`nav_list ${!isMobile && "mx-indent"}`}
        onWheel={novelWheelEvent}
      >
        {state.homeNovelsList.map((item, i) => {
          return (
            <div
              className={"nav_list_tag " + (nowTab === item.id ? "active" : "")}
              style={
                {
                  // order: item.sort, 看要不要照後台排 目前沒有這打算
                }
              }
              key={item.id + "_" + i}
              onClick={() => {
                clickTabEvent(item.id);
              }}
            >
              <WavaButton>
                <p className="nav_list_tag_text">{item.title}</p>
              </WavaButton>
            </div>
          );
        })}
      </div>

      <Grid
        container
        direction="row"
        alignItems="center"
        className={`${!isMobile && "px-indent"} novel_content`}
        spacing={2}
      >
        {state.homeNovelsListData[nowTab]?.list
          .filter((_, index) => {
            return (
              !state.homeNovelsListData[nowTab].isNew ||
              index < state.homeNovelsListData[nowTab].page * 10
            );
          })
          .sort((a, b) => b.id - a.id)
          .map((data, i) => {
            return (
              <Grid item md={2} xs={4} key={"小說 " + data.title + i}>
                <NovelCard key={data.id} data={data} total_view_show />
              </Grid>
            );
          })}
        <ScrollToTop />
      </Grid>
    </HomeNovelsPageElement>
  );
};

HomeNovelsPage.propTypes = {
  // newNotice: PropTypes.number.isRequired,
  // clickSerch: PropTypes.func.isRequired,
  // clickAvatar: PropTypes.func.isRequired,
  // clickNew: PropTypes.func.isRequired,
};

export default HomeNovelsPage;

export const HomeNovelsPageElement = styled.div`
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

  .novel_content {
    display: flex;
    flex-wrap: wrap;
  }
`;
