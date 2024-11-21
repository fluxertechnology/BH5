"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import ImageCarousel from "@/components/common/ImageCarousel";
import {
  adsKeys,
  colors,
  pageUrlConstants,
  side_padding,
} from "@/lib/constants";
import LinkComponent from "@/components/common/LinkComponent";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  clearHistoryAction,
  getSearchTabAction,
} from "@/store/actions/pages/homeSearchMainAction";

const { home } = pageUrlConstants;

const HomeSearchMainPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  useEffect(() => {
    if (state.homeSearchTabList.hotTab.length === 0) {
      getSearchTabData();
    }
  }, []);

  const getSearchTabData = () => {
    useGlobalDispatch(getSearchTabAction());
  };

  const clearHistory = () => {
    useGlobalDispatch(clearHistoryAction());
  };

  return (
    <HomeSearchMainPageElement>
      <div className="tab_container">
        <div className="tab_container_header">
          <p className="tab_container_header_title">{t("Search.hot_search")}</p>
        </div>
        <div className="tab_container_body">
          {state.homeSearchTabList.hotTab.map((tabName, index) => {
            return (
              <LinkComponent
                routes={{
                  name:
                    home.pages.homeSearch.pages.homeSearchResult.pages
                      .homeSearchResultSAC.name + tabName,
                  path: home.pages.homeSearch.pages.homeSearchResult.pages
                    .homeSearchResultSAC.path,
                  dynamic: {
                    search: tabName,
                  },
                }}
                className="tab_container_body_tab"
                key={`${tabName}-${index}`}
              >
                {tabName}
              </LinkComponent>
            );
          })}
        </div>
      </div>
      <ImageCarousel
        adsKey={adsKeys.search_interval}
        threeInOneBanner={!isMobile}
      />
      <div className="tab_container">
        <div className="tab_container_header">
          <p className="tab_container_header_title">
            {t("Search.search_history")}
          </p>
          <span className="tab_container_header_clear" onClick={clearHistory}>
            {t("Global.clean")}
          </span>
        </div>
        <div className="tab_container_body">
          {state.homeSearchTabList.historyTab.map((tabName, index) => {
            return (
              <LinkComponent
                routes={{
                  name:
                    home.pages.homeSearch.pages.homeSearchResult.pages
                      .homeSearchResultSAC.name + tabName,
                  path: home.pages.homeSearch.pages.homeSearchResult.pages
                    .homeSearchResultSAC.path,
                  dynamic: {
                    search: tabName,
                  },
                }}
                className="tab_container_body_tab"
                key={`${tabName}-${index}`}
              >
                {tabName}
              </LinkComponent>
            );
          })}
        </div>
      </div>
    </HomeSearchMainPageElement>
  );
};

export default HomeSearchMainPage;

export const HomeSearchMainPageElement = styled.div`/*  */
  padding: 0 ${side_padding}px;

  .tab_container {
    margin: 10px 0;

    &_header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &_title {
        padding-left:5px;
        margin-top:10px;
        font-size: 18px;
        font-weight: 900;
        text-shadow: 0px 0px black;
      }

      &_clear {
        cursor: pointer;
        color: #fa719a;
      }
    }

    &_body {
      margin-top: 10px;

      &_tab {
        cursor: pointer;
        display: inline-block;
        padding: 4px 12px;
        margin: 3px 30px 10px 0;
        padding:auto
        height:25px;
        line-height:25px;
        text-decoration: none;
        color: gray;
        font-weight:600;
        font-size:20px;
        background-color: ${colors.back_grey};
        border-radius:3px;
        
        @media (max-width: 599px) {
          padding: 4px 6px;
          margin: 3px 10px 10px 0;
          font-size:18px;
        }
      }
    }
  }
`;
