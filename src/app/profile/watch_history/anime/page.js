"use client";

import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import ParallelCoverCubeItem from "@/components/common/ParallelCoverCubeItem";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import { postSearchWatchHistoryAction } from "@/store/actions/pages/profileWatchHistory";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const ProfileWatchHistoryAnime = ({ disabledScrollRefresh }) => {
  const { state } = useGlobalContext();
  useEffect(() => getWatchHistory(0), []);

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
      getWatchHistory(0, scrollColdEnd);
    });
  }

  const getWatchHistory = (type) => {
    useGlobalDispatch(postSearchWatchHistoryAction(type));
    console.log(type,'type');
  };
  return (
    <ProfileWatchHistoryElement>
      <div className="profile_history_container">
        <Grid container direction="row" alignItems="start" spacing={2}>
          {state.myWatchHistory?.anime_video_list?.map((data, index) => (
            <Grid item md={12} xs={12} key={data.id}>
              <ParallelCoverCubeItem
                data={data}
                isVideo = {true}
                disabledBottomBorder={
                  index === state.myWatchHistory.anime_video_list.length - 1
                }
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </ProfileWatchHistoryElement>
  );
};

export default ProfileWatchHistoryAnime;

export const ProfileWatchHistoryElement = styled.div`
  /*  */
  padding-top: 5%;
  @media (min-width: 599px) {
    padding-top: 1%;
  }
  .profile_history_container {
    position: relative;
  }
`;
