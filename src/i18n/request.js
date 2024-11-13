import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  // if (!locale || !routing.locales.includes(locale)) notFound();

  let messages;
  try {
    messages = (await import(`../locales/${locale}.json`)).default;
  } catch (error) {
    console.error('Failed to load messages:', error);
    throw new Error('Messages not found');
  }

  return {
    locale,
    messages,
  };
});