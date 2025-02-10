import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import { colors } from "@/lib/constants";
import viewIcon from "@public/images/icons/view.svg";
import { judeTotalViewUnit } from "@/store/actions/utilities";
import Image from "next/image";
import 'lazysizes';

const ImageComponent = ({
  cover = false,
  src,

  alt,
  title,
  height = 100,
  width = 100,
  imgHeight = '',
  border_radius = "5px",
  placeholderImg = "",
  is_cover = false,
  imgStyle = {},
  toFixSize = false,
  background_color = "#f3f4f6",
  className = "",
  isFree = false,
  style = {},
  lazyLoad = true,
  img_border = false,
  total_view = 0,
  total_view_show = false,
  continueWatch = false,
  ...props
}) => {
  const t = useTranslations();
  const [fixHeight, setFixHeight] = useState(null);
  const isClient = typeof window !== "undefined";

  const placeholderSrc = (typeof placeholderImg === "object"
    ? placeholderImg.src
    : placeholderImg)
    || "/images/imgPlaceholder/300x300.jpg"

  const initialSrc = isClient ? src : placeholderSrc;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const lazyLoadEnabled = typeof window !== "undefined";

  function preventMenu(even) {
    var e = even || window.event;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }

  const imgRef = React.useRef(null);
  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src)
    }
  }, [src])

  return (
    <ImageComponentElement
      className={className}
      style={style}
      height={fixHeight || height}
      width={width}
      border_radius={border_radius}
      is_cover={is_cover}
      background_color={background_color}
      img_border={img_border}
      continueWatch={continueWatch}
      imgHeight={imgHeight}
      is_placeholder={imgRef.current?.src.includes('/images/imgPlaceholder')}
    >
      <img
        src={!lazyLoadEnabled ? imgSrc : placeholderSrc}
        className={`img ${imgSrc && lazyLoadEnabled ? "lazyload" : ""}`}
        data-src={lazyLoadEnabled ? src || placeholderSrc : undefined}
        //blurDataURL={placeholderImg || "/images/imgPlaceholder/300x300.jpg"}
        alt={alt ?? "unknown-pic"}
        title={title}
        style={imgStyle}
        onContextMenu={preventMenu}
        onLoad={(e) => {
          if (toFixSize) {
            let img = document.createElement("img");
            //setImgSrc(e.target.src);
            img.src = e.target.src;
            img.addEventListener("load", function () {
              setFixHeight((img.height / img.width) * 100);
              img.remove();
            });
          }
        }}
        onError={(e) => {
          //setImgSrc("/images/imgPlaceholder/300x300.jpg");
          e.target.src = placeholderSrc
        }}
        draggable="false"
        {...props}
        ref={imgRef}
      />

      {isFree && <div className="free_tip">{t("Global.free")}</div>}
      {!!total_view_show && (
        <div className="total_view">
          <Image
            src={viewIcon}
            width={0}
            height={0}
            alt="b次元观看数"
            title="b次元观看数"
          />
          {total_view > 0 ? judeTotalViewUnit(total_view) : ''}
        </div>
      )}
      {!!continueWatch && (
        <>
          <div className="total_view">{"观看至第" + continueWatch + "集"}</div>
          <div className="cover" />
        </>
      )}
    </ImageComponentElement>
  );
};

export default ImageComponent;

const ImageComponentElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["is_cover", "img_border", "continueWatch", 'imgHeight', 'is_placeholder', 'height', 'width', 'border_radius'].includes(prop),
})`
  /*  */
  position: relative;
  overflow: hidden;
  padding-bottom: ${({ height }) => typeof height === "string" && !(/^-?\d+(\.\d+)?$/.test(height)) ? height : `${height}%`};
  padding-right: ${({ width }) => typeof width === "string" && !(/^-?\d+(\.\d+)?$/.test(width)) ? width : `${width}%`};
  width: 100%;
  background-color: ${({ background_color }) => background_color};
  border-radius: ${({ border_radius }) => border_radius};
  transition: 0.3s;
  border: ${({ img_border }) => img_border && "2px solid black"};
  box-shadow: ${({ img_border }) => img_border && "0 0 0 2px white"};

  .img {
    user-select: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${({ imgHeight }) => !!imgHeight ? imgHeight : '100%'};
    vertical-align: middle;
    object-fit: ${({ is_cover = false }) => (is_cover ? "cover" : "contain")};
    -webkit-touch-callout: none;
  }

  .cover {
    position: absolute;
    top: 50%;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: ${({ continueWatch }) =>
    continueWatch
      ? `linear-gradient(
      to bottom,
      rgba(83, 76, 242, 0) 29%,
      #534cf2 121%
    )`
      : `linear-gradient(to Top, #0006 0%, #0000 100%)`};
  }

  .free_tip {
    position: absolute;
    padding-bottom: 0.3em;
    left: -50px;
    top: -20px;
    width: 7em;
    height: 3.5em;
    display: flex;
    color: #fff;
    justify-content: center;
    align-items: end;
    background-color: ${colors.back_dark_pink};
    transform: rotate(-0.13turn);
    font-size: 1rem;
  }
  .total_view {
    position: absolute;
    left: 2%;
    bottom: 3%;
    color: #fff;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2em;
    z-index:1;
    @media (max-width: 899px) {
      font-size: 0.8rem;
    }
    img {
      width: 16px;
      height: 16px;
      transform: translate(0px, 1.5px) !important; //因為圖片是歪的
      @media (max-width: 899px) {
        width: 15px;
        height: 15px;
        transform: none !important;
      }
    }
  }
`;
export { ImageComponentElement };
