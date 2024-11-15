import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants, checkIsMobile } from "@/lib/constants";
import store from "../..";

const { getNewAnimeHome, postRefreshAnime, postContinueHistory } =
  requestUrlConstants;

/**
 * @description get newIndex data
 *
 * @return {*}
 */
export const getHomeData = () => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("token", store.getState().user.id);
    axiosRequest.post(getNewAnimeHome, formData).then((data) => {
      dispatch({
        type: "INIT_HOME_DATA",
        data: data,
      });
    });
  };
};

/**
 * @description get anime watch second history data
 * @description must have value  [limit]
 * @return {*}
 */
export const getContinueWatchData = () => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("uid", store.getState().user.id);
    axiosRequest.post(postContinueHistory, formData).then((data) => {
      dispatch({
        type: "UPDATE_HOME_DATA",
        key: "anime_watch_history",
        data: data.anime_video_list,
      });
      dispatch({
        type: "UPDATE_HOME_DATA",
        key: "comic_watch_history",
        data: data.anime_comic_list,
      });
    });
  };
};

/**
 * @description refresh anime data
 *
 * @param {*} key
 * @return {*}
 */
export const refreshAnimeData = (key) => {
  return function (dispatch) {
    const type = {
      hot_comic_list: 1,
      hot_anime_list: 0,
      new: null,
    };

    let data = new FormData();

    if (key !== "new") {
      data.append("limit", checkIsMobile() ? 24 : 8);
      data.append("type", type[key]);
    } else {
      data.append("limit", 10);
    }

    axiosRequest.post(postRefreshAnime, data).then((data) => {
      console.log(key, "key");
      dispatch({
        type: "UPDATE_HOME_DATA",
        key,
        data,
      });
    });
  };
};

// export const refreshAnimeData = (key) => {
//   return function (dispatch) {
//     const type = {
//       comic: 1,
//       video: 0,
//       new: null
//     }

//     let data = new FormData();
//     data.append("limit", 10);
//     if(key !== "new") {
//       data.append("limit", 6);
//       data.append("type", type[key]);
//     }
//     axiosRequest.post(postRefreshAnime, data).then(data => {
//       console.log(data,'data')
//       dispatch({
//         type: "UPDATE_HOME_ANIME_DATA",
//         key,
//         data
//       })
//     });
//   }
// }
