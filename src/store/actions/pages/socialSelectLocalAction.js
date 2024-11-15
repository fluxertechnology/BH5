import { requestUrlConstants } from "@/lib/constants"
import axiosRequest from "@/lib/services/axios"

const { getSocialLocalUrl } = requestUrlConstants;

export const getSocialLOCALAction = (callback) => {
  return function(dispatch) {
    axiosRequest.get(getSocialLocalUrl, {
      page: 1,
      limit: 999
    }).then(data=>{
      callback(data);
    })
  }
}