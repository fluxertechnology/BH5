"use client";

import { useEffect, useRef } from "react";

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
import useSaveStateData from "@/hooks/useSaveStateData";
import { CSSTransition } from "react-transition-group";
import OutOfQuotaPortal from "@/components/common/OutOfQuotaPortal";
import MinorsProhibitedDialog from "@/components/common/MinorsProhibitedDialog";
import AnnouncementCover from "@/components/common/AnnouncementCover";
import MentionAppCover from "@/components/common/MentionAppCover";
import useMediaQuery from "@/hooks/useMediaQuery";
import { toggleMentionAppCoverAction } from "@/store/actions/showCoverCenter";
import useHTMLEvent from "@/hooks/useHTMLEvent";
import SearchResult from "@/components/common/SearchResult";

export default function GlobalComponent() {
  const { state, dispatch } = useGlobalContext();

  const { onScrollBottom } = useHTMLEvent();
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
    onScrollBottom();
  }, []);

  const router = useRouter();
  const { isMobile } = useMediaQuery();

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

    if (typeof window !== "undefined") {
      useSaveStateData(state);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    useGlobalDispatch({
      type: "SWITCH_NAVBAR",
      data: {
        isMobile,
      },
    });
  }, [isMobile]);

  const closeMentionAppCover = () => {
    useGlobalDispatch(toggleMentionAppCoverAction(false));
  };
  const nodeRef = useRef(null);
  const quotaRef = useRef(null);
  return (
    <div>
      <MinorsProhibitedDialog />
      <AxiosCenter.RenderLoadingElement />
      <CSSTransition
        timeout={200}
        in={state.showCoverCenter.announcementCover && isMobile} // 因要求從內存先把狀態改成 false
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_announcementCover"
        nodeRef={nodeRef}
      >
        <AnnouncementCover />
      </CSSTransition>
      <CSSTransition
        timeout={200}
        in={state.showCoverCenter.mentionAppCover}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_mentionAppCover"
        nodeRef={nodeRef}
      >
        <MentionAppCover closeMentionAppCover={closeMentionAppCover} />
      </CSSTransition>
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
      <CSSTransition
        timeout={200}
        in={state.outOfQuotaData.show}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_OutOfQuotaPortal"
        nodeRef={quotaRef}
      >
        <OutOfQuotaPortal />
      </CSSTransition>
      <SearchResult />
    </div>
  );
}
