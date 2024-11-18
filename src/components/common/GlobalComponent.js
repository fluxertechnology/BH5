"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useGlobalContext, useGlobalDispatch } from "@/store";

import { AxiosCenter } from "@/lib/services/axios";

import { getAdsData } from "@/store/actions/adsList";
import { getConfigData } from "@/store/actions/config";
import { getNoticeData } from "@/store/actions/noticeList";
import { initRoutes } from "@/store/actions/historyActions";

export default function GlobalComponent() {
  const { state, dispatch } = useGlobalContext();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (Object.keys(state.adsList).length === 0) {
      useGlobalDispatch(getAdsData());
    }
    if (state.noticeList.length === 0) {
      useGlobalDispatch(getNoticeData());
      useGlobalDispatch(getConfigData());
    }
    useGlobalDispatch(initRoutes());
  }, []);

  useEffect(() => {
    const quertObj = Object.fromEntries(searchParams.entries());
    const url = `${pathname}?${searchParams}`;
    dispatch({
      type: "INIT_ROUTER",
      data: {
        action: "", // TODO(ZY): get router action
        location: {
          hash: url.split("#")[1] || "",
          key: "",
          pathname,
          query: { ...quertObj },
          search: searchParams.toString(),
          state: null,
        },
      },
    });
  }, [pathname, searchParams]);

  return (
    <div>
      <AxiosCenter.RenderLoadingElement />
    </div>
  );
}
