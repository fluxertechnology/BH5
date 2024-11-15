"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import rootReducer from "@/store/reducers";

const GlobalContext = createContext();

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
  return useContext(GlobalContext);
}

const Store = {
  getState: () => {
    return useGlobalContext().state;
  },
};

export default Store;
