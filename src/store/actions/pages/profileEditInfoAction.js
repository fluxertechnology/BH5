import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";

const { postUpdateUserAvatarUrl, postUpdateUserDataUrl, postGetAvatarListUrl } =
  requestUrlConstants;

export const updateUserAvatarAction = ({ file, avatar_id }) => {
  return function (dispatch) {
    let formData = new FormData();
    if (avatar_id) {
      formData.append("avatar_id", avatar_id);
      formData.append("type", 1);
    } else {
      formData.append("file", file);
    }

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

export const editUserDataAction = (data) => {
  return function (dispatch) {
    let formData = new FormData();

    formData.append("uid", store.getState().user.id);
    for (let key in data) {
      formData.append(key, data[key]);
    }

    axiosRequest.post(postUpdateUserDataUrl, formData).then((data) => {
      dispatch(updateUserDataAction());
    });
  };
};

export const getAvatarListAction = () => {
  return function (dispatch) {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    axiosRequest.post(postGetAvatarListUrl, formData).then((data) => {
      dispatch({ type: "ADD_AVATAR_LIST", avatar_list: data });
    });
  };
};
