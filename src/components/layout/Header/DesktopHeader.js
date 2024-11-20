"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import WebTopBar from "@/components/layout/Header/WebTopBar";

const DesktopHeader = () => {
  const { isDesktop } = useMediaQuery();

  return <TopBarContainer>{isDesktop && <WebTopBar />}</TopBarContainer>;
};

export default DesktopHeader;
