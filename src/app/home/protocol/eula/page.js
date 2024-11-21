'use client';
import { useTranslations } from "next-intl";

import styled from "styled-components";
import { colors } from "@/lib/constants";
import { main_height } from "@/components/layout/Header/TopBarContainer"
import { preZhBlock } from "@/app/home/protocol/eula/font/zh";
import { preEnBlock } from "@/app/home/protocol/eula/font/en";
import Cookies from "js-cookie"; // Make sure to import Cookies
const HomeEULARender = () => {
  const t = useTranslations();
  function getNowText() {
    if (Cookies.get("NEXT_LOCALE") === "en") return preEnBlock;
    return preZhBlock;
  }
  return (
    <HomeEULAPageElement>
      <div className="EULA_title">
        {t("Home.eula_title")}
      </div>
      <div dangerouslySetInnerHTML={getNowText()} />
    </HomeEULAPageElement>
  );
};

export default HomeEULARender;

const HomeEULAPageElement = styled.div`
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
    box-sizing: content-box
  }
`;
