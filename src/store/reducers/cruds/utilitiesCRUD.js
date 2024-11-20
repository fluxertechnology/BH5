import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";

const {
  getUserDailyView,
  postGetBuyRecord,
  postVerifyThenGetVideoContent,
  postVerifyThenGetNovelContent,
  postVerifyThenGetPhotoContentUrl,
  postVerifyThenGetAnimeContentUrl,
  postWatchHistory,
  getIdleHome,
  postSearchHistory,
  postAddFeedbackUrl,
} = requestUrlConstants;

/**
 * @export
 * @description 閒置頁 - 隨機顯示資料
 * @param {*}
 * @return {*}
 */
export const getIdleHomeData = () => {
  return axiosRequest.get(getIdleHome);
};

/**
 * @export
 * @param {*} id 動漫ID
 * @return {*}
 */
export const postAddWatchHistory = (id, episode, watchSecond) => {
  //新增觀看紀錄
  let token = store.getState().user.token;
  let formData = new FormData();
  formData.append("aid", id);
  formData.append("uid", token);
  formData.append("episode", episode);
  if (watchSecond) formData.append("second", watchSecond);
  return axiosRequest.post(postWatchHistory, formData);
};

/**
 * @export
 * @param {*} type 0:動畫 1:漫畫 沒帶:ALL
 * @return {*}
 */
export const postSearchWatchHistory = (type) => {
  //查詢觀看紀錄
  let token = store.getState().user.token;
  let formData = new FormData();
  if (type) formData.append("type", type);
  formData.append("uid", token);
  if (token) return axiosRequest.post(postSearchHistory, formData);
  return new Promise((resolve, reject) => {
    reject('[Get Watch History] No user token');
  });
};

/**
 * @export
 * @param {*} uid user.id
 * @param {*} itemId
 * @return {*}
 */
export const postVerifyThenGetVideo = (uid, itemId) => {
  //獲取影片驗證
  let formData = new FormData();
  formData.append("uid", uid);
  formData.append("vid", itemId);
  return axiosRequest.post(postVerifyThenGetVideoContent, formData);
};

/**
 * @export
 * @param {*} uid user.id
 * @param {*} itemId
 * @return {*}
 */
export const postVerifyThenGetAnime = (uid, itemId, episode) => {
  //獲取動漫驗證
  let formData = new FormData();
  formData.append("uid", uid);
  formData.append("aid", itemId);
  formData.append("episode", episode);
  return axiosRequest.post(postVerifyThenGetAnimeContentUrl, formData);
};

/**
 * @export
 * @param {*} uid user.id
 * @param {*} itemId
 * @return {*}
 */
export const postVerifyThenGetPhoto = (uid, itemId) => {
  //獲取照片驗證
  let formData = new FormData();
  formData.append("uid", uid);
  formData.append("pid", itemId);
  return axiosRequest.post(postVerifyThenGetPhotoContentUrl, formData);
};

/**
 * @export
 * @param {*} uid user.id
 * @param {*} itemId
 * @return {*}
 */
export const postVerifyThenGetNovel = (uid, itemId) => {
  //獲取小說驗證
  let formData = new FormData();
  formData.append("uid", uid);
  formData.append("nid", itemId);
  return axiosRequest.post(postVerifyThenGetNovelContent, formData);
};

/**
 * @export
 * @param {*} uid user.id
 * @param {*} itemId
 * @return {*}
 */
export const postGetBuyWithRecord = (uid, itemId, itemType) => {
  //購買紀錄
  let formData = new FormData();
  formData.append("user_id", uid);
  formData.append("buy_id", itemId);
  formData.append("type", itemType);
  return axiosRequest.post(postGetBuyRecord, formData);
};

/**
 * @export
 * @param {*} uid user.id
 * @return {*}
 */
export const getUserDailyWithView = (uid) => {
  // 獲得並增加每日觀影次數
  return axiosRequest.post(getUserDailyView, { userid: uid }, "no");
};

/**
 * @export
 * @param {*} uid user.id
 * @return {*}
 */
let oneTimeZzzzz = true;
export const postAddFeedback = (webVersion, handleDevToolCheckReport) => {
  // 打開開發者模式回報
  if (store.getState().user.id !== "guest" && oneTimeZzzzz) {
    oneTimeZzzzz = false;
    handleDevToolCheckReport();
    let formData = new FormData();
    formData.append("user_id", store.getState().user.id);
    formData.append("content", "");
    formData.append(
      "sys_report_msg",
      "版本: " +
        webVersion +
        " ，用户:" +
        store.getState().user.id +
        " ，侦测可能使用开发工具进行检查"
    );
    return axiosRequest.post(postAddFeedbackUrl, formData);
  }
};

/**
 * @export
 * @param {*} urlParameter
 * @return {*}
 */
export const utmTrackStars = (urlParameter) => {
  // Google UTM
  return axiosRequest.get(
    "https://tsyndicate.com/api/v1/cpa/action/" + urlParameter.tracking_param,
    {
      value: 0.23,
      lead_code: "a",
      key: "2yt4YiE551mrJfb83tNmhAitbDc3rYKin4db",
    }
  );
};

/**
 * @export
 * @param {*} urlParameter
 * @return {*}
 */
export const utmTrackJuicyads = (urlParameter) => {
  // Google UTM
  return axiosRequest.get("https://ck.juicyads.com/ilikeitjuicy.php", {
    u: 155706,
    s2s: urlParameter.s2s,
    token: "d037bae1b53059dd6aabf3996b0d2113",
    data: "dc2b4296a0c535e1890fa319e8f944e4",
    amount: 0.31,
  });
};
