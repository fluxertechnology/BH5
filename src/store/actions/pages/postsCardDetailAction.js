import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import store from "@/store";

export const getPostCardDetailAction = (postId) => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("uid", store.getState().user.id);
    formData.append("dynamic_id", postId);
    axiosRequest
      .post(requestUrlConstants.postGetPostDataUrl, formData)
      .then((data) => {
        dispatch({
          type: "INIT_POSTDATA",
          id: postId,
          data,
        });
      });
  };
};
