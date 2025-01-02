export default function routerReducer(state, action) {
    switch (action.type) {
      case "INIT_SERVICEWORKER":
        return { ...state, ...action.data };
      default:
        return state;
    }
  }
  

