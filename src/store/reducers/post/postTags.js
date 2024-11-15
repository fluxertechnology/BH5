const postTags = function (
  state = {
    postTags: [],
    selectTags: [],
  },
  action
) {
  switch (action.type) {
    case "INIT_POSTTAGS":
      state.postTags = action.data;
      return state;

    case "SET_POSTSSELECTTAGS":
      state.selectTags = action.data;
      return state;
    case "CLEAN_POSTSSELECTTAGS":
      state.selectTags = [];
      return state;
    default:
      return state;
  }
};

export default postTags;
