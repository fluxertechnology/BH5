import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import store from "@/store";
export const getTransferMoneyRule = () => (dispatch) => {
  axiosRequest.get(requestUrlConstants.getTransferMoneyRule).then((data) => {
    dispatch({ type: "INIT_TRANSFERMONEY", data });
  });
};

export const postTransferMoney =
  (rule, callback = () => {}) =>
  (dispatch) => {
    const { id, money, transform_sign } = rule;
    let formData = new FormData();
    formData.append("uid", store.getState().user.token);
    formData.append("rule_id", id);
    formData.append("money", money);
    formData.append("transform_sign", transform_sign);
    axiosRequest
      .post(requestUrlConstants.postTransferMoney, formData, "兌換失敗")
      .then((data) => {
        if (data.code) {
          callback(true);
          dispatch({
            type: "UPDATE_USEMONEY",
            data: {
              money: getFloatStr(Number(store.getState().user.money) - money),
              sign: Number(store.getState().user.sign) + transform_sign,
            },
          });
        }else{
          callToast("Error")
        }
      });
  };
//讓數字取道小數後兩位
const getFloatStr = (num) => {
  num += "";
  num = num.replace(/[^0-9]\./g, "");
  if (/^0+/) num = num.replace(/^0+/, "");
  if (!/\./.test(num)) num += ".00";
  if (/^\./.test(num)) num = "0" + num;
  num += "00";
  num = num.match(/\d+\.\d{2}/)[0];
  return num;
};
