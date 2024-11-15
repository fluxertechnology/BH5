import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants, checkIsMobile } from "@/lib/constants";
import store from "@/store";
// import {getVendorGameListAction} from "@/store/reducers/cruds/vendor/vendorCRUD";
const {
  postVendeorAdvertiseUrl,
  postVendeorListUrlPC,
  postVendeorListUrlH5,
  postVendeorGameListUrl,
} = requestUrlConstants;

export const getVendorListAction = () => {
  return function (dispatch) {
    //商城商品
    axiosRequest
      .get(checkIsMobile() ? postVendeorListUrlH5 : postVendeorListUrlPC)
      .then((data) => {
        dispatch({
          type: "INIT_VENDORCATEGORYIDDATA",
          data: data,
        });
      });
    //18陶廣告
    axiosRequest.get(postVendeorAdvertiseUrl).then((data) => {
      dispatch({
        type: "INIT_VENDORCATEGORYIDDATA_ADVERTISE",
        data: data,
      });
    });
  };
};
/**
 * @description 拿取遊戲資料
 *
 * @param {number} type 0:all 1:pc 2:android
 * @param {number} category_id 分類ID
 * @return {*}
 */
export const getVendorGameListAction = (
  type = 0,
  category_id,
  scrollColdEnd = () => {}
) => {
  return function (dispatch) {
    let storeData = store.getState().vendorGameListData;
    let formData = new FormData();
    formData.append("page", storeData.page + 1);
    formData.append("limit", checkIsMobile() ? 10 : 12);
    formData.append("device", type);

    if (typeof category_id !== "number") {
      formData.append("category_id", category_id);
    }
    // utilities.getVendorGameListAction(type, category_id).then((data) => {
    //   dispatch({
    //     type: "UPDATE_VENDORGAMELISTDATA",
    //     category_id,
    //     data,
    //   });
    //   scrollColdEnd();
    // });
  };
};
