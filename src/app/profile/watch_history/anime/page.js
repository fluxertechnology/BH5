import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";

import ParallelCoverCubeItem from "@/components/common/ParallelCoverCubeItem";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";

const ProfileWatchHistoryAnime = ({
  dataList,
  getWatchHistory,
  disabledScrollRefresh,
}) => {
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
  return (
    <ProfileWatchHistoryElement>
      <div className="profile_history_container">
        <Grid container direction="row" alignItems="start" spacing={2}>
          {dataList.map((data, index) => (
            <Grid item md={12} xs={12} key={data.id}>
              <ParallelCoverCubeItem
                data={data}
                isVideo
                disabledBottomBorder={index === dataList.length - 1}
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
