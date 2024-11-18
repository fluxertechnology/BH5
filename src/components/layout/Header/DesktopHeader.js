"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useMediaQuery from "@/hooks/useMediaQuery";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import WebTopBar from "@/components/layout/Header/WebTopBar";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import {
  main_height,
  sub_height,
} from "@/components/layout/Header/TopBarContainer";

const DesktopHeader = ({ locale }) => {
  const t = useTranslations("Navbar");
  const router = useRouter();

  const changeLanguage = (newLocale) => {
    Cookies.set("NEXT_LOCALE", newLocale, { path: "/" });
    router.refresh();
  };

  const { isDesktop, isTablet, isMobile, isTouchDevice } = useMediaQuery();

  return (
    <HomeMainSwitchPageElement>
      <TopBarContainer>{isDesktop && <WebTopBar />}</TopBarContainer>
    </HomeMainSwitchPageElement>
  );
};

const HomeMainSwitchPageElement = styled.div`
  /*  */
  padding-top: ${main_height + sub_height}px;
  position: relative;
  @media (max-width: 899px) {
    padding-bottom: ${bottom_nav_height}px;
  }
  .float_category {
    position: fixed;
    overflow: scroll;
    top: ${main_height + sub_height}px;
    right: 0;
    z-index: 10;
    background-color: #fff;
    padding: 10px 0;
    border-radius: 5px;
  }

  .container {
    position: relative;
  }

  .recharge {
    cursor: pointer;
    position: relative;
    &_float_time {
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: center;
      width: 100%;
      color: #fff;
      padding: 1px 0;
      &_bg {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
        background-color: #010001;
        opacity: 0.55;
        z-index: 9;
      }
      &_text {
        z-index: 10;
      }
    }
  }
`;

export default DesktopHeader;
