import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { updateSearchResultAction } from "@/store/actions/pages/homeSearchResultAction";
import Grid from "@mui/material/Grid";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTranslations } from "next-intl";
import { itemScrollBottomCallEvent } from "@/lib/services/scrollEvent";

const SearchResult = ({ show = true }) => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const t = useTranslations();

  const [isShow, setIsShow] = useState(show);
  const [searchCategory, setSearchCategory] = useState("SAC");
  const [searchInput, setSearchInput] = useState("");
  const updateSearchResult = (pathneme, scrollColdEnd = () => {}) => {
    let path = pathneme.split("/");
    if (path[0] && path[1]) {
      useGlobalDispatch(
        updateSearchResultAction(path[0], path[1], scrollColdEnd)
      );
    }
  };
  const onSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const onSearchInputKeydown = (e) => {
    if (e.key === "Enter") {
      updateSearchResult(`${searchInput}/${searchCategory}`);
    }
  };

  const localState = useMemo(() => {
    return {
      isEnd: state.homeSearchResultData[searchInput]
        ? state.homeSearchResultData[searchInput][searchCategory].isEnd
        : false,
      list: state.homeSearchResultData[searchInput]
        ? [...state.homeSearchResultData[searchInput][searchCategory].list]
        : [],
    };
  }, [state.homeSearchResultData, state.router.location.pathname]);

  function scrollEvent() {
    itemScrollBottomCallEvent(
      document.querySelector(".search_result_wrapper"),
      (scrollColdEnd) => {
        useGlobalDispatch(
          updateSearchResultAction(searchInput, searchCategory, scrollColdEnd)
        );
      }
    );
  }

  const closeSearch = () => {
    useGlobalDispatch({
      type: "UPDATE_NAVBAR",
      key: "isShowSearch",
      data: false,
    });
  };

  useEffect(() => {
    if (
      !state.homeSearchResultData[searchInput] ||
      state.homeSearchResultData[searchInput][searchCategory]?.page === 0
    ) {
      updateSearchResult(`${searchInput}/${searchCategory}`);
    }

    const searchResultWrapper = document.querySelector(
      ".search_result_wrapper"
    );
    searchResultWrapper.removeEventListener("scroll", scrollEvent);
    searchResultWrapper.addEventListener("scroll", scrollEvent);
  }, []);

  return (
    <SearchResultElement
      main_height={state.navbar.mainHeight}
      bottom_nav_height={state.navbar.bottomNavHeight}
    >
      <div className={state.navbar.isShowSearch ? "" : "hide"}>
        <div className="search_bar">
          <div className="search_bar_content">
            <input
              type="text"
              className="search_content_input"
              placeholder="搜寻你想要的..."
              enterKeyHint="search"
              value={searchInput}
              onChange={onSearchInputChange}
              onKeyDown={onSearchInputKeydown}
            />
            <div onClick={closeSearch}>X</div>
          </div>
        </div>

        <div className="search_result_wrapper">
          <div className="search_result_container">
            <Grid
              container
              direction="row"
              alignItems="center"
              spacing={isMobile ? 1 : 4}
            >
              {localState.list.map((data, index) => {
                return (
                  <Grid item md={2} xs={4} key={index}>
                    <CoverCubeItem data={data} total_view_show />
                  </Grid>
                );
              })}
            </Grid>
            {localState.isEnd && localState.list.length === 0 ? (
              <div className="empty">
                <Image
                  className="empty_img"
                  src="/images/imgPlaceholder/girl404.png"
                  width={0}
                  height={0}
                  alt="404 girl
          "
                />
                <p className="empty_text">{t("Global.tip.nothing")}</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </SearchResultElement>
  );
};

const SearchResultElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["main_height", "bottom_nav_height"].includes(prop),
})`
  ${({ main_height, bottom_nav_height }) => `
    .hide {
        display: none;
    }
    .search_bar {
        height: 65px;
        padding: 15px 30px;
        position: fixed;
        top: ${main_height}px;
        left: 0;
        background-color: #fff;
        width: 100%;
        border: 1px solid black;
        z-index: 11;
    }
    .search_bar_content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .search_content_input {
        width: 100%;
        height: 35px;
        background-color: #00000036;
        border-radius: 10px;
    }

    .search_result_wrapper {
        position: fixed;
        z-index: 11;
        top: ${main_height + 65}px;
        width: 100%;
        height: calc(100vh - ${main_height + 65 + bottom_nav_height}px);
        background-color: rgba(0, 0, 0, 0.7);
        overflow-y: auto;
    }
    .search_result_container {
        display: flex;
        flex-wrap: wrap;
        padding: 15px 30px;
    }
    .search_result_container > div {
        background-color: #fff;
    }
  `}
`;

export default SearchResult;
