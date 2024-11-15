import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants, checkIsMobile } from "@/lib/constants";
import store from "@/store";

const { getAnimeHome, postRefreshAnime } = requestUrlConstants;

/**
 * @description get server data
 *
 * @return {*}
 */
export const getHomeAnimeData = () => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("token", store.getState().user.id);
    axiosRequest
      .post(
        checkIsMobile() ? "/mobileapi/anime/home" : "/mobileapi/anime/pchome", //這個暫時這樣寫不然沒辦法再ipad轉向之後更新資料筆數
        formData
      )
      .then((data) => {
        dispatch({
          type: "INIT_HOMECATEGORY",
          data: data.category_list,
        });
        dispatch({
          type: "INIT_HOME_ANIME_DATA",
          data: {
            comic: data.comic_list,
            new: data.new_list,
            video: data.video_list,
          },
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
      comic: 1,
      video: 0,
      new: null,
    };

    let data = new FormData();

    if (key !== "new") {
      data.append("limit", checkIsMobile() ? 6 : key === "comic" ? 6 : 8);
      data.append("type", type[key]);
    } else {
      data.append("limit", 10);
    }

    axiosRequest.post(postRefreshAnime, data).then((data) => {
      dispatch({
        type: "UPDATE_HOME_ANIME_DATA",
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
