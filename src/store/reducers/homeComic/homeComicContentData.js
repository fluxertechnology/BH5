const homeComicContentData = (state = {}, action) => {
  switch (action.type) {
    case "INIT_COMICCONTENT":
      
      state[action.id] = action.data;
      
      return {
        ...state
      }
    
    case "ADD_BUYCOMIC": 
      state[action.id].buy_episode.push(action.ep)

      return {
        ...state
      }
    
    case "COLLECT_COMICCONTENT":
      state[action.id].is_collect = action.state;
      return {
        ...state
      }
    default:
      return state
  }
}

export default homeComicContentData;

