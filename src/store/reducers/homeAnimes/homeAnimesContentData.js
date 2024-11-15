const homeAnimesContentData = (state = {}, action) => {
  switch (action.type) {
    case "INIT_ANIMESCONTENT":
      state[action.id] = action.data;

      return {
        ...state,
      };

    case "ADD_BUYANIMES":
      state[action.id].buy_episode.push(action.ep);

      return {
        ...state,
      };

    case "COLLECT_ANIMESCONTENT":
      if (state[action.id]) state[action.id].is_collect = action.state;
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default homeAnimesContentData;
