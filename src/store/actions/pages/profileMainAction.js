import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";

export const dailyLoginAction = (intl) => {
  return function (dispatch) {
    axiosRequest
      .get(
        requestUrlConstants.getUserDailyLogin,
        {
          uid: store.getState().user.id,
        },
        intl.formatMessage({ id: "TOAST.TIP.SUCCESS.REDEMPTIONED" })
      )
      .then((data) => {
        callToast(
          intl.formatMessage({ id: "TOAST.TIP.SUCCESS.REDEMPTION" }) +
            data +
            intl.formatMessage({ id: "GLOBAL.GOLD_MONEY" })
        );
        dispatch(updateUserDataAction());
      });
  };
};
