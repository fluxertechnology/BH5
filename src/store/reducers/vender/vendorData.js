const vendorData = function (state = {}, action) {
  switch (action.type) {
    case "INIT_VENDORDATA":

      state[action.id] = action.data;
      
      return {
        ...state
      }
    case "UPDATA_VENDORDATALIKE":
      if(state[action.id].is_like) {
        state[action.id].total_like -= 1;
      } else {
        state[action.id].total_like += 1;
      }
      state[action.id].is_like = state[action.id].is_like ? 0 : 1;
      return {
        ...state
      }
    default:
      return state;
  }
};

export default vendorData;
