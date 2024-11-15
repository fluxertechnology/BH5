// import axiosRequest from "@/lib/services/axios";
// import { requestUrlConstants } from "@/lib/constants";

// const { postGetAnimeContent } = requestUrlConstants;

// export const getAnimeContentAction = (id, ep) => {
//   return function (dispatch) {
//     const formData = new FormData();
//     formData.append("aid", id);
//     formData.append("episode", ep);
//     axiosRequest.post(postGetAnimeContent, formData).then(data=>{
//       dispatch({
//         type: "INIT_ANIMESVIEW",
//         id,
//         ep,
//         data: data[0]
//       })
//     })
//   }
// }