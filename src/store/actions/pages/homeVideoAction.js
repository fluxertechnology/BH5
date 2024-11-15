import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants, tokens } from "@/lib/constants";
import store from "@/store";
const { getHomeVideoTagList, postGetVideoCateData } = requestUrlConstants;

/**
 * @description get video home tag data
 *
 * @return {*}
 */
export const getHomeVideoData = () => {
  return function (dispatch) {
    axiosRequest.get(getHomeVideoTagList).then((data) => {
      dispatch({
        type: "INIT_HOMEVIDEOLISTDATA",
        data,
      });
    });
  };
};

/**
 * @description set now tab
 *
 * @param {*} cateid
 * @return {*}
 */
export const setNowTabList = (cateid) => {
  return {
    type: "SETHOMEVIDEO_NOWTAB",
    cateid,
  };
};

/**
 * @description getCateVideoData
 *
 * @param {*} cateid
 * @param {*} page
 */
export const getCateVideoData = (cateid, scrollColdEnd) => {
  return function (dispatch) {
    let videoListData = store.getState().homeVideoList[cateid];
    if (videoListData) {
      let formData = new FormData();
      formData.append("token", tokens[0]);
      formData.append("uid", store.getState().user.id);
      formData.append("page", videoListData.page + 1);
      formData.append("limit", 30);
      formData.append("cateid", cateid);
      axiosRequest.post(postGetVideoCateData, formData).then((data) => {
        scrollColdEnd(false);
        dispatch({
          type: "UPDATE_VIDEOLIST",
          cateid: cateid,
          data,
        });
      });
    }
  };
};
