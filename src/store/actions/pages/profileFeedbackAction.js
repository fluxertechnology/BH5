import { requestUrlConstants } from "@/lib/constants"
import axiosRequest from "@/lib/services/axios"
import callToast from "@/lib/services/toastCall";
import store from "@/store";

export const addFeedbackAction = (data, callback) => {
  return function (dispatch) {
    let formData = new FormData();
    formData.append("user_id", store.getState().user.id);
    formData.append("content", data.content);
    if(data.file[0]) {
      formData.append("img1", data.file[0].file);
    }else {
      formData.append("img1", undefined);
    }
    if(data.file[1]) {
      formData.append("img2", data.file[1].file);
    }else {
      formData.append("img2", undefined);
    }
    if(data.file[2]) {
      formData.append("img3", data.file[2].file);
    }else {
      formData.append("img3", undefined);
    }
    axiosRequest.post(requestUrlConstants.postAddFeedbackUrl, formData).then(data=>{
    }).catch(()=>{
      callToast("有点问题，请回报客服");
    }).finally(()=>{
      callback();
    })
  }
}