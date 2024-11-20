"use client";

import { useEffect } from "react";

import { useGlobalContext, useGlobalDispatch } from "@/store";

import { AxiosCenter } from "@/lib/services/axios";

import { getAdsData } from "@/store/actions/adsList";
import { getConfigData } from "@/store/actions/config";
import { getNoticeData } from "@/store/actions/noticeList";
import { initRoutes } from "@/store/actions/historyActions";

export default function GlobalComponent() {
  const { state } = useGlobalContext();

  // useEffect(() => {
  //   document.querySelectorAll("img").forEach((e) => {
  //     e.src =
  //       "http://localhost:3001/_next/static/media/300x300.d8626b8b.jpg?w=16&h=16";
  //     e.srcset =
  //       "http://localhost:3001/_next/static/media/300x300.d8626b8b.jpg?w=16&h=16";
  //   });
  // });

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

  return (
    <div>
      <AxiosCenter.RenderLoadingElement />
    </div>
  );
}
