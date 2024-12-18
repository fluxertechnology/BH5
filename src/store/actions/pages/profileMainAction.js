import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";

export const dailyLoginAction = (t) => {
  return function (dispatch) {
    axiosRequest
      .get(
        requestUrlConstants.getUserDailyLogin,
        {
          uid: store.getState().user.id,
        },
        t("Toast.success_redemptioned")
      )
      .then((data) => {
        callToast(
          t("Toast.success_redemptioned") + data + t("Global.gold_money")
        );
        dispatch(updateUserDataAction());
      });
  };
};
