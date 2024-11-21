import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import user from "../../reducers/user";
import store from "@/store";

const { postGetSearchList } = requestUrlConstants;

export const updateSearchResultAction = (search, kind, callback) => {
  return function(dispatch) {
    let homeSearchResultData = store.getState().homeSearchResultData;
    
    if(!homeSearchResultData[search] || !homeSearchResultData[search][kind].isEnd) {

      let formData = new FormData();
      formData.append("keyword", decodeURIComponent(search));
      formData.append("type", kind);
      formData.append("limit", 15);
      formData.append("page", homeSearchResultData[search] ? (homeSearchResultData[search][kind].page + 1) : 1);

      if(user.id) {
        formData.append("uid", user.id);
      }

      axiosRequest.post(postGetSearchList, formData).then(data=>{
        dispatch({
          type: "UPDATE_SEARCHRESULT",
          data: data,
          search,
          kind
        })
        callback(false);
      })
    }else {
      callback(false);
    }

  }
}


export const addHistoryTabAcion = (tab) => {
  return function (dispatch) {
    let tablist = window.localStorage.getItem("historyTab") || "[]";

    tablist = JSON.parse(tablist);

    if(!!tab && tablist.indexOf(tab) === -1) {
      tablist.push(tab);
    }

    window.localStorage.setItem("historyTab", JSON.stringify(tablist));

    dispatch({
      type: "ADD_HISTORYTAB",
      tab: tab
    });

  }
}