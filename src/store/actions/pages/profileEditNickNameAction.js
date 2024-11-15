import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";

const { postUpdateUserAvatarUrl, postUpdateUserDataUrl } = requestUrlConstants;

export const updateUserAvatarAction = (fileData) => {
  return function (dispatch) {
    let formData = new FormData();
    formData.append("file", fileData);
    axiosRequest
      .post(
        postUpdateUserAvatarUrl + "?uid=" + store.getState().user.id,
        formData
      )
      .then((data) => {
        dispatch(updateUserDataAction());
      });
  };
};

export const editUserDataAction = (data, callback = () => {}) => {
  return function (dispatch) {
    let formData = new FormData();

    formData.append("uid", store.getState().user.id);
    for (let key in data) {
      formData.append(key, data[key]);
    }

    axiosRequest
      .post(postUpdateUserDataUrl, formData, "", true)
      .then((data) => {
        dispatch(updateUserDataAction());
        callback(data);
      });
  };
};
