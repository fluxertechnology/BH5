"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import LeaderBoardCard from "@/components/index/leaderboard/LeaderBoardCard";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { getHomeLeaderBoardDataAction } from "@/store/actions/pages/homeLeaderboardAction";

const HomeLeaderboardAnime = () => {
  const { state } = useGlobalContext();

  useEffect(() => {
    if (state.homeLeaderBoard.anime.length === 0) {
      getLeaderBoardData();
    }
  }, []);

  const getLeaderBoardData = () => {
    useGlobalDispatch(getHomeLeaderBoardDataAction(0));
  };
  return (
    <HomeLeaderboardAnimeRender>
      {state.homeLeaderBoard.anime.map((data, index) => {
        return (
          <LeaderBoardCard
            key={data.id}
            id={data.id}
            isComic={false}
            data={data}
            index={index}
          />
        );
      })}
    </HomeLeaderboardAnimeRender>
  );
};

export default HomeLeaderboardAnime;

export const HomeLeaderboardAnimeRender = styled.div`
  /*  */
  @media (min-width: 599px) {
    max-width: 40%;
    min-width: 500px;
  }
`;
