import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import store from "@/store";
// export const getTransferMoneyRule = () => (dispatch) => {
//   axiosRequest.get(requestUrlConstants.getTransferMoneyRule).then((data) => {
//     dispatch({ type: "INIT_TRANSFERMONEY", data });
//   });
// };

export const getTransferHistory =
  (props, set, scrollColdEnd = () => {}) =>
  (dispatch) => {
    const token = store.getState().user.token;
    const { page, limit } = props;
    const formData = new FormData();
    formData.append("uid", token);
    formData.append("page", page || 1);
    formData.append("limit", limit || 5);
    axiosRequest
      .post(
        requestUrlConstants.getTransferMoneyHistory,
        formData,
        "已經沒有記錄了~"
      )
      .then((data) => {
        set((pre) => {
          if (pre) {
            const set = new Set();
            let filterData = [...pre, ...data];
            filterData.filter((item) =>
              !set.has(item.id) ? set.add(item.id) : false
            );
            return filterData;
          } else {
            return data;
          }
        });
        scrollColdEnd(false);
      });
  };
