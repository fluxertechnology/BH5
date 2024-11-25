"use client";

import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import useMediaQuery from "@/hooks/useMediaQuery";
import { getTabDataAction } from "@/store/actions/pages/homeLabelAction";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useParams } from "next/navigation";

const HomeLabel = () => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();

  const { type, label } = useParams();
  const title = decodeURIComponent(label);
  useEffect(() => {
    if (!state.homeTagData[title]?.list?.length) {
      getTabData({
        type,
        tag_gp: title,
      });
    }

    window.removeEventListener("scroll", scrollEvent);
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
  }, []);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      getTabData(
        {
          type,
          tag_gp: title,
        },
        scrollColdEnd
      );
    });
  }

  function judeType(type) {
    switch (type) {
      case "0":
        return "animated";
      case "1":
        return "comic";
      default:
        return "video";
    }
  }

  const getTabData = (data, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getTabDataAction(data, scrollColdEnd));
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
              <TopTitleBar
                title={title}
                showBack={true}
                show_back_color="#ffffff"
              />
            </TopBarContainer>
          </>
        ),
      },
    });
  }, [isMobile]);

  return (
    <HomeLableElement main_height={state.navbar.mainHeight}>
      <div className="container">
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={isMobile ? 1 : 4}
        >
          {state.homeTagData[title]?.list?.map((data) => {
            return (
              <Grid
                item
                md={parseInt(type) ? 2 : 3}
                xs={parseInt(type) ? 4 : 6}
                key={data.id}
              >
                <CoverCubeItem data={data} type={judeType(type)} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </HomeLableElement>
  );
};

export default HomeLabel;

export const HomeLableElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding-top: ${main_height}px;
    margin-top: 2%;
    @media (min-width: 599px) {
        margin-left: 10%;
        margin-right: 10%;
    }

    .container {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.5em;
    }
 `}
`;
