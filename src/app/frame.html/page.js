"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shareMa = searchParams.get("shareMa");
    const utmSource = searchParams.get("utm_source");

    if (shareMa || utmSource) {
      localStorage.setItem(
        "utmMark",
        JSON.stringify({
          shareMa: shareMa || "",
          utm_source: utmSource || "",
        }),
      );
    }

    router.replace("/");
  }, []);

  return <div></div>;
}
