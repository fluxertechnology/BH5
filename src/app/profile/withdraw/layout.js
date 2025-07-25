"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import TopTabBar from "@/components/common/TopTabBar";
import { replaceRoutes } from "@/store/actions/historyActions";
import { pageUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import LinkComponent from "@/components/common/LinkComponent";

const { profile } = pageUrlConstants;
const ProfileWatchHistory = ({ children }) => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  return <div className="withdraw-container">{children}</div>;
};

export default ProfileWatchHistory;

export const ProfileWatchHistoryElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height", "sub_height"].includes(prop),
})`
  ${({ main_height, sub_height }) => `
    /*  */
    padding-top: ${main_height + sub_height}px;

    .withdraw-container {
        position: relative;
        width: 95.94vw;
    }
  `}
`;
