import axiosRequest from "../../modules/axiosItem";
import { requestUrlConstants } from "../../constants";
import store from "../../store";
import { postListDataLimit } from "../../reducers/post/postListData";

const { postGetPostDataListUrl, postGetPostTags } = requestUrlConstants;

/**
 * @description get post list data
 *
 * @param {*} data
 * @param {*} scrollColdEnd
 * @return {*}
 */
export const getPostSameTagListAction = (scrollColdEnd, init) => {
  return function (dispatch) {
    let storeData = store.getState();
    let userData = storeData.user;
    let postSameTagList = storeData.postSameTagList;
    let formData = new FormData();
    formData.append("uid", userData.id);
    formData.append("page", init ? 1 : postSameTagList.page + 1);
    formData.append("limit", postListDataLimit);
    formData.append("tag", storeData.router.location.pathname.split("/")[4]);
    axiosRequest.post(postGetPostDataListUrl, formData).then((data) => {
      scrollColdEnd(false);
      dispatch({
        type: init ? "INIT_POST_SAME_TAG_LIST" : "UPDATE_POST_SAME_TAG_LIST",
        data,
      });
    });
  };
};

export const getPostTags = () => {
  return function (dispatch) {
    axiosRequest.post(postGetPostTags).then((data) => {
      dispatch({
        type: "INIT_POSTTAGS",
        data,
      });
    });
  };
};
