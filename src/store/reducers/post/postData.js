const postData = function (state = {}, action) {
  switch (action.type) {
    case "INIT_POSTDATA":
      state[action.id] = action.data;
      return {
        ...state,
      };

    case "UPDATE_POSTDATA":
      if (state[action.id]) {
        state[action.id].lock_status = "0";
        state[action.id].is_like = action.state;
        state[action.id].total_like = action.total_like;
      }

      return {
        ...state,
      };

    case "UPDATE_POSTDATA_ATTENTION":
      const targetKey = Object.keys(state).find(
        (key) => state[key].uid === action.id
      );
      if (state[targetKey]) {
        state[targetKey].is_attention = action.state;
      }

      return {
        ...state,
      };

    case "UPDATE_POSTDATA_WATCH":
      if (state[action.id]) {
        state[action.id].fake_total_view = action.fake_total_view;
      }

      return {
        ...state,
      };
    default:
      return state;
  }
};

export default postData;
