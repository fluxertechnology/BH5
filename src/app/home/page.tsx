"use client";

import { useTranslations } from "next-intl";
import axios from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import { useGlobalContext } from "@/store";
import { useEffect } from "react";

const { getNewAnimeHome, postRefreshAnime, postContinueHistory } =
  requestUrlConstants;

export default function HomePage() {
  const t = useTranslations("Home");

  const { state, dispatch } = useGlobalContext();

  const getHomeData = () => {
    const formData = new FormData();
    // formData.append("token", state.user.id);
    axios.post(getNewAnimeHome, formData).then((data) => {
      dispatch({
        type: "INIT_HOME_DATA",
        data: data,
      });
    });
  };

  useEffect(() => {
    getHomeData()
  }, []);

  return (
    <div>
      <h1>{t("description")}</h1>
    </div>
  );
}
