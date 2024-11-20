import * as utilitiesRequest from "@/store/reducers/cruds/utilitiesCRUD";

/**
 * @export
 * @param {*} type 0:動畫 1:漫畫 沒帶:ALL
 * @return {*}
 */
export const postSearchWatchHistoryAction = (type) => (dispatch) => {
  return utilitiesRequest
    .postSearchWatchHistory(type)
    .then((data) => {
      console.log(data, "data");
      if (data) {
        if (type) {
          dispatch({
            type: "INIT_MYWATCHHISTORY_COMIC",
            data,
          });
        } else {
          dispatch({
            type: "INIT_MYWATCHHISTORY_ANIME",
            data,
          });
        }
      }
    })
    .catch((err) => {
      console.log("Error", err);
    });
};
