import { postListDataLimit } from "./postListData";
const postSameTagList = (
  state = { list: [], page: 0, isDone: false },
  action
) => {
  switch (action.type) {
    case "INIT_POST_SAME_TAG_LIST":
      state.list = [...action.data];
      state.page = 1;
      state.isDone = false;
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      } else {
        state.isDone = false;
      }
      return { ...state };
    case "UPDATE_POST_SAME_TAG_LIST":
      const set = new Set();
      let filterData = state;
      filterData.list.push(...action.data);
      filterData.list = filterData.list.filter((item) =>
        !set.has(item.id) ? set.add(item.id) : false
      );
      state.page += 1;
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      }
      return {
        ...state,
      };
    case "UPDATE_POST_SAME_TAG_LIST_BUYMEDIA":
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].id === action.id) {
          state.list[i].lock_status = "0";
          break;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POST_SAME_TAG_LIST_SUBSCRIBEMEDIA":
      for (let i = 0; i < state.list.length; i++) {
        if (
          state.list[i].uid === action.uid &&
          state.list[i].on_subscribe === 1 //訂閱貼文
        ) {
          state.list[i].lock_status = "0";
        }
      }

      return {
        ...state,
      };
    case "UPDATE_POST_SAME_TAG_LIST_ATTENTION":
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].uid === action.id) {
          state.list[i].is_attention = action.state;
        }
      }

      return {
        ...state,
      };
    case "UPDATE_POST_SAME_TAG_LIST_LIKE":
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

    case "UPDATE_POST_SAME_TAG_LIST_WATCH":
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

export default postSameTagList;
