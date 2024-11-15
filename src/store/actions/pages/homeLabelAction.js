import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import { tabDataLimit } from "../../reducers/homeCategory/homeTagData";
import store from "@/store";


const { postGetCategoryData } = requestUrlConstants;


export const getTabDataAction = (data, callback) => {
  return function(dispatch) {
    let homeTagData = store.getState().homeTagData;
    if(!homeTagData[data.tag_gp] || !homeTagData[data.tag_gp].isEnd) {
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("tag_gp", data.tag_gp);
      formData.append("page", homeTagData[data.tag_gp] ? homeTagData[data.tag_gp].page + 1 : 1);
      formData.append("limit", tabDataLimit);
      axiosRequest.post(postGetCategoryData, formData).then(resData=> {
        dispatch({
          type: "UPDATE_TAGDATA",
          tag_gp: data.tag_gp,
          data: resData
        })
        callback(false);
      })
    }
  }
}