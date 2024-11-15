import userReducer from "./userReducer";
import themeReducer from "./themeReducer";
import routerReducer from "./routerReducer";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  router: routerReducer,
});

function combineReducers(reducers) {
  return function (state, action) {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}
export default rootReducer;
