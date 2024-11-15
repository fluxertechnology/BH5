import axiosRequest from "@/lib/services/axios"
import { requestUrlConstants } from "@/lib/constants"
import store from "@/store";

// const { postGetPhotoContent, postBuyDownloadPhoto } = requestUrlConstants;
const { postBuyDownloadPhoto } = requestUrlConstants;

// export const getPhotoContentAction = (id, callback) => {
//   return function(dispatch) {
//     axiosRequest.post(postGetPhotoContent + "?id=" + id).then(data=>{
//       callback(data[0]);
//       dispatch({
//         type: "INIT_PHOTOSCONTENT",
//         data: data[0],
//         id
//       })
//     })
//   }
// }


export const buyDownloadPhotoAction = (id, callback) => {
  return function(dispatch) {
    let userId = store.getState().user.id;
    let formData = new FormData();
    formData.append("uid", userId);
    formData.append("buy_id", id);
    axiosRequest.post(postBuyDownloadPhoto, formData).then(()=>{
      callback();
    })
  }
}