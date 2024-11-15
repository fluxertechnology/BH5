import { requestUrlConstants } from "@/lib/constants"
import axiosRequest from "@/lib/services/axios"
import store from "@/store";

const { postGetVendorGoods, postVendorGoodsLikeUrl } = requestUrlConstants;

export const getVendorGoodsAction = (goodsId) => {
  return function(dispatch) {
    let formData = new FormData();
    const userid = store.getState().user.id;
    if(userid !== "guest") formData.append("uid", userid);
    formData.append("sid", goodsId);
    axiosRequest.post(postGetVendorGoods, formData).then(data=>{
      dispatch({
        type: "INIT_VENDORDATA",
        id: goodsId,
        data: data
      });
    })
  }
}

export const likeVendorGoodsAction = (goodsId) => {
  return function(dispatch) {
    let storeData = store.getState();
    let formData = new FormData();
    formData.append("uid", storeData.user.id);
    formData.append("sid", goodsId);
    formData.append("status", storeData.vendorData[goodsId].is_like ? 0 : 1);
    axiosRequest.post(postVendorGoodsLikeUrl, formData).then(data=>{
      dispatch({        
        type: "UPDATA_VENDORDATALIKE",
        id: goodsId,
      });
    })
  }
} 