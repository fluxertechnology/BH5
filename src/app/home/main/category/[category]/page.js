"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useTranslations } from "next-intl";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import {
  adsKeys,
  colors,
  side_padding,
  pageUrlConstants,
} from "@/lib/constants";
import WavaButton from "@/components/layout/Header/WavaButton";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";

import TabLabel from "@/components/index/TabLabel";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import { usePathname, useParams } from "next/navigation";
import { pushRoutes } from "@/store/actions/historyActions";

import {
  getCategoryDataAction,
  getCategoryListAction,
  restCategoryDataAction,
} from "@/store/actions/pages/homeCategoryAction";
import { getNovelsDataAction } from "@/store/actions/pages/homeNovelsListAction";
import NovelCard from "@/components/common/NovelCard";
import {
  getNovelsTabAction,
  setNowTabList,
} from "@/store/actions/pages/homeNovelsAction";
import { getPhotosDataAction } from "@/store/actions/pages/homePhotosListAction";
import {
  getPhotosTabAction,
  setNowTabList as setNowPhotoTabList,
} from "@/store/actions/pages/homePhotosAction";
import PictureCard from "@/components/common/PictureCard";

import ImageCarousel from "@/components/common/ImageCarousel";

const HomeCategoryPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const loaction = usePathname();
  const { home } = pageUrlConstants;

  const { isMobile } = useMediaQuery();

  const categoryMap = {
    0: "动画",
    1: "韩漫",
    2: "日漫",
    3: "欧漫",
    4: "小说",
    5: "图文",
  };

  const titleLocale = {
    "K-Comics": "韩漫",
    Dojin: "同人",
    "Free Watch": "Free",
  };
  const typeMapping = {
    [t("Global.animate")]: 0,
    [t("Global.3d")]: 0,
    [t("Global.j_comics")]: 1,
    [t("Global.k_comics")]: 2,
    [t("Global.e_comics")]: 3,
    [t("Navbar.top_navigator_novel")]: 4,
    [t("Global.visual_text")]: 5,
  };
  const decodeTitle = decodeURIComponent(useParams().category);
  const title = titleLocale[decodeTitle] ?? decodeTitle;

  const tabRef = useRef(null);

  const [tabHeight, setTabHeight] = useState(0);
  const [tabHeightState, setTabHeightState] = useState(false);

  const [type, setType] = useState(typeMapping[title] ?? 1);
  const [pickCategory, setPickCategory] = useState(
    state.homeCategoryData[title]?.select_tag_gp || [],
  );
  const [pickPrice, setPickPrice] = useState(
    title === t("Global.free_for_a_limited_time") ? 2 : 0,
  );
  const [isReset, setIsReset] = useState(false);

  const typeRef = useRef(type);
  const pickCategoryRef = useRef(pickCategory);
  const pickPriceRef = useRef(pickPrice);
  const titleRef = useRef(title);
  const selectedNovelTabRef = useRef(state.homeNovel.nowTab);
  const selectedPhotoTabRef = useRef(state.homePhoto.nowTab);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    pickCategoryRef.current = pickCategory;
  }, [pickCategory]);

  useEffect(() => {
    pickPriceRef.current = pickPrice;
  }, [pickPrice]);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    selectedNovelTabRef.current = state.homeNovel.nowTab;
  }, [state.homeNovel.nowTab]);

  useEffect(() => {
    selectedPhotoTabRef.current = state.homePhoto.nowTab;
  }, [state.homePhoto.nowTab]);

  useEffect(() => {
    setType(title === t("Global.animate") || title === t("Global.3d") ? 0 : 1);
    setPickPrice(title === t("Global.free_for_a_limited_time") ? 2 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaction.pathname]);

  useEffect(() => {
    if (state.homeCategoryTabList.length === 0) {
      getCategoryList(getTabHeight);
    } else {
      getTabHeight();
    }

    if (state.homeNovelsList.length === 0) {
      getNovelsTab();
    }

    if (state.homePhotosList.length === 0) {
      getPhotosTab();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isInit, setIsInit] = useState(true);
  useEffect(() => {
    getListData(isInit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (isInit) {
      setIsInit(false);
    }
  }, [
    type,
    pickCategory.length,
    pickPrice,
    title,
    state.homeNovel.nowTab,
    state.homePhoto.nowTab,
  ]);

  const scrollEvent = useCallback(() => {
    scrollBottomCallEvent((scrollColdEnd) => {
      const currentType = typeRef.current;
      const currentPickCategory = pickCategoryRef.current;
      const currentPickPrice = pickPriceRef.current;
      const currentTitle = titleRef.current;
      const currentSelectedNovelTab = selectedNovelTabRef.current;
      const currentSelectedPhotoTab = selectedPhotoTabRef.current;

      if (currentType === 0) {
        const params = {
          init: false,
          type: 0,
          category: categoryMap[currentType],
          is_free: currentPickPrice,
          tag_gp: currentPickCategory,
        };
        getCategoryData(params, scrollColdEnd);
        return;
      }
      if ([1, 2, 3].includes(currentType)) {
        const params = {
          init: false,
          type: 1,
          category: categoryMap[currentType],
          is_free: currentPickPrice,
          tag_gp: currentPickCategory,
        };
        getCategoryData(params, scrollColdEnd);
        return;
      }
      if (currentType === 4) {
        getNovelsData(currentSelectedNovelTab, scrollColdEnd);
        return;
      }
      if (currentType === 5) {
        getPhotosData(currentSelectedPhotoTab, scrollColdEnd);
        return;
      }
    });
  }, []);

  useEffect(() => {
    if (isInit) return;
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
  }, [isInit, scrollEvent]);

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
  }, [is750, isMobile]);

  const toggleTabHeight = useCallback(() => {
    if (!tabRef) return;
    if (tabRef.current.offsetHeight === tabHeight) {
      if (isMobile) {
        tabRef.current.style.height = is750 ? "100px" : "72px";
      } else {
        tabRef.current.style.height = "100px";
      }
      setTabHeightState(false);
    } else {
      tabRef.current.style.height = tabHeight + "px";
      setTabHeightState(true);
    }
  }, [is750, isMobile, tabHeight, tabRef]);

  const getTabHeight = useCallback(() => {
    if (!tabRef) return;

    tabRef.current.style.height = "unset";
    setTabHeight(tabRef.current.offsetHeight);
    if (isMobile) {
      tabRef.current.style.height = is750 ? "100px" : "72px";
    } else {
      tabRef.current.style.height = "100px";
    }
  }, [is750, isMobile, tabHeight, tabRef]);

  function getListData(init = false, callback = () => {}) {
    if (type === 0) {
      const params = {
        reset: isReset,
        init: init,
        type: 0, // 1 漫畫 或 0 動畫
        category: categoryMap[type],
        is_free: pickPrice,
        tag_gp: pickCategory,
      };
      getCategoryData(params, (data) => {
        callback(data);
        if (init) setIsInit(false);
      });
      setIsReset(false);
      return;
    }
    if ([1, 2, 3].includes(type)) {
      const params = {
        reset: isReset,
        init: init,
        type: 1, // 1 漫畫 或 0 動畫
        category: categoryMap[type],
        is_free: pickPrice,
        tag_gp: pickCategory,
      };
      getCategoryData(params, (data) => {
        callback(data);
        if (init) setIsInit(false);
      });
      setIsReset(false);
      return;
    }
    if (type === 4) {
      getNovelsData(selectedNovelTab, callback);
      return;
    }
    if (type === 5) {
      getPhotosData(selectedPhotoTab, callback);
      return;
    }
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
  const resetSetCategoryData = () => {
    setIsReset(true);
    useGlobalDispatch(restCategoryDataAction(categoryMap[type]));
  };

  const getNovelsData = (id, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getNovelsDataAction(id, scrollColdEnd));
  };
  const getNovelsTab = () => {
    useGlobalDispatch(getNovelsTabAction());
  };
  const selectNowTab = (id) => {
    useGlobalDispatch(setNowTabList(id));
  };
  const selectedNovelTab = useMemo(
    () => state.homeNovel.nowTab,
    [state.homeNovel.nowTab],
  );

  const getPhotosData = (cateId, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getPhotosDataAction(cateId, scrollColdEnd));
  };
  const getPhotosTab = () => {
    useGlobalDispatch(getPhotosTabAction());
  };
  const selectNowPhotoTab = (id) => {
    useGlobalDispatch(setNowPhotoTabList(id));
  };
  const selectedPhotoTab = useMemo(
    () => state.homePhoto.nowTab,
    [state.homePhoto.nowTab],
  );
  const handleTabChange = (newType, categoryTitle) => {
    if (type === newType && title === categoryTitle) return;

    setType(newType);

    // 清空旧数据
    useGlobalDispatch(restCategoryDataAction(categoryTitle));

    // 更新路由，这样 title 也会自动变（useParams）
    useGlobalDispatch(
      pushRoutes({
        name: home.pages.homeMain.pages.homeCategory.name + categoryTitle,
        path: home.pages.homeMain.pages.homeCategory.path,
        dynamic: {
          tab: categoryTitle,
        },
      })
    );

    // 不需要 setTitle()
  };

  useEffect(() => {
    setPickCategory(state.homeCategoryData[title]?.select_tag_gp || []);
    setPickPrice(title === t("Global.free_for_a_limited_time") ? 2 : 0);
  }, [title]);

  return (
    <HomeCategoryElement className={!isMobile && "px-indent"}>
      <ImageCarousel
        adsKey={adsKeys.anime_top_banner}
        threeInOneBanner={!isMobile}
        size="banner_animated"
        is_cover
      />
      {/* <TopBarContainer>
        <TopTitleBar title={title} showBack={true} show_back_color="#ffffff" />
      </TopBarContainer> */}
      <div className="category_container">
        <div className="category_container_content">
          <div className="category_container_content_box">
            <TabLabel
              text={t("Global.j_comics")}
              active={type === 2}
              onClick={() => {
                if (type !== 2) {
                  resetSetCategoryData();
                  setType(2);
                }
              }}
            />
            <TabLabel
              text={t("Global.k_comics")}
              active={type === 1}
              onClick={() => {
                if (type !== 1) {
                  resetSetCategoryData();
                  setType(1);
                }
              }}
            />
            <TabLabel
              text={t("Global.e_comics")}
              active={type === 3}
              onClick={() => {
                if (type !== 3) {
                  resetSetCategoryData();
                  setType(3);
                }
              }}
            />
            {"韩漫".indexOf(title) === -1 && (
              <TabLabel
                text={t("Global.animate")}
                active={type === 0}
                onClick={() => {
                  if (type !== 0) {
                    resetSetCategoryData();
                    setType(0);
                  }
                }}
              />
            )}
            <TabLabel
              text={t("Navbar.top_navigator_novel")}
              active={type === 4}
              onClick={() => {
                if (type !== 4) {
                  resetSetCategoryData();
                  setType(4);
                }
              }}
            />
            <TabLabel
              text={t("Global.visual_text")}
              active={type === 5}
              onClick={() => {
                if (type !== 5) {
                  resetSetCategoryData();
                  setType(5);
                }
              }}
            />
          </div>
        </div>
        <div className="category_container_content">
          <div ref={tabRef} className="category_container_content_box">
            {[0, 1, 2, 3].includes(type) && (
              <>
                <TabLabel
                  text={t("Global.all")}
                  active={pickCategory.length === 0}
                  onClick={() => {
                    if (pickCategory.length !== 0) {
                      setPickCategory([]);
                      resetSetCategoryData();
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
                        resetSetCategoryData();
                        onSelectCategory(tabName.name);
                      }}
                    />
                  );
                })}
              </>
            )}
            {type === 4 &&
              state.homeNovelsList.map((item, i) => {
                return (
                  <TabLabel
                    key={item.id + "_" + i}
                    text={item.title}
                    active={selectedNovelTab === item.id}
                    onClick={() => {
                      selectNowTab(item.id);
                    }}
                  />
                );
              })}
            {type === 5 &&
              state.homePhotosList.map((item, i) => {
                return (
                  <TabLabel
                    key={item.id + "_" + i}
                    text={item.title}
                    active={selectedPhotoTab === item.id}
                    onClick={() => {
                      selectNowPhotoTab(item.id);
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
              &lt;&nbsp;&nbsp;&nbsp;
              {tabHeightState ? t("Global.show_less") : t("Global.show_more")}
              &nbsp;&nbsp;&nbsp;&gt;
            </WavaButton>
          </div>
        </div>
        {[0, 1, 2, 3].includes(type) &&
        title !== t("Global.free_for_a_limited_time") ? (
          <div className="category_container_content">
            <div className="category_container_content_box">
              <TabLabel
                text={t("Global.all")}
                active={pickPrice === 0}
                onClick={() => {
                  if (pickPrice !== 0) {
                    resetSetCategoryData();
                    setPickPrice(0);
                  }
                }}
              />
              <TabLabel
                text={t("Global.free")}
                active={pickPrice === 2}
                onClick={() => {
                  if (pickPrice !== 2) {
                    resetSetCategoryData();
                    setPickPrice(2);
                  }
                }}
              />
              <TabLabel
                text={t("Global.payment")}
                active={pickPrice === 1}
                onClick={() => {
                  if (pickPrice !== 1) {
                    resetSetCategoryData();
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
            spacing={!isMobile ? 1.178 : 1}
          >
            {[0, 1, 2, 3].includes(type) &&
              state.homeCategoryData[categoryMap[type]]?.list
                ?.filter(
                  (item) =>
                    item.tag_gp.some((tag) => pickCategory.includes(tag)) ||
                    pickCategory.length === 0,
                )
                .map((data, index) => (
                  <Grid
                    item
                    md={type === 0 ? 2.4 : 1.71}
                    xs={type === 0 ? 6 : 4}
                    className={`${type === 0 ? "anime-card-adj" : "card-adj"}`}
                    key={`${data.id}-${index}`}
                  >
                    <CoverCubeItem
                      isVideo={type === 0}
                      data={data}
                      type={!type && "animated"}
                      total_view_show
                    />
                  </Grid>
                ))}
            {type === 4 &&
              state.homeNovelsListData[selectedNovelTab]?.list
                .filter((_, index) => {
                  return (
                    !state.homeNovelsListData[selectedNovelTab].isNew ||
                    index < state.homeNovelsListData[selectedNovelTab].page * 10
                  );
                })
                .sort((a, b) => b.id - a.id)
                .map((data, i) => {
                  return (
                    <Grid item md={1.71} xs={4} key={"小說 " + data.title + i}>
                      <NovelCard key={data.id} data={data} total_view_show />
                    </Grid>
                  );
                })}
            {type === 5 &&
              state.homePhotosListData[selectedPhotoTab]?.list.map((data) => (
                <Grid item md={1.71} xs={4} key={data.title} className="illust-card-adj">
                  <PictureCard data={data} key={data.id} total_view_show />
                </Grid>
              ))}
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
    padding: 48px ${side_padding}px 10px;

    @media (max-width: 898px) {
      padding: 6.67vw ${side_padding}px 10px;
    }

    &_content {
      &_box {
        overflow: hidden;
        transition: 0.1s;
      }

      &_btn {
        margin: 4px 0;

        &_button {
          cursor: pointer;
          padding: 19px 10px;
          box-sizing: border-box;
          font-weight: 700;
          text-align: center;
          border-top: 1px solid ${colors.back_grey};
          border-radius: 5px;

          @media (max-width: 898px) {
            font-weight: 400;
            font-size: max(12px, 2.4vw);
          }
        }
      }
    }

    &_exhibit {
      display: flex;
      flex-wrap: wrap;
      padding-top: 1%;
    }

    .card-adj .item_footer_gold{
      margin-bottom: 36px;
    }

    .anime-card-adj .item_footer_gold{
      margin-top: 0;
      margin-bottom: 36px;
    }

    .illust-card-adj .card_body_heart{
      margin-top: 13px;
      margin-bottom: 36px;
    }
  }
`;
