import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";
import { postListDataLimit } from "../../reducers/post/postListData";

const { postGetPostDataListUrl } = requestUrlConstants;

/**
 * @description get post list data
 *
 * @param {*} data
 * @param {*} scrollColdEnd
 * @return {*}
 */
export const getPostListAction = (scrollColdEnd, attention, init) => {
  return function (dispatch) {
    let storeData = store.getState();
    let userData = storeData.user;
    let postData = attention ? storeData.postTrackData : storeData.postListData;
    let formData = new FormData();
    formData.append("uid", userData.id);
    formData.append("page", init ? 1 : postData.page + 1);
    formData.append("limit", postListDataLimit);
    if (attention) formData.append("is_attention", attention);
    axiosRequest.post(postGetPostDataListUrl, formData).then((data) => {
      scrollColdEnd(false);
      if (attention) {
        dispatch({
          type: init ? "INIT_POSTTRACKLIST" : "UPDATE_POSTTRACKLIST",
          data,
        });
      } else {
        dispatch({
          type: init ? "INIT_POSTLIST" : "UPDATE_POSTLIST",
          data,
        });
      }
    });
  };
};
