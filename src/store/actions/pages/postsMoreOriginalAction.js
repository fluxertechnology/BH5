import axiosRequest from "../../modules/axiosItem";
import { requestUrlConstants } from "../../constants";
import store from "../../store";
import { postListDataLimit } from "../../reducers/post/postRecommendList";

const { postGetRecommendOriginalListUrl } = requestUrlConstants;

/**
 * @description get post recommed list data
 *
 * @param {*} status
 * @param {*} scrollColdEnd
 * @return {*}
 */
export const postGetRecommendOriginal = (status, scrollColdEnd) => {
  return function (dispatch) {
    const storeData = store.getState();
    const formData = new FormData();
    let postRecommendList = storeData.postRecommendList;
    formData.append("page", status === "init" ? 1 : postRecommendList.page + 1);
    formData.append("limit", postListDataLimit);
    axiosRequest
      .post(postGetRecommendOriginalListUrl, formData)
      .then((data) => {
        if (status === "init") {
          dispatch({
            type: "INIT_POSTRECOMMENDLIST",
            data,
          });
        } else {
          dispatch({
            type: "UPDATE_POSTRECOMMENDLIST",
            data,
          });
        }
        scrollColdEnd(false);
      });
  };
};
