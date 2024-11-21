"use client";

import { useEffect } from "react";

import { useGlobalContext, useGlobalDispatch } from "@/store";

import { AxiosCenter } from "@/lib/services/axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastAutoCloseDuring } from "@/lib/constants";

import { getAdsData } from "@/store/actions/adsList";
import { getConfigData } from "@/store/actions/config";
import { getNoticeData } from "@/store/actions/noticeList";
import { initRoutes } from "@/store/actions/historyActions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function GlobalComponent() {
  const { state, dispatch } = useGlobalContext();

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

  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();
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
        useRouter: router,
      },
    });
  }, [pathname, searchParams]);

  return (
    <div>
      <AxiosCenter.RenderLoadingElement />
      <ToastContainer
        className="toast_container"
        toastClassName="toast_container_item"
        position="bottom-center"
        autoClose={toastAutoCloseDuring}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
