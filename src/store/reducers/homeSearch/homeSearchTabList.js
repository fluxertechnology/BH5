
const homeSearchTabList = (state = {
  hotTab: [],
  historyTab: []
}, action)=> {
  switch (action.type) {
    case "INIT_SEARCHTABLIST":

      state.hotTab = [...action.hotTab];
      state.historyTab = [...action.historyTab];
      
      return {
        ...state
      }

    case "ADD_HISTORYTAB":
      if(state.historyTab.indexOf(action.tab) !== -1) {
        state.historyTab.splice(state.historyTab.indexOf(action.tab), 1);
      }

      state.historyTab = [ action.tab, ...state.historyTab];

      return {
        ...state
      }
    
    case "CLEAR_HISTORYTAB":
      state.historyTab = [];
      
      return {
        ...state
      }
    
    default:
      return state;
  }
}

export default homeSearchTabList;