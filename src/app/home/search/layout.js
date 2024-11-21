"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import TopSearchBar from "@/components/layout/Header/TopSearchBar";
import TopTabBar from "@/components/common/TopTabBar";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  backRoutes,
  pushRoutes,
  replaceRoutes,
} from "@/store/actions/historyActions";
import { pageUrlConstants } from "@/lib/constants";
const { home } = pageUrlConstants;

const HomeSearchPage = ({ children }) => {
  const { state, dispatch } = useGlobalContext();
  const t = useTranslations();

  const containerRef = useRef(null);

  const [searchBarValue, setSearchBarValue] = useState("");

  useEffect(() => {
    setSearchBarValue(
      decodeURIComponent(state.router.location.pathname.split("/")[4] ?? '')
    );
  }, [state.router.location.pathname]);

  function onSearchChange(e) {
    setSearchBarValue(e.target.value);
  }

  let labelList = {
    SAC: {
      name: t("Navbar.top_navigator_comic"),
    },
    SAV: {
      name: t("Navbar.top_navigator_animate"),
    },
    SV: {
      name: t("Navbar.top_navigator_video"),
    },
    SX: {
      name: t("Navbar.top_navigator_novel"),
    },
    ST: {
      name: t("Navbar.top_navigator_meitu"),
    },
  };

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <>
            <TopSearchBar
              backArrowCallback={clickTopBackArrow}
              searchBarKeyDown={searchBarKeyDown}
              searchValue={searchBarValue}
              onSearchChange={onSearchChange}
            />
            {searchBarValue ? (
              <TopTabBar labelList={labelList} callback={clickTabLabel} />
            ) : (
              ""
            )}
          </>
        ),
      },
    });
  }, [searchBarValue]);

  const clickTopBackArrow = () => {
    useGlobalDispatch(backRoutes());
  };
  const searchBarKeyDown = (e) => {
    var key = window.event ? e.keyCode : e.which;
    if (key === 13) {
      useGlobalDispatch(
        pushRoutes({
          name:
            home.pages.homeSearch.pages.homeSearchResult.pages
              .homeSearchResultSAC.name + e.target.value,
          path: home.pages.homeSearch.pages.homeSearchResult.pages
            .homeSearchResultSAC.path,
          dynamic: {
            search: e.target.value,
          },
        })
      );
    }
  };
  const clickTabLabel = (key) => {
    let pathneme = state.router.location.pathname.split("/");
    useGlobalDispatch(
      replaceRoutes({
        name:
          home.pages.homeSearch.pages.homeSearchResult.pages[
            "homeSearchResult" + key
          ].name + pathneme[4],
        path: home.pages.homeSearch.pages.homeSearchResult.pages[
          "homeSearchResult" + key
        ].path,
        dynamic: {
          search: pathneme[4],
        },
      })
    );
  };
  return (
    <HomeSearchPageElement
      ref={containerRef}
      main_height={state.navbar.mainHeight}
    >
      {children}
    </HomeSearchPageElement>
  );
};

export default HomeSearchPage;

export const HomeSearchPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding-top: ${main_height}px;

    .container {
        position: relative;
        margin-top: 1%;
    }
  `}
`;
