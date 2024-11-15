export default function themeReducer(state, action) {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, ...action.data };
    default:
      return state;
  }
}
