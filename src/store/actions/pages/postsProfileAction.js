import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";
import { postListDataLimit } from "../../reducers/post/postListData";

const { postGetPostDataSpecialListUrl, postGetRecommendOriginalProfileUrl } =
  requestUrlConstants;

/**
 * @description get post list data 精選色友貼文
 *
 * @param {*} data
 * @param {*}
 * @param {*} scrollColdEnd
 * @return {*}
 */
export const getPostListAction = (scrollColdEnd, init, type) => {
  return function (dispatch) {
    let storeData = store.getState();
    let userData = storeData.user;
    let postData = storeData.postProfile;
    let formData = new FormData();
    formData.append("uid", userData.id);
    formData.append("to_uid", storeData.router.location.pathname.split("/")[4]);
    formData.append("page", init ? 1 : postData.page + 1);
    formData.append("limit", postListDataLimit);
    switch (type) {
      //0 全部 1付費 2訂閱
      case 1:
        formData.append("is_topay", 1);
        break;
      case 2:
        formData.append("is_subscription", 1);
        break;
      default:
        break;
    }
    axiosRequest.post(postGetPostDataSpecialListUrl, formData).then((data) => {
      scrollColdEnd(false);
      dispatch({
        type: init ? "INIT_POST_LIST" : "UPDATE_POST_LIST",
        data,
      });
    });
  };
};

/**
 * @description get post notice data
 *
 * @param {*} data
 * @param {*} scrollColdEnd
 * @return {*}
 */
export const postGetProfile = () => {
  return function (dispatch) {
    const storeData = store.getState();
    const uid = storeData.user.id;
    const formData = new FormData();
    formData.append(
      "profile_id",
      storeData.router.location.pathname.split("/")[4]
    );
    formData.append("uid", uid);
    axiosRequest
      .post(postGetRecommendOriginalProfileUrl, formData)
      .then((data) => {
        dispatch({
          type: "INIT_POST_PROFILE",
          data,
        });
      });
  };
};
