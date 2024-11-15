const homeComicContentData = (state = {}, action) => {
  switch (action.type) {
    case "INIT_COMICVIEW":

      if(!state[action.id]) state[action.id] = {};
      state[action.id][action.ep] = action.data.anime;
      
      return {
        ...state
      }
    
    default:
      return state
  }
}

export default homeComicContentData;

