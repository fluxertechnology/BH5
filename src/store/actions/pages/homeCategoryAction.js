import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import { categoryDataLimit } from "../../reducers/homeCategory/homeCategoryData";
import store from "@/store";

const { getHomeCategoryTabList, postGetCategoryData } = requestUrlConstants;

export const getCategoryListAction = (getTabHeight) => {
  return function (dispatch) {
    axiosRequest.get(getHomeCategoryTabList).then((data) => {
      dispatch({
        type: "INIT_HOMECATEGORYTABLIST",
        data,
      });
      getTabHeight();
    });
  };
};

export const restCategoryDataAction = (category) => {
  return {
    type: "RESET_CATEGORYDATA",
    category,
  };
};

//只有韓曼要帶category
export const getCategoryDataAction = (data, callback) => {
  return function (dispatch) {
    console.log(data, "data");
    let homeCategoryData = store.getState().homeCategoryData;
    let formdata = new FormData();
    formdata.append("type", data.type); // 1 漫畫 或 0 動畫
    formdata.append(
      "page",
      homeCategoryData[data.category]
        ? homeCategoryData[data.category].page + 1
        : 1
    );
    formdata.append("limit", categoryDataLimit);
    if (
      "韩漫".indexOf(data.category) != -1 ||
      "3D".indexOf(data.category) != -1 ||
      "同人".indexOf(data.category) != -1
    ) {
      formdata.append("category", data.category); // 大標題 不傳 不指定
    }
    if (data.is_free == 2) {
      formdata.set("category", "");
      formdata.append("limit_free_time", data.is_free - 1); // 1 免費 0 付費 不傳 全部
    }
    if (data.tag_gp.length !== 0) {
      formdata.append("tag_gp", data.tag_gp.join(",")); // 標籤 后宫,萝莉,女僕 不傳 全部
    }
    //if ("免费看".indexOf(data.category) !== -1) {
    //  formdata.append("limit_free_time", 1);
    //}
    // 查看 formdata
    // for (var pair of formdata.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    axiosRequest.post(postGetCategoryData, formdata).then((resData) => {
      dispatch({
        type: "UPDATE_CATEGORYDATA",
        category: data.category,
        kind: data.type,
        is_free: data.is_free,
        tag_gp: data.tag_gp,
        data: resData,
      });
      callback(false);
    });
  };
};
