export default function userReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.data };
    default:
      return state;
  }
}
