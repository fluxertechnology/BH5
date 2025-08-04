"use client";

import { webVersion } from "@/lib/constants";
import store from "@/store";
import axiosRequest from "@/lib/services/axios";

const handleClickaduPostback = (payout) => {
  const clickadu = localStorage.getItem("bh5_clickadu");
  if (!clickadu) {
    console.warn("No Clickadu found in localStorage.");
    return;
  }
  const clickaduData = JSON.parse(clickadu);
  if (!clickaduData.SUBID) {
    console.warn("No SUBID found in Clickadu data.");
    return;
  }
  const clickaduPostbackUrl = `https://sconvtrk.com/conversion/fb523d080bdeff9b0870b2327ea24fc51b381a55/?visitor_id=${clickaduData.SUBID}&aid=269195&payout=${payout || 0}`;

  fetch(clickaduPostbackUrl);
};

const handleActiveRevenuePostback = (payout) => {
  const activerevenue = localStorage.getItem("bh5_ar");
  if (!activerevenue) {
    console.warn("No ActiveRevenue found in localStorage.");
    return;
  }
  const activerevenueData = JSON.parse(activerevenue);
  if (!activerevenueData.subid) {
    console.warn("No subid found in ActiveRevenue data.");
    return;
  }
  const arPostbackUrl = `https://xml.pdn-1.com/conversion?id=3181986&c=${activerevenueData.event}&count=1&value=${payout || 0}`;

  fetch(arPostbackUrl);
};

/**
 * @description when ad has been click return to google
 *
 * @param { object } adData
 */
const handleAdClick = function (adData = null) {
  if (adData) {
    window.dataLayer.push({
      event: "clickAds",
      ads_name: adData.name,
      ads_position: adData.cname,
    });
  }
};

/**
 * @description when download has been click return to google
 *
 * @param { object } adData
 */
const handleApkClick = function () {
  window.dataLayer.push({
    event: "clickDownloadApk",
    utm_source: utm_source,
  });
};

/**
 * @description when skip download has been click return to google
 *
 * @param { object } adData
 */
const handleSkipApkClick = function () {
  window.dataLayer.push({
    event: "clickSkipApk",
    utm_source: utm_source,
  });
};

/**
 * @description GA4 page view event
 *
 * @param { object } location react location
 * @param { object } user useContext user
 */
const handleChangePage = function (location) {
  window.dataLayer.push({
    event: "pageview",
    page_location: location.path,
    page_title: location.name,
    web_version: webVersion,
    user_id: store.getState().user.id,
    utm_source: utm_source,
  });
};

const handleRegisterAccount = function () {
  window.dataLayer.push({
    event: "registerAccount",
    utm_source: utm_source,
  });
  handleClickaduPostback(0.28);
  handleActiveRevenuePostback(0.28);
};

const handleDevToolCheckReport = function () {
  axiosRequest.get("https://api.ipify.org").then((ip) => {
    window.dataLayer.push({
      event: "webDevToolCheckReport",
      user_id: store.getState().user.id,
      web_version: webVersion,
      user_browser: navigator.userAgent,
      user_ip: ip,
      utm_source: utm_source,
    });
  });
};

// 先從 utilities.js 複製過來使用避免循環依賴
const checkDataExpired = function (localStorageKey = "test", time = 1000) {
  if (typeof window === "undefined") return false;
  const timestamp = localStorage.getItem(localStorageKey)
    ? JSON.parse(localStorage.getItem(localStorageKey))
    : 0;
  const nowTime = Date.now();
  if (nowTime >= timestamp + time) {
    return true;
  } else {
    return false;
  }
};

const getUtmSource = function () {
  let urlParameter = false;
  if (typeof window === "undefined") {
    return {
      shareMa: "",
      utm_source: "",
    };
  }
  if (!checkDataExpired("urlParameterTimestamp", 1000 * 60 * 60 * 24)) {
    urlParameter = localStorage.getItem("utmMark")
      ? JSON.parse(localStorage.getItem("utmMark"))
      : {};
  }
  return urlParameter;
};

// 先看分享碼，然後在看utm_source
const utm_source = getUtmSource().shareMa || getUtmSource().utm_source;

export {
  handleAdClick,
  handleApkClick,
  handleSkipApkClick,
  handleChangePage,
  handleRegisterAccount,
  handleDevToolCheckReport,
};
