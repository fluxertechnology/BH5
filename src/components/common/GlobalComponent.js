"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useGlobalContext } from "@/store";

export default function GlobalComponent() {
  const { state, dispatch } = useGlobalContext();

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
      },
    });
  }, [pathname, searchParams]);

  return (
    <div>
      <h1>GlobalComponent</h1>
    </div>
  );
}
