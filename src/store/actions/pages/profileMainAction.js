import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";
import { getPremiumDiamond, getPriceUnit } from "@/lib/services/price";

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
          t("Toast.success_redemptioned") + getPremiumDiamond(t, data, true) + getPriceUnit(t),
        );
        dispatch(updateUserDataAction());
      });
  };
};
