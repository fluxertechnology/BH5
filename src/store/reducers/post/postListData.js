import { decryptiedData } from "@/lib/services/aes";

export const postListDataLimit = 20;
/**
 * @description post data
 *
 * @param {*} [state=null]
 * @param {*} action UPDATE_POSTLIST
 * @return {*}
 */
const local = typeof window !== "undefined" ? window.localStorage.getItem("contentData") : '{}';
const postListData = function (
  state = {
    postList: local
      ? JSON.parse(decryptiedData(local))?.postListData?.postList
      : [],
    page: 0,
    isNew: true,
    isDone: false,
  },
  action
) {
  switch (action.type) {
    case "INIT_POSTLIST":
      state.postList = [...action.data];
      state.page = 1;
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      } else {
        state.isDone = false;
      }
      return { ...state };
    case "UPDATE_POSTLIST":
      const set = new Set();
      let filterData = state;
      filterData.postList.push(...action.data);
      filterData.postList = filterData.postList.filter((item) =>
        !set.has(item.id) ? set.add(item.id) : false
      );
      state.page = state.page + 1;
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      }
      return {
        ...state,
      };

    case "UPDATE_POSTLIKE":
      for (let i = 0; i < state.postList.length; i++) {
        if (state.postList[i].id === action.id) {
          state.postList[i].is_like = action.state;
          state.postList[i].total_like = action.total_like;
          break;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTATTENTION":
      for (let i = 0; i < state.postList.length; i++) {
        if (state.postList[i].uid === action.id) {
          state.postList[i].is_attention = action.state;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTBUYMEDIA":
      for (let i = 0; i < state.postList.length; i++) {
        if (state.postList[i].id === action.id) {
          state.postList[i].lock_status = "0";
          break;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POST_SUBSCRIBE_MEDIA":
      for (let i = 0; i < state.postList.length; i++) {
        if (
          state.postList[i].uid === action.uid &&
          state.postList[i].on_subscribe === 1 //訂閱貼文
        ) {
          state.postList[i].lock_status = "0";
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTLISTDATAWATCH":
      const find = state.postList.find((item) => item.id === action.id);
      if (find) {
        find.fake_total_view = action.fake_total_view;
      }
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default postListData;
