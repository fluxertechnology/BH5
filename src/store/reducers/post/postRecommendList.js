import { decryptiedData } from "@/lib/services/aes";
export const postListDataLimit = 20;
const local = [];
const postRecommendList = (
  state = {
    list: local.postRecommendList?.list || [],
    page: 0,
    isDone: false,
  },
  action
) => {
  switch (action.type) {
    case "INIT_POSTRECOMMENDLIST":
      state.list = [...action.data];
      state.page = 1;
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      } else {
        state.isDone = false;
      }
      return { ...state };
    case "UPDATE_POSTRECOMMENDLIST":
      const set = new Set();
      let filterData = state;
      filterData.list.push(...action.data);
      filterData.list = filterData.list.filter((item) =>
        !set.has(item.uid) ? set.add(item.uid) : false
      );
      state.page += 1;
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      }
      return {
        ...state,
      };

    case "UPDATE_POSTRECOMMENDLIST_LIKE":
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].id === action.id) {
          state.list[i].is_like = action.state;
          state.list[i].total_like = action.total_like;
          break;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTRECOMMENDLIST_ATTENTION":
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].uid === action.id) {
          state.list[i].is_attention = action.state;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTTRECOMMENDLIST_WATCH":
      const find = state.list.find((item) => item.id === action.id);
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

export default postRecommendList;
