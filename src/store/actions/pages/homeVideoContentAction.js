import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";

// const { postGetVideoContent, getVideoContentRecommendUrl, postAddVideoCollect } = requestUrlConstants;
const { postAddVideoCollect } = requestUrlConstants;

// export const getVideoContentAction = (id, callback = () => {}) => {
//   return function(dispatch) {
//     let formData = new FormData();
//     formData.append('vid', id);
//     axiosRequest.post(postGetVideoContent, formData).then(data=>{
//       dispatch(getVideoContentRecommendAction(id));
//       dispatch({
//         type: "INIT_VIDEOCONTENT",
//         id,
//         data
//       })
//       callback();
//     })
//   }
// }

// export const getVideoContentRecommendAction = (id) => {
//   return function (dispatch) {
//     let formData = new FormData();
//     formData.append('vid', id);
//     axiosRequest.get(getVideoContentRecommendUrl, formData).then(data=>{
//       dispatch({
//         type: "ADD_VIDEOCONTENTRECOMMEND",
//         id,
//         data
//       })
//     })
//   }
// }

export const toggleVideoCollectAction = (data, callback = () => {}) => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("user_id", store.getState().user.id);
    formData.append("video_id", data.video_id);
    formData.append("type", data.type);
    formData.append("status", data.status);
    formData.append("vod_name", data.vod_name);
    formData.append("vod_pic", data.vod_pic);
    formData.append("vod_url", data.vod_url);
    const nowTab = store.getState().homeVideo.nowTab;
    
    axiosRequest.post(postAddVideoCollect, formData).then((res) => {
      if (res.code) {
        dispatch({
          type: "TOGGLE_VIDEOCONTENTCOLLECT",
          id: data.video_id,
          is_collect: data.status
        });
        dispatch({
          type: "TOGGLE_VIDEOLISTCOLLECT",
          id: data.video_id,
          nowTab,
          is_collect: data.status
        });
        callback();
      }
    });
  };
};
