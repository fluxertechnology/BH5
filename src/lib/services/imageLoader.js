"use client";

export default function imageLoader({ src, height, width, quality }) {
  if (src.includes("http")) {
    return src;
  }
  const imgFolderPath = src.split("/").slice(0, -1).join("/");
  if (src.includes(imgFolderPath)) {
    return `${src}?w=${width}&h=${height}&q=${quality}`;
  }
  return `${imgFolderPath}${
    src.startsWith("/") ? src : `/${src}`
  }?w=${width}&h=${height}`;
}
