import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
const { getQuestInfo } = requestUrlConstants;
import store from "@/store";

/**
 * @description get server data
 *
 * @return {*}
 */
export const getConfigData = () => {
  return function (dispatch) {
    axiosRequest.get(getQuestInfo).then((data) => {
      dispatch({
        type: "INIT_CONFIG",
        data,
      });
    });
  };
};

export const updateRechargeStateAction = (state) => {
  return {
    type: "UPDATE_RECHARGE",
    state,
  };
};

export const updateScrollToTopStateAction = (boolean) => {
  const state = store.getState();
  if (state.scrollToTopStatus === boolean) return () => {};
  return function (dispatch) {
    dispatch({
      type: "UPDATE_SCROLLTOTOP",
      status: boolean,
    });
  };
};
