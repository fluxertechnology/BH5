import { nowLang } from "@/i18n/Metronici18n";

export const languageCode = [
  "CN",
  "TW",
  "EN",
  "TH",
  "VI",
  "ID",
  "KM",
  "MS",
  "JA",
  "KO",
  "PT",
];

const getLanguageCode = () => {
  const code =  nowLang || "en";
  if (code === "tc") {
    return "TW";
  } else if (code === "en") {
    return "EN";
  } else if (languageCode.includes(code.toUpperCase())) {
    return code.toUpperCase();
  } else {
    return "EN";
  }
};

export default getLanguageCode;
