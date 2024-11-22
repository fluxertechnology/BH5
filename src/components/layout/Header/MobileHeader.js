"use client";

import React from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopBar from "@/components/index/TopBar";
import { useGlobalContext } from "@/store";

const MobileHeader = () => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  
  if(!isMobile) return<></>

  return (
    <TopBarContainer>
      {state.navbar.customComponent() || <TopBar />}
    </TopBarContainer>
  );
};

export default MobileHeader;
