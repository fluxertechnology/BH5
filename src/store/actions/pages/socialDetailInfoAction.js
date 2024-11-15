import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";

const {
  getSocialProfileUrl,
  getBuySocialProfileUrl,
  postAddSocialProfileCollectUrl,
} = requestUrlConstants;

export const getProfileDataAction = (profileId) => {
  return function (dispatch) {
    axiosRequest
      .get(getSocialProfileUrl, {
        ofo_id: profileId,
        user_id: store.getState().user.id,
      })
      .then((data) => {
        dispatch({
          type: "UPDATE_SOCIALPROFILE",
          data,
        });
      });
  };
};

export const addProfileCollectAction = (profileId) => {
  return function (dispatch) {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    formData.append("ofo_id", profileId);
    formData.append(
      "status",
      store.getState().socialProfileData[profileId].is_like === "0" ? 1 : 0
    );
    axiosRequest.post(postAddSocialProfileCollectUrl, formData).then((data) => {
      dispatch({
        type: "UPDATE_SOCIALPROFILECOLLECT",
        id: profileId,
        data,
      });
    });
  };
};

export const getBuySocialProfileAction = (
  profileData,
  successCallback,
  failCallback
) => {
  return function (dispatch) {
    const userId = store.getState().user.id;
    axiosRequest
      .get(getBuySocialProfileUrl, {
        user_id: userId,
        ofo_id: profileData.id,
        type: 1,
      })
      .then((data) => {
        if (data.ts_status === "1") {
          callToast("购买成功");
          successCallback();
        } else if (data.ts_type === "1") {
          callToast("已经购买过");
        } else if (data.ts_type === "0") {
          callToast("购买失败, 精钻不足");
        }
      })
      .catch(() => {
        failCallback();
      })
      .finally(() => {
        dispatch(updateUserDataAction());
      });
  };
};
