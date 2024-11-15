import axiosRequest from "@/lib/services/axios"
import { requestUrlConstants, tokens } from "@/lib/constants"
import store from "@/store";
import { homePhotosListDataLimit } from "../../reducers/homePhotos/homePhotosListData";

const { postGetPhotosData } = requestUrlConstants;

export const getPhotosDataAction = (cateId, scrollColdEnd) => {
  return function (dispatch) {
    let storeData = store.getState();
    let user = storeData.user;
    let homePhotosListData = storeData.homePhotosListData;
    let formData = new FormData();
    formData.append("token", tokens[0]);
    formData.append("page", homePhotosListData[cateId] ? homePhotosListData[cateId].page + 1 : 1);
    formData.append("limit", homePhotosListDataLimit);
    formData.append("cateid", cateId);
    if(user.id !== "guest") formData.append("uid", user.id);

    axiosRequest.post(postGetPhotosData, formData).then(data=>{
      dispatch({
        type: "UPDATE_PHOTOSLISTDATA",
        cateId,
        data
      })
      
      for(let i = 0 ; i < data.length ; i++) {
        dispatch({
          type: "INIT_PHOTOSCONTENT",
          data: data[i],
          id: data[i].id
        })
      }

      scrollColdEnd(false);
    
    })
  }
}