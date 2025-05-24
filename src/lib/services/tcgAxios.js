import axios from "axios";
import { nowLang } from "@/i18n/Metronici18n";

const tcgAPIPath = process.env.NEXT_PUBLIC_TCG_API_PATH || "";

const axiosItem = axios.create({
  baseURL: tcgAPIPath,
  headers: {
    "Content-Type": "application/json",
    "Content-Language": nowLang || "en",
  },
});

axiosItem.defaults.timeout = 50000;

export default axiosItem;
