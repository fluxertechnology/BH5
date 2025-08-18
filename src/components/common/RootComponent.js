"use client";

import DesktopHeader from "@/components/layout/Header/DesktopHeader";
import DesktopFooter from "@/components/layout/Footer/DesktopFooter";
import MobileHeader from "@/components/layout/Header/MobileHeader";
import MobileFooter from "@/components/layout/Footer/MobileFooter";
import GlobalComponent from "@/components/common/GlobalComponent";
import PopupDialog from "@/components/login/PopupComponent";
import { useEffect, useState } from "react";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { openPopup } from "@/store/actions/user";
import { setUserAgent } from "@/hooks/useMediaQuery";
import { useSearchParams } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";

const RootComponent = ({ children, locale, userAgent }) => {
  const { state } = useGlobalContext();
  const { isDesktop } = useMediaQuery();

  setUserAgent(userAgent);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const routes = [
      "/posts/main/notice",
      "/posts/main/add/tags",
      "/posts/main/add",
      "/vendor/sheet/:goodsId/:buyType",
      "/profile/mission",
      "/profile/vip/common",
      "/profile/vip/sex",
      "/profile/vip/video",
      "/profile/edit",
      "/profile/edit/avatar",
      "/profile/payment",
      "/profile/direct_buy_vip",
      "/profile/transfer",
      "/profile/record",
      "/profile/bundle",
      "/profile/bundle/coupon",
      "/profile/bundle/gift",
      "/profile/payment_record/with_draw",
      "/profile/payment_record/with_draw/history/:type",
      "/profile/payment_record",
      "/profile/collect",
      "/profile/collect/comic",
      "/profile/collect/anime",
      "/profile/collect/video",
      "/profile/collect/novel",
      "/profile/collect/photo",
      "/profile/invites",
      "/profile/myorder",
      "/profile/myorderDetail/:orderId",
      "/profile/watch_history",
      "/profile/watch_history/anime",
      "/profile/watch_history/comic",
      "/profile/purchase_record",
      "/profile/purchase_record/comic",
      "/profile/purchase_record/anime",
      "/profile/purchase_record/video",
      "/profile/purchase_record/novel",
      "/profile/purchase_record/photo",
      "/profile/purchase_record/social",
      "/profile/feedback",
      "/home/comic/:comicId/:ep",
    ];

    const routeToRegex = (route) => {
      return new RegExp(
        "^" + route.replace(/:\w+/g, "([^/]+)").replace(/\//g, "\\/") + "$",
      );
    };

    const findMatchingRoute = (pathname) => {
      for (const route of routes) {
        const regex = routeToRegex(route);
        if (regex.test(pathname)) {
          return {
            matchedRoute: route,
            params: extractParams(regex, pathname, route),
          };
        }
      }
      return { matchedRoute: null, params: null };
    };

    const extractParams = (regex, pathname, route) => {
      const match = pathname.match(regex);
      const paramNames = [...route.matchAll(/:(\w+)/g)].map((m) => m[1]);
      const paramValues = match ? match.slice(1) : [];
      return paramNames.reduce((acc, name, i) => {
        acc[name] = paramValues[i];
        return acc;
      }, {});
    };

    const result = findMatchingRoute(state.router.location.pathname);
    if (result.matchedRoute && state.user.id === "guest") {
      setTimeout(() => {
        useGlobalDispatch(openPopup("login"));
      });
    }
  }, [state.user.id, state.router.location.pathname, isClient]);

  const searchParams = useSearchParams();
  useEffect(() => {
    const utmSource = searchParams.get("utm_source");
    const shareMa = searchParams.get("shareMa");

    if (utmSource || shareMa) {
      localStorage.setItem(
        "utmMark",
        JSON.stringify({
          utm_source: utmSource || "",
          shareMa: shareMa || "",
        }),
      );
    }

    const clickaduSUBID = searchParams.get("SUBID");
    const clickaduCampaignId = searchParams.get("campaignid");
    if (clickaduSUBID || clickaduCampaignId) {
      localStorage.setItem(
        "bh5_clickadu",
        JSON.stringify({
          SUBID: clickaduSUBID || "",
          campaignid: clickaduCampaignId || "",
        }),
      );
    }

    const arSubId = searchParams.get("subid");
    const arConversionId = searchParams.get("event");
    const arCampaignId = searchParams.get("cid");
    if (arSubId || arConversionId || arCampaignId) {
      localStorage.setItem(
        "bh5_ar",
        JSON.stringify({
          subid: arSubId || "",
          event: arConversionId || "",
          cid: arCampaignId || "",
        }),
      );
    }
  }, []);

  return (
    <div style={{
      marginTop: state.router.location.pathname.includes('/home/tcg') 
        ? '0' 
        : !isDesktop 
            ? '32.1vw'
            : '5.64vw',
    }}>
      <DesktopHeader locale={locale} />
      <MobileHeader locale={locale} />
      <div className="min-h-screen">{children}</div>
      <DesktopFooter locale={locale} />
      <MobileFooter locale={locale} />
      <GlobalComponent />
      <PopupDialog locale={locale} />
    </div>
  );
};

export default RootComponent;
