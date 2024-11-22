'use client';
import { useTranslations } from "next-intl";

import styled from "styled-components";
import { colors } from "@/lib/constants";
import { main_height } from "@/components/layout/Header/TopBarContainer"
import { useGlobalContext } from "@/store";
import { useEffect } from "react";
import ProtocolComponent from "@/components/home/protocol/ProtocolComponent"

const HomeTSMRender = () => {
  const t = useTranslations();
  const { dispatch } = useGlobalContext();

  useEffect(() => {
    dispatch({type: "RESET_NAVBAR"});
  }, []);
  return (
    <HomeTSMPageElement>
      <div className="EULA_title">
        {t("Home.eula_title")}
      </div>
      <ProtocolComponent />
    </HomeTSMPageElement>
  );
};

export default HomeTSMRender;

const HomeTSMPageElement = styled.div`
  /*  */
  padding-top: ${main_height}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .EULA_title {
    place-self: self-start;
    font-weight: 600;
    font-size: 1.5rem;
    padding-left: 12em;
    padding-bottom: 1em;
  }
  pre {
    font-size: 1rem;
    white-space: pre-wrap;
    line-height: 1rem;
    background-color: ${colors.back_grey};
    padding: 2em 5em;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 70vh;
    max-width: 70vw;
    min-width: 1792px;
    @media (max-width: 899px) {
      min-width: 100%;
      max-width: unset;
    }
  }
`;
