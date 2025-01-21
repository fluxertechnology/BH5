'use client'

import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import ParallelCoverCubeItem from "@/components/common/ParallelCoverCubeItem";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import { postSearchWatchHistoryAction } from "@/store/actions/pages/profileWatchHistory";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const ProfileWatchHistoryComic = ({ disabledScrollRefresh }) => {
  const { state } = useGlobalContext();
  useEffect(() => getWatchHistory(), []);

  useEffect(() => {
    if (!disabledScrollRefresh) {
      window.addEventListener("scroll", scrollEvent);
      return () => {
        window.removeEventListener("scroll", scrollEvent);
      };
    }
  }, []);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      getWatchHistory(1, scrollColdEnd);
    });
  }

  const getWatchHistory = (type) => {
    useGlobalDispatch(postSearchWatchHistoryAction(type));
  };
  return (
    <ProfileWatchHistoryElement>
      <div className="profile_history_container">
        <Grid container direction="row" alignItems="start">
          {state.myWatchHistory?.anime_comic_list?.map((data, index) => (
            <Grid item md={12} xs={12} key={data.id}>
              <ParallelCoverCubeItem
                data={data}
                disabledBottomBorder={
                  index === state.myWatchHistory.anime_comic_list.length - 1
                }
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </ProfileWatchHistoryElement>
  );
};

export default ProfileWatchHistoryComic;

export const ProfileWatchHistoryElement = styled.div`
  /*  */
  padding-top: 5%;
  @media (min-width: 599px) {
    padding-top: 1%;
  }
  .profile_history_container {
    position: relative;
  }
  .list_item {
    &:last-of-type {
      &::after {
        content: none;
      }
    }
  }
`;
