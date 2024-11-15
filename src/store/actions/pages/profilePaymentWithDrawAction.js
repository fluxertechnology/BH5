import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";

export const postWithDrawAction = (amount, QQAccount) => {
  let formData = new FormData();
  formData.append("uid", store.getState().user.id);
  formData.append("amount", amount);
  formData.append("contact", QQAccount);
  return function (dispatch) {
    axiosRequest.post(requestUrlConstants.postWithDraw, formData).then(() => {
      callToast("提现申请完成，请等待审核");
      dispatch(updateUserDataAction());
    });
  };
};
