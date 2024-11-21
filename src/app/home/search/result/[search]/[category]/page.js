"use client";

import { useTranslations } from "next-intl";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import CoverCubeItem from "@/components/common/CoverCubeItem";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useMemo } from "react";
import { useGlobalContext } from "@/store";
import Image from "next/image";
import { useParams } from "next/navigation";

function HomeSearchResultCategory() {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();

  const searchCategory = useParams().category;
  const localState = useMemo(() => {
    let pathneme = state.router.location.pathname.split("/");
    return {
      isEnd: state.homeSearchResultData[pathneme[4]]
        ? state.homeSearchResultData[pathneme[4]][searchCategory].isEnd
        : false,
      list: state.homeSearchResultData[pathneme[4]]
        ? [...state.homeSearchResultData[pathneme[4]][searchCategory].list]
        : [],
    };
  }, [state.homeSearchResultData, state.router.location.pathname]);

  return (
    <HomeSearchResultCategoryElement
      className={!isMobile ? "px-indent" : "p-2"}
    >
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
    </HomeSearchResultCategoryElement>
  );
}

export default HomeSearchResultCategory;

const HomeSearchResultCategoryElement = styled.div`
  /*  */
  display: flex;
  flex-wrap: wrap;
  margin-top: 1%;
  padding-left: 10%;
  padding-right: 10%;

  .empty {
    width: 100%;
    text-align: center;

    &_img {
      margin: 50px auto 10px;
      width: 120px;
      vertical-align: middle;
    }

    &_text {
      font-size: 14px;
      color: #777;
    }
  }
`;
