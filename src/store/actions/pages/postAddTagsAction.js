import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import store from "@/store";

export const getPostAddTags = () => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("uid", store.getState().user.id);
    axiosRequest
      .post(requestUrlConstants.postGetPostTags, formData)
      .then((data) => {
        dispatch({
          type: "INIT_POSTTAGS",
          data,
        });
      });
  };
};

export const setPostSelectTags = (data) => {
  return function (dispatch) {
    dispatch({
      type: "SET_POSTSSELECTTAGS",
      data,
    });
  };
};
