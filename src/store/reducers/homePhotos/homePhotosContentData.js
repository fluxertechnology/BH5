const homePhotosContentData = (state = {}, action) => {
  switch (action.type) {
    case "INIT_PHOTOSCONTENT":
    

      if(!state[action.id]) {
        state[action.id] = {}
      }
      
      state[action.id] = {
        ...state[action.id],
        is_collect: action.data.is_collect,
        ...action.data.photo
      };

      return {
        ...state
      }
      
    case "COLLECT_PHOTOSCONTENT":
      state[action.id].is_collect = state[action.id].is_collect ? 0 : 1;

      state[action.id] = {
        ...state[action.id]
      }

      return {
        ...state
      }

    default:
      return state
  }
}

export default homePhotosContentData;