import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
const { getBannerList } = requestUrlConstants;

/**
 * @description set ads data on 3 step null => {} => {***: ***}
 *
 * @return {*} 
 */
export const getAdsData = () => {
  return function (dispatch) {
    dispatch({
      type: "INIT_ADS",
      data: {}
    })
    axiosRequest.get(getBannerList).then(data => {
      dispatch({
        type: "INIT_ADS",
        data
      })
    })
  }
}