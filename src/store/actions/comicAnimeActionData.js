import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";
import callToast from "@/lib/services/toastCall";

const { postGetComicAnimeData, postCollectComicAnime } = requestUrlConstants;

export const getComicAnimeContentAction = (
  id,
  ep,
  type,
  callback = () => {}
) => {
  return function (dispatch) {
    let userId = store.getState().user.id;
    let formData = new FormData();
    formData.append("aid", id);
    formData.append("recommend", 1);
    formData.append("episode", ep);
    if (userId !== "guest") formData.append("uid", userId);
    axiosRequest.post(postGetComicAnimeData, formData).then((data) => {
      dispatch({
        type,
        id: data.id,
        data,
      });
      callback(data);
    });
  };
};

export const collectComicAnimeContentAction = (id, type = 1) => {
  return function (dispatch) {
    const storeData = store.getState();
    let userId = storeData.user.id;
    let baseData =
      type === 1
        ? storeData.homeComicContentData
        : storeData.homeAnimesContentData;
    let data = baseData[id];
    if (userId !== "guest") {
      let formData = new FormData();
      formData.append("uid", userId);
      formData.append("aid", id);
      formData.append("status", data?.is_collect == "1" ? "0" : "1");
      axiosRequest.post(postCollectComicAnime, formData).then((quest) => {
        dispatch({
          type: type === 1 ? "COLLECT_COMICCONTENT" : "COLLECT_ANIMESCONTENT",
          id: id,
          state: data.is_collect == "1" ? "0" : "1",
        });
      });
    } else {
      callToast("请先登录后即可使用此功能");
    }
  };
};

export const collectComicAnimeAction = (data) => {
  return function (dispatch) {
    const storeData = store.getState();
    let userId = storeData.user.id;
    if (userId !== "guest") {
      let formData = new FormData();
      formData.append("uid", userId);
      formData.append("aid", data.id);
      formData.append("status", data.is_collect == "1" ? "0" : "1");
      axiosRequest.post(postCollectComicAnime, formData).then((quest) => {
        //更新首頁熱門動畫 本周新增
        dispatch({
          type: "UPDATE_HOME_ANIME_DATA_COLLECT",
          id: data.id,
        });
      });
    } else {
      callToast("请先登录后即可使用此功能");
    }
  };
};
