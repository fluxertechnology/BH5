import { postListDataLimit } from "./postListData";

const postProfile = (
  state = {
    profile: {},
    postList: [],
    page: 0,
    isDone: false,
  },
  action
) => {

  switch (action.type) {
    case "INIT_POST_PROFILE":
      state.profile = action.data;
      return {
        ...state,
      };

    case "CLEAN_POST_PROFILE":
      state = {
        profile: {},
        postList: [],
        page: 0,
        isDone: false,
      };
      return {
        ...state,
      };

    case "INIT_POST_LIST":
      state.postList = action.data;
      state.page += 1;
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      }
      return {
        ...state,
      };

    case "UPDATE_POST_LIST":
      const set = new Set();
      let filterData = state;
      if (action.data.length) {
        filterData.postList.push(...action.data);
        filterData.postList = filterData.postList.filter((item) =>
          !set.has(item.id) ? set.add(item.id) : false
        );
        state.page += 1;
        if (action.data.length < postListDataLimit) {
          state.isDone = true;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POST_PROFILE_WATCH":
      for (let i = 0; i < state.postList.length; i++) {
        if (state.postList[i].id === action.id) {
          state.postList[i].fake_total_view = action.fake_total_view;
          break;
        }
      }
      return {
        ...state,
      };

    case "UPDATE_POST_PROFILE_LIKE":
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

    case "UPDATE_POST_PROFILE_ATTENTION":
      state.profile.is_attention = action.state;
      return {
        ...state,
      };

    case "UPDATE_POST_PROFILE_BUYMEDIA":
      for (let i = 0; i < state.postList.length; i++) {
        if (state.postList[i].id === action.id) {
          state.postList[i].lock_status = "0";
          break;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POST_PROFILE_SUBSCRIBEMEDIA":
      for (let i = 0; i < state.postList.length; i++) {
        if (
          state.postList[i].on_subscribe === 1 //訂閱貼文
        ) {
          state.postList[i].lock_status = "0";
        }
      }
      state.profile.is_subscript = 1;

      return {
        ...state,
      };

    default:
      return state;
  }
};

export default postProfile;
