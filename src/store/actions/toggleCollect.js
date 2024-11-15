import store from "@/store";
import axiosRequest from "@/lib/services/axios"
import { pageUrlConstants, requestUrlConstants } from "@/lib/constants"
import { pushRoutes } from "./historyActions";

const { login } = pageUrlConstants;

const { postToggleCollect } = requestUrlConstants;

export const toggleCollectAction = (data) => {
  return function(dispatch) {
    let user = store.getState().user;
    if(user.id === "guest") {

      dispatch(pushRoutes(login.pages.loginMain));

    } else {
      let formData = new FormData();
      formData.append("uid", user.id);
      formData.append("type", data.type); // 0 小說 1 美圖
      formData.append("cid", data.id);
      formData.append("status", data.status); // 1 ok 0 not
  
      axiosRequest.post(postToggleCollect, formData).then(()=>{
        switch (data.type) {
          case 0:
            toggleNovelsCollect(data.id, dispatch);
            break;
          case 1:
            togglePhotosCollect(data.id, dispatch);
            break;
        
          default:
            break;
        }
      })
    }
  }
}


function toggleNovelsCollect (id, dispatch) {
  dispatch({
    type: "COLLECT_NOVELCONTENT",
    id
  })
}

function togglePhotosCollect (id, dispatch) {
  dispatch({
    type: "COLLECT_PHOTOSCONTENT",
    id
  })
}
