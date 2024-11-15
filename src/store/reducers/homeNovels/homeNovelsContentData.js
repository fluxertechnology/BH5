const homeNovelsContentData = (state = {}, action) => {
  switch (action.type) {
    case "INIT_NOVELCONTENT":

      if(!state[action.id]) {
        state[action.id] = {}
      }
      
      state[action.id] = {
        ...state[action.id],
        is_collect: action.data.is_collect,
        ...action.data.novel
      };
      
      return {
        ...state
      }
      
    case "COLLECT_NOVELCONTENT":
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

export default homeNovelsContentData;