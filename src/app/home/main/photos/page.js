'use client'

import React, { useEffect, useMemo, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import { adsKeys, colors } from "@/lib/constants";
import ScrollToTop from "@/components/common/ScrollToTop";
import ImageCarousel from "@/components/common/ImageCarousel";
import useMediaQuery from "@/hooks/useMediaQuery";
import WavaButton from "@/components/layout/Header/WavaButton";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import PictureCard from "@/components/common/PictureCard";
import { useGlobalContext, useGlobalDispatch } from "@/store";

import { getPhotosDataAction } from "@/store/actions/pages/homePhotosListAction";
import {
  getPhotosTabAction,
  setNowTabList,
} from "@/store/actions/pages/homePhotosAction";

const HomePhotosPage = () => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();

  const nowTab = useMemo(
    () => state.homePhoto.nowTab,
    [state.homePhoto.nowTab]
  );
  const list = useMemo(() => {
    return state.homePhotosListData[nowTab]
      ? [...state.homePhotosListData[nowTab].list]
      : [];
  }, [state.homePhotosListData, nowTab]);

  const photoTabListRef = useRef(null);
  useEffect(() => {
    if (state.homePhotosList.length === 0) {
      getPhotosTab();
    }
  }, []);

  useEffect(() => {
    let tabBar = photoTabListRef.current;
    tabBar.addEventListener("wheel", photoWheelEvent);
    window.addEventListener("scroll", scrollEvent);
    if (list[nowTab]?.page === 0 || list[nowTab] === undefined) {
      updatePhotosData(nowTab, () => {});
    }
    return () => {
      tabBar.removeEventListener("wheel", photoWheelEvent);
      window.removeEventListener("scroll", scrollEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowTab]);

  useEffect(() => {
    updatePhotosData(nowTab, () => {});
  }, []);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      updatePhotosData(nowTab, scrollColdEnd);
    });
  }

  function photoWheelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    photoTabListRef.current.scrollLeft += e.deltaY;
  }
  const showList = useMemo(() => {
    const splitList = [];
    const copyList = [...list];

    while (copyList.length > 12) {
      splitList.push(copyList.splice(0, 12));
    }

    splitList.push(copyList);

    return splitList;
  }, [list]);
  const [newPhotoList, setNwePhotoList] = useState([]);
  useEffect(() => {
    if (state.homePhotosList.length) {
      let now = state.homePhotosList.find((x) => x.id === 9);
      state.homePhotosList = state.homePhotosList.filter((x) => x.id !== 9);
      state.homePhotosList.unshift(now);
      setNwePhotoList(state.homePhotosList);
    }
  }, [state.homePhotosList.length]); // 為了把id 9排到第一筆

  const getPhotosTab = () => {
    useGlobalDispatch(getPhotosTabAction());
  };
  const clickTabEvent = (id) => {
    useGlobalDispatch(setNowTabList(id));
  };
  const updatePhotosData = (cateId, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getPhotosDataAction(cateId, scrollColdEnd));
  };
  return (
    <HomePhotosPageElement>
      <ImageCarousel
        adsKey={adsKeys.home}
        threeInOneBanner={!isMobile}
        is_cover
        size="banner_main"
      />
      <div
        ref={photoTabListRef}
        className={`nav_list ${!isMobile && "mx-indent"}`}
        onWheel={photoWheelEvent}
      >
        {newPhotoList.map((item, i) => {
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
      <div className="mt-2" />

      {(showList || []).map((group, index) => (
        <React.Fragment key={index}>
          <div className={`${!isMobile && "px-indent"}`}>
            <Grid
              container
              direction="row"
              alignItems="center"
              className="photo_content "
              spacing={2}
            >
              {group.map((data) => (
                <Grid item md={2} xs={4} key={data.title}>
                  <PictureCard data={data} key={data.id} total_view_show />
                </Grid>
              ))}
            </Grid>
          </div>
          {/*  這邊請在修改成需要的廣告和大小 */}
          <div className="split_container">
            {index !== showList.length - 1 && (
              <ImageCarousel
                adsKey={adsKeys.profile_interval}
                threeInOneBanner={!isMobile}
              />
            )}
          </div>
          <ScrollToTop />
        </React.Fragment>
      ))}
    </HomePhotosPageElement>
  );
};

export default HomePhotosPage;

export const HomePhotosPageElement = styled.div`
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
  .split_container {
    padding: 16px 0;
  }
  .photo_content {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0.5em;
  }
`;
