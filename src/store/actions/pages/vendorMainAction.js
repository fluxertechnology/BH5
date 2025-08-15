import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants, checkIsMobile } from "@/lib/constants";
import store from "@/store";
import { getVendorGameListAction as getVendorGameListActionFunc } from "@/store/reducers/cruds/vendor/vendorCRUD";

const {
  postVendeorAdvertiseUrl,
  postVendeorListUrlPC,
  postVendeorListUrlH5,
  postVendeorGameListUrl,
} = requestUrlConstants;

export const getVendorListAction = (page = 1, limit = 20) => {
  return function (dispatch) {
    const url = checkIsMobile()
      ? `https://18tao.shop/api/product/spu/lst?pid=1404&page=${page}&limit=${limit}&lang=zh-Hant`
      : `https://18tao.shop/api/product/spu/lst?lang=zh-Hans&page=${page}&limit=${limit}&keyword=&brand_id=&price_on=&price_off=&order=&cate_pid=1404&common=1`;

    axiosRequest.get(url).then((data) => {
      console.log(data,'data');
      dispatch({
        type:
          page === 1
            ? "INIT_VENDORCATEGORYIDDATA"
            : "APPEND_VENDORCATEGORYIDDATA",
        data,
      });
    });

    if (page === 1) {
      axiosRequest.get(postVendeorAdvertiseUrl).then((data) => {
        dispatch({
          type: "INIT_VENDORCATEGORYIDDATA_ADVERTISE",
          data,
        });
      });
    }
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
    getVendorGameListActionFunc(type, category_id).then((data) => {
      dispatch({
        type: "UPDATE_VENDORGAMELISTDATA",
        category_id,
        data,
      });
      scrollColdEnd();
    });
  };
};
