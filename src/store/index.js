"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import rootReducer from "@/store/reducers";

const GlobalContext = createContext();

let context = null;

export function GlobalProvider({ children }) {
  const initialState = {};
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // FORTEST: on state change
  useEffect(() => {
    console.log("state changed", state);
  }, [state]);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  context = useContext(GlobalContext);
  return context;
}

export function useGlobalDispatch(callback) {
  if (!context) useContext(GlobalContext);
  return callback(context.dispatch);
}

const Store = {
  getState: () => {
    if (!context) useContext(GlobalContext);
    return context.state;
  },
};

export default Store;
