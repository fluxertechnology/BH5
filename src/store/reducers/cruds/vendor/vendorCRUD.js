import { checkIsMobile, requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import store from "@/store";

const { postVendeorGameListUrl } = requestUrlConstants;

/**
 * @description 拿取遊戲資料
 *
 * @param {number} type 0:all 1:pc 2:android
 * @param {number} category_id 分類ID
 * @return {*}
 */

export const getVendorGameListAction = (type, category_id) => {
  let storeData = store.getState().vendorGameListData;
  let formData = new FormData();
  formData.append("page", storeData.page + 1);
  formData.append("limit", checkIsMobile() ? 10 : 12);
  formData.append("device", type);
  if (typeof category_id !== "number") {
    formData.append("category_id", category_id);
  }
  return axiosRequest.post(postVendeorGameListUrl, formData);
};


export default {
  sdfsdf:'sdfs'
}