"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import rootReducer from "@/reducers";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const initialState = {
  };

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
