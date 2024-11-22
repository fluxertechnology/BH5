"use client";

import React from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import WebTopBar from "@/components/layout/Header/WebTopBar";
import { useGlobalContext } from "@/store";

const DesktopHeader = () => {
  const { state } = useGlobalContext();
  const { isMobile, isDesktop } = useMediaQuery();

  if(isMobile) return<></>
  
  return (
    <TopBarContainer>
      {state.navbar.customComponent() || <WebTopBar />}
    </TopBarContainer>
  );
};

export default DesktopHeader;
