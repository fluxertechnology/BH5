import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";
import { postListDataLimit } from "../../reducers/post/postRecommendFriendList";

const { postGetPostDataListUrl } = requestUrlConstants;

/**
 * @description get post list data 精選色友貼文
 *
 * @param {*} data
 * @param {*}
 * @param {*} scrollColdEnd
 * @return {*}
 */
export const getPostListAction = (scrollColdEnd, init) => {
  return function (dispatch) {
    let storeData = store.getState();
    let userData = storeData.user;
    let postData = storeData.postRecommendFriendList;
    let formData = new FormData();
    formData.append("uid", userData.id);
    formData.append("page", init ? 1 : postData.page + 1);
    formData.append("limit", postListDataLimit);
    formData.append("is_special", 1); // 1 = 精選色友參數
    axiosRequest.post(postGetPostDataListUrl, formData).then((data) => {
      scrollColdEnd(false);
      dispatch({
        type: init
          ? "INIT_POSTRECOMMEND_FRIEND_LIST"
          : "UPDATE_POSTRECOMMEND_FRIEND_LIST",
        data,
      });
    });
  };
};
