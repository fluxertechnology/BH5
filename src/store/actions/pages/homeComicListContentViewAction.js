// import { requestUrlConstants } from "@/lib/constants"
// import axiosRequest from "@/lib/services/axios"

// const { getComicViewPhotos } = requestUrlConstants;

// export const getComicViewPhotosAction = (id, ep) => {
//   return function (dispatch) {
//     let formData = new FormData();
//     formData.append("aid", id);
//     formData.append("episode", ep);
//     axiosRequest.post(getComicViewPhotos, formData).then(data=>{
//       dispatch({
//         type: "INIT_COMICVIEW",
//         id,
//         ep,
//         data
//       })
//     })
//   }
// }