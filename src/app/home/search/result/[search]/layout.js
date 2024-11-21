"use client";

import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { sub_height } from "@/components/layout/Header/TopBarContainer";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import {
  addHistoryTabAcion,
  updateSearchResultAction,
} from "@/store/actions/pages/homeSearchResultAction";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const HomeSearchResultPage = ({ children }) => {
  const { state } = useGlobalContext();

  const pathneme = useMemo(() => {
    return state.router.location.pathname;
  }, [state.router.location.pathname]);
  useEffect(() => {
    let path = pathneme.split("/");
    addHistoryTab(decodeURIComponent(path[4] ?? ""));
  }, [pathneme]);

  useEffect(() => {
    let path = pathneme.split("/");
    if (
      !state.homeSearchResultData[path[4]] ||
      state.homeSearchResultData[path[4]][path[5]]?.page === 0
    ) {
      updateSearchResult(pathneme);
    }

    window.removeEventListener("scroll", scrollEvent);
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
  }, [pathneme]);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      updateSearchResult(pathneme, scrollColdEnd);
    });
  }

  const updateSearchResult = (pathneme, scrollColdEnd = () => {}) => {
    let path = pathneme.split("/");
    if (path[4] && path[5]) {
      useGlobalDispatch(
        updateSearchResultAction(path[4], path[5], scrollColdEnd)
      );
    }
  };
  const addHistoryTab = (tab) => {
    useGlobalDispatch(addHistoryTabAcion(tab));
  };

  return <HomeSearchResultPageElement>{children}</HomeSearchResultPageElement>;
};

export default HomeSearchResultPage;

export const HomeSearchResultPageElement = styled.div`
  /*  */
  padding-top: ${sub_height}px;

  .container {
    position: relative;
  }
`;
