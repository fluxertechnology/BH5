'use client';
import { useTranslations } from "next-intl";
import { preZhBlock } from "@/components/home/protocol/font/zh";
import { preEnBlock } from "@/components/home/protocol/font/en";
// import { useEffect } from "react";
import Cookies from "js-cookie"; // Make sure to import Cookies
const ProtocolComponent = () => {
  const t = useTranslations();
  
  function getNowText() {
    if (Cookies.get("NEXT_LOCALE") === "en") return preEnBlock;
    return preZhBlock;
  }

  return (
    <div dangerouslySetInnerHTML={getNowText()} />
  );
};

export default ProtocolComponent;