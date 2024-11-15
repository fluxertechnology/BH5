import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";

const homeVideoContent = function (state = {}, action) {
  switch (action.type) {
    case "INIT_VIDEOCONTENT":
      if (!state[action.id]) {
        state[action.id] = {};
      }
      state[action.id] = {
        ...state[action.id],
        is_collect: action.data.is_collect,
        ...action.data.video,
      };

      return {
        ...state,
      };

    case "ADD_VIDEOCONTENTRECOMMEND":
      // 順序一定是先 init 才去拉推薦

      state[action.id].recommend = action.data;

      return {
        ...state,
      };

    case "TOGGLE_VIDEOCONTENTCOLLECT":
      if (state[action.id])
        state[action.id].is_collect = !state[action.id].is_collect;

      return {
        ...state,
      };

    default:
      return state;
  }
};

export default homeVideoContent;

export const getVideoContentRecommendAction = (id) => {
  return function (dispatch) {
    let formData = new FormData();
    formData.append("page", 1);
    formData.append("limit", 10);
    axiosRequest
      .post(requestUrlConstants.getVideoContentRecommendUrl, formData)
      .then((data) => {
        dispatch({
          type: "ADD_VIDEOCONTENTRECOMMEND",
          id,
          data,
        });
      });
  };
};
