import React, { useState, useEffect, memo, useMemo } from "react";
import styled from "styled-components";
import LinkComponent from "@/components/common/LinkComponent";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper";
import "swiper/css/bundle";

import { handleAdClick } from "@/lib/services/gtmEventHandle";
import useMediaQuery from "@/hooks/useMediaQuery";

import { useGlobalContext } from "@/store";
import Image from "next/image";
import ImageComponent from "@/components/common/ImageComponent";

let auto_play_progress_move_time = 500;
let autoPlayProgressMoveTimeMultiple = 6;
let auto_play_time =
  auto_play_progress_move_time * autoPlayProgressMoveTimeMultiple;

const areEqual = (pre, next) => {
  return JSON.stringify(pre) === JSON.stringify(next);
};

const ImageCarousel = ({
  adsKey,
  threeInOneBanner,
  is_cover = false,
  size,
  callback = () => {},
}) => {
  const { state } = useGlobalContext();

  const localState = useMemo(() => {
    return {
      adsList: state.adsList[adsKey.key] || [],
      placeholder: adsKey.placeholder || "#",
    };
  }, [state.adsList[adsKey.key]]);

  const [swiper_progress, setSwiperProgress] = useState(0);
  const [timeClock, setTimeClock] = useState(null);
  const [height, setHeight] = useState("auto");
  const { isMobile } = useMediaQuery();

  useEffect(() => {
    return () => {
      if (swiper_progress > 0) {
        clearTimeout(timeClock);
        setTimeClock(
          setTimeout(() => {
            setSwiperProgress(
              swiper_progress -
                auto_play_time / (autoPlayProgressMoveTimeMultiple - 1)
            );
          }, auto_play_progress_move_time)
        );
      }
    };
  }, [swiper_progress]);

  useEffect(() => {
    window.addEventListener("focus", focusEvent);
    return () => {
      window.removeEventListener("focus", focusEvent);
    };
  }, []);
  useEffect(() => {
    switch (size) {
      case "banner_animated": //動畫頂部banner
        setHeight(isMobile ? "30vw" : "10vw");
        break;
      case "banner_ads": //廣告banner
        setHeight(isMobile ? "21vw" : "7vw");
        break;
      case "banner_float": //浮動廣告banner
        setHeight("auto"); //不這樣設定H5抽獎、首購會有問題
        break;
      case "banner_main": //上方主banner
        setHeight(isMobile ? "56vw" : "18vw");
        break;
      default: //浮動廣告banner
        setHeight("auto");
        break;
    }
  }, [isMobile]);
  function focusEvent() {
    setSwiperProgress(
      swiper_progress === auto_play_time ? auto_play_time - 1 : auto_play_time
    );
  }

  return (
    <ImageCarouselElement swiper_progress={swiper_progress} height={height}>
      <Swiper
        className="image_carousel swiper-pagination-center"
        modules={[Pagination, A11y, Autoplay]}
        spaceBetween={threeInOneBanner ? 0 : 50}
        slidesPerView={threeInOneBanner ? 3 : 1}
        loop
        autoHeight
        pagination={{ clickable: true }}
        autoplay={{
          delay: auto_play_time,
          disableOnInteraction: false,
        }}
        onSwiper={callback}
        onResize={callback}
        onSliderMove={(e) => {
          clearTimeout(timeClock);
        }}
        onTransitionEnd={() => {
          setSwiperProgress(
            swiper_progress === auto_play_time
              ? auto_play_time - 1
              : auto_play_time
          );
        }}
      >
        {localState.adsList.map((data) => {
          return (
            <SwiperSlide
              key={data.name + "_" + data.cname + "_" + data.linkurl}
              onClick={() => {
                handleAdClick(data);
              }}
            >
              <LinkComponent
                routes={{
                  linkurl: data.linkurl,
                  inside_data: data.inside_data,
                }}
                className="image_carousel_slide"
              >
                <ImageComponent
                  className="image_carousel_slide_img "
                  alt={data.cname}
                  src={data.picurl}
                  width={0}
                  height={0}
                  title={data.name}
                />
              </LinkComponent>
            </SwiperSlide>
          );
        })}
        {is_cover && threeInOneBanner && (
          <div className="cover">
            <div className="cover_r" />
            <div className="cover_l" />
          </div>
        )}

        <div
          style={{
            left:
              ((auto_play_time - swiper_progress) / auto_play_time) * 100 + "%",
          }}
          className="swiper-autoplay-progress"
        />
      </Swiper>
    </ImageCarouselElement>
  );
};

export default memo(ImageCarousel, areEqual);

export const ImageCarouselElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["swiper_progress"].includes(prop),
})`
  /*  */
  .swiper-autoplay-progress {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    height: 2px;
    background-color: #0009;
    transition: ${({ swiper_progress }) => {
        return swiper_progress <= auto_play_time - 10
          ? auto_play_progress_move_time / 1000
          : "0";
      }}
      linear;
  }
  .cover {
    pointer-events: none;
    &_r {
      position: absolute;
      z-index: 999;
      width: 34%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 66.6%;
      opacity: 0.5;
      background-color: black;
    }

    &_l {
      position: absolute;
      z-index: 999;
      width: 34%;
      top: 0;
      right: 0;
      bottom: 0;
      right: 66.6%;
      opacity: 0.5;
      background-color: black;
    }
  }

  .image_carousel {
    overflow: hidden;
    width: 100%;
    height: ${({ height }) => height !== "auto" && 0};
    padding-bottom: ${({ height }) => height !== "auto" && height};

    &_slide {
      width: 100%;
      &_img {
        width: 100%;
        vertical-align: middle;
      }
    }
  }
`;
