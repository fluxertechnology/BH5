import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import store from "@/store";

export const postBindInviteAction = (parentid, intl) => {
  return function () {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    formData.append("parentid", parentid);
    axiosRequest
      .post(requestUrlConstants.postBindInviteUrl, formData)
      .then(() => {
        callToast(intl.formatMessage({ id: "TOAST.TIP.SUCCESS.BIND" }));
      });
  };
};

export const postBindEmailAction = (email, code, intl) => {
  return async function () {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    formData.append("email", email);
    formData.append("code", code);
    let res = await axiosRequest.post(requestUrlConstants.postVerifyEmailCode, formData)
    if (!res) return;
    res = await axiosRequest.post(requestUrlConstants.postVerifyEmailCode, formData)
    if (res) callToast(intl.formatMessage({ id: "TOAST.TIP.SUCCESS.BIND" }));
  };
};
