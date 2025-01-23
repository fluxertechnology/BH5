import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import callToast from "@/lib/services/toastCall";
import { backRoutes } from "@/store/actions/historyActions";
import { updateUserDataAction } from "@/store/actions/user";
const { postBuyVendorGoods, postGetVendorGoods } = requestUrlConstants;

export const submitOrderAction = function (data, t) {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("uid", data.uid);
    formData.append("sid", data.sid);
    formData.append("select_pay_type", data.select_pay_type);
    if (data.to_username) formData.append("to_username", data.to_username);
    if (data.isActual) {
      formData.append("area", data.area);
      formData.append("address", data.address);
      formData.append("username", data.username);
      formData.append("phone", data.phone);
      formData.append("zip", data.area_code);
    }
    if (data.coupon_id) formData.append('coupon_id', data.coupon_id);
    axiosRequest.post(postBuyVendorGoods, formData).then((res) => {


      // Motamo检测付款成功订单
      if (data.select_pay_type == 0) {
        axiosRequest.post(postGetVendorGoods, formData).then(resItemData => {
          _paq.push(['trackEcommerceOrder',
            res.data, // (Required) orderId
            resItemData.yue, // (Required) grandTotal (revenue)
            0, // (Optional) subTotal
            0, // (optional) tax
            0, // (optional) shipping
            false // (optional) discount
          ]);
        })
      }


      // 更新用戶資料
      dispatch(updateUserDataAction());
      if (data.to_username) {
        callToast(t('Toast.send_success'));
      } else {
        callToast(t('Toast.buy_success'));
        window.sessionStorage.setItem('buyRecord', res);
        dispatch(backRoutes());
      }
    });
  };
};
