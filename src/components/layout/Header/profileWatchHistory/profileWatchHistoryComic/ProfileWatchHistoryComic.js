import { useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import styled from "styled-components";
import { useGlobalContext, useGlobalDispatch } from "@/store";

import ParallelCoverCubeItem from "@/components/layout/header/ParallelCoverCubeItem";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";

const ProfileWatchHistoryComic = ({
  getWatchHistory,
  disabledScrollRefresh,
}) => {
  const { state } = useGlobalContext();
  let dataList = state.myWatchHistory["anime_comic_list"] || [];
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => useGlobalDispatch(postSearchWatchHistoryAction(1)), []); //cant find postSearchWatchHistoryAction yet

  useEffect(() => {
    if (!disabledScrollRefresh) {
      window.addEventListener("scroll", scrollEvent);
      return () => {
        window.removeEventListener("scroll", scrollEvent);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      // getWatchHistory(1, scrollColdEnd);
      // useGlobalDispatch(postSearchWatchHistoryAction(1, scrollColdEnd), []);  //cant find postSearchWatchHistoryAction yet
    });
  }
  return (
    <ProfileWatchHistoryElement>
      <div className="profile_history_container">
        <Grid2 container direction="row" alignItems="start">
          {dataList.map((data, index) => (
            <Grid2 item md={12} xs={12} key={data.id}>
              <ParallelCoverCubeItem
                data={data}
                disabledBottomBorder={index === dataList.length - 1}
              />
            </Grid2>
          ))}
        </Grid2>
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
