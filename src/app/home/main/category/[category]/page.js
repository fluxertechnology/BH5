"use client";

import React, { useState, useEffect, useRef, use, useMemo } from "react";
import { useTranslations } from "next-intl";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import { colors, side_padding } from "@/lib/constants";
import WavaButton from "@/components/layout/Header/WavaButton";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";

import TabLabel from "@/components/index/TabLabel";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import { usePathname, useParams } from "next/navigation";

import {
  getCategoryDataAction,
  getCategoryListAction,
  restCategoryDataAction,
} from "@/store/actions/pages/homeCategoryAction";

const HomeCategoryPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const loaction = usePathname();

  const { isMobile } = useMediaQuery();

  const titleLocale = {
    'K-Comics': "韩漫",
    'Dojin': "同人",
    'Free Watch': "Free",
  }
  const decodeTitle = decodeURIComponent(useParams().category);
  const title = titleLocale[decodeTitle] ?? decodeTitle;

  const tabRef = useRef(null);

  const [tabHeight, setTabHeight] = useState(0);

  const [tabHeightState, setTabHeightState] = useState(false);

  const [type, setType] = useState(
    title === t("Global.animate") || title === t("Global.3d") ? 0 : 1
  );
  const [pickCategory, setPickCategory] = useState(
    state.homeCategoryData[title]?.select_tag_gp || []
  );
  const [pickPrice, setPickPrice] = useState(
    title === t("Global.free_for_a_limited_time") ? 2 : 0
  );

  useEffect(() => {
    setType(title === t("Global.animate") || title === t("Global.3d") ? 0 : 1);
    setPickPrice(title === t("Global.free_for_a_limited_time") ? 2 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaction.pathname]);

  // api is_free 1 : 免費 0 : 付費 不傳 全部
  // 辨識方式     2       1         0
  useEffect(() => {
    if (state.homeCategoryTabList.length === 0) {
      getCategoryList(getTabHeight);
    } else {
      getTabHeight();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [ isInit, setIsInit ] = useState(true);
  useEffect(() => {
    getListData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, pickCategory, pickPrice, title]);

  useEffect(() => {
    if (isInit) return;
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
  }, [isInit]);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      getCategoryData(
        {
          type: type,
          category: title,
          is_free: pickPrice,
          tag_gp: pickCategory,
        },
        scrollColdEnd
      );
    });
  }

  function toggleTabHeight() {
    if (!tabRef) return;
    if (tabRef.current.offsetHeight === tabHeight) {
      tabRef.current.style.height = "64px";
      setTabHeightState(false);
    } else {
      tabRef.current.style.height = tabHeight + "px";
      setTabHeightState(true);
    }
  }

  function getTabHeight() {
    if (!tabRef) return;

    tabRef.current.style.height = "unset";
    setTabHeight(tabRef.current.offsetHeight);
    tabRef.current.style.height = "64px";
  }

  function getListData(init = false) {
    getCategoryData({
      init,
      type: type,
      category: title,
      is_free: pickPrice,
      tag_gp: pickCategory,
    }, () => { if (init) setIsInit(false) }
    );
  }
  function onSelectCategory(name) {
    if (pickCategory.indexOf(name) !== -1) {
      pickCategory.splice(pickCategory.indexOf(name), 1);
      setPickCategory([...pickCategory]);
    } else {
      setPickCategory([...pickCategory, name]);
    }
  }

  const getCategoryList = (getTabHeight) => {
    useGlobalDispatch(getCategoryListAction(getTabHeight));
  };
  const getCategoryData = (data, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getCategoryDataAction(data, scrollColdEnd));
  };
  const resetSetCategoryData = (category) => {
    useGlobalDispatch(restCategoryDataAction(category));
  };
  return (
    <HomeCategoryElement className={!isMobile && "px-indent"}>
      {/* <TopBarContainer>
        <TopTitleBar title={title} showBack={true} show_back_color="#ffffff" />
      </TopBarContainer> */}
      <div className="category_container">
        <div className="category_container_content">
          <div className="category_container_content_box">
            <TabLabel
              text={t("Global.comics")}
              active={type === 1}
              onClick={() => {
                if (type !== 1) {
                  resetSetCategoryData(title);
                  setType(1);
                }
              }}
            />
            {"韩漫".indexOf(title) === -1 && (
              <TabLabel
                text={t("Global.animate")}
                active={type === 0}
                onClick={() => {
                  if (type !== 0) {
                    resetSetCategoryData(title);
                    setType(0);
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="category_container_content">
          <div ref={tabRef} className="category_container_content_box">
            <TabLabel
              text={t("Global.all")}
              active={pickCategory.length === 0}
              onClick={() => {
                if (pickCategory.length !== 0) {
                  setPickCategory([]);
                  resetSetCategoryData(title);
                }
              }}
            />
            {state.homeCategoryTabList.map((tabName, index) => {
              return (
                <TabLabel
                  key={tabName.name + index}
                  text={tabName.name}
                  active={pickCategory.indexOf(tabName.name) !== -1}
                  onClick={() => {
                    resetSetCategoryData(title);
                    onSelectCategory(tabName.name);
                  }}
                />
              );
            })}
          </div>
          <div
            className="category_container_content_btn"
            onClick={toggleTabHeight}
          >
            <WavaButton className="category_container_content_btn_button">
              {tabHeightState ? t("Global.show_less") : t("Global.show_more")}
            </WavaButton>
          </div>
        </div>
        {true || title !== t("Global.free_for_a_limited_time") ? (
          <div className="category_container_content">
            <div className="category_container_content_box">
              <TabLabel
                text={t("Global.all")}
                active={pickPrice === 0}
                onClick={() => {
                  if (pickPrice !== 0) {
                    resetSetCategoryData(title);
                    setPickPrice(0);
                  }
                }}
              />
              <TabLabel
                text={t("Global.free")}
                active={pickPrice === 2}
                onClick={() => {
                  if (pickPrice !== 2) {
                    resetSetCategoryData(title);
                    setPickPrice(2);
                  }
                }}
              />
              <TabLabel
                text={t("Global.payment")}
                active={pickPrice === 1}
                onClick={() => {
                  if (pickPrice !== 1) {
                    resetSetCategoryData(title);
                    setPickPrice(1);
                  }
                }}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="category_container_exhibit mt-2">
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={!isMobile ? 4 : 1}
          >
            {state.homeCategoryData[title]?.list?.map((data, index) => {
              //type 0 動畫 1漫畫
              return (
                <Grid
                  item
                  md={type === 0 ? 3 : 2}
                  xs={type === 0 ? 6 : 4}
                  key={`${data.id}-${index}`}
                >
                  <CoverCubeItem
                    isVideo={type === 0}
                    data={data}
                    type={!type && "animated"}
                    total_view_show
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
    </HomeCategoryElement>
  );
};

export default HomeCategoryPage;

export const HomeCategoryElement = styled.div`
  /*  */

  .category_container {
    padding: 10px ${side_padding}px;

    &_content {
      &_box {
        overflow: hidden;
        transition: 0.1s;
      }

      &_btn {
        margin: 4px 0;

        &_button {
          cursor: pointer;
          padding: 10px;
          box-sizing: border-box;
          font-weight: 700;
          text-align: center;
          background-color: ${colors.back_grey};
          border-radius: 5px;
        }
      }
    }

    &_exhibit {
      display: flex;
      flex-wrap: wrap;
      padding-top: 1%;
    }
  }
`;
