const homeLeaderBoard = (state = {
  comic: [],
  anime: []
}, action) => {
  switch (action.type) {
    case "INIT_HOMELEADERBOARD":

    console.log(action.data,'comic data')
      state[action.key] = [...action.data]
      
      return state;

    default:
      return state
  }
}

export default homeLeaderBoard;