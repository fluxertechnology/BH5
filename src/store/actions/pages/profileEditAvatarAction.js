import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";

const { postUnClockAvatarUrl, postUnClockPersonalAvatarUrl } =
  requestUrlConstants;

// export const updateUserAvatarAction = (fileData) => {
//   return function (dispatch) {
//     let formData = new FormData();
//     formData.append("file", fileData);
//     axiosRequest
//       .post(
//         postUpdateUserAvatarUrl + "?uid=" + store.getState().user.id,
//         formData
//       )
//       .then((data) => {
//         dispatch(updateUserDataAction());
//       });
//   };
// };

// export const editUserDataAction = (data) => {
//   return function (dispatch) {
//     let formData = new FormData();

//     formData.append("uid", store.getState().user.id);
//     for (let key in data) {
//       formData.append(key, data[key]);
//     }

//     axiosRequest.post(postUpdateUserDataUrl, formData).then((data) => {
//       dispatch(updateUserDataAction());
//     });
//   };
// };

export const unClockAvatarAction = ({
  id,
  type = "init",
  callback = () => {},
}) => {
  return function (dispatch) {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    if (type === "init") {
      formData.append("avatar_id", id);
      axiosRequest.post(postUnClockAvatarUrl, formData).then(() => {
        dispatch({ type: "UPDATE_AVATAR_LIST", id: id });
        callback();
      });
    } else {
      axiosRequest.post(postUnClockPersonalAvatarUrl, formData).then(() => {
        callback();
      });
    }
  };
};
