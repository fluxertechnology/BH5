"use client";

import LinkComponent from "@/components/common/LinkComponent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Make sure to import Cookies
import Image from "next/image";
import styled from "styled-components";
import Grid2 from "@mui/material/Grid2";
import { useState } from 'react';
import { QRCodeCanvas as QRCode } from "qrcode.react";
import useMediaQuery from "@/hooks/useMediaQuery";

import { colors, downloadPage, officialContact, profileService, profileFeedback, pageUrlConstants } from "@/lib/constants";
import BottomNavBar from "@/components/layout/Header/BottomNavBar";
const { home } = pageUrlConstants;

const MobileFooter = ({ locale }) => {
  const t = useTranslations();
  // const router = useRouter();

  // const changeLanguage = (newLocale) => {
  //     Cookies.set('NEXT_LOCALE', newLocale, { path: '/' }); // Set the new locale
  //     console.log(newLocale, 'Locale changed'); // Log the new locale
  //     router.push(`/${newLocale}`); // Navigate to the new locale route
  // };
  const { isMobile } = useMediaQuery();

  if(!isMobile) return<></>

  return (
    <div>
      <BottomNavBar />
    </div>
  );
};

export default MobileFooter;