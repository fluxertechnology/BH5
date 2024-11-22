"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import LeaderBoardCard from "@/components/index/leaderboard/LeaderBoardCard";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { getHomeLeaderBoardDataAction } from "@/store/actions/pages/homeLeaderboardAction";

const HomeLeaderboardComic = () => {
  const { state } = useGlobalContext();

  useEffect(() => {
    if (state.homeLeaderBoard.comic.length === 0) {
      getLeaderBoardData();
    }
  }, []);

  const getLeaderBoardData = () => {
    useGlobalDispatch(getHomeLeaderBoardDataAction(1));
  };
  return (
    <HomeLeaderboardComicRender>
      {state.homeLeaderBoard.comic.map((data, index) => {
        return (
          <LeaderBoardCard
            key={`${data.id}-${index}`}
            id={data.id}
            isComic={true}
            data={data}
            index={index}
          />
        );
      })}
    </HomeLeaderboardComicRender>
  );
};

export default HomeLeaderboardComic;

export const HomeLeaderboardComicRender = styled.div`
  /*  */
  @media (min-width: 599px) {
    max-width: 40%;
    min-width: 500px;
  }
`;
