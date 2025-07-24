import { useRef } from "react";
import styled from "styled-components";
import CoverCubeItem from "@/components/common/CoverCubeItem";
import FeaturedCard from "@/components/games/FeaturedCard";
import PictureCard from "@/components/common/PictureCard";
import useMediaQcuery from "@/hooks/useMediaQuery";

import arrowIcon from "@public/images/icons/arrow.png";
import Image from "next/image";

const SlideCarousel = ({
  items,
  type,
  rankStyle = false,
  continueWatch = false,
}) => {
  const containerRef = useRef(null);
  const pageRef = useRef(0);
  const { isMobile } = useMediaQcuery();
  const animationRef = useRef(null);
  const isVideo = ["animated", "video"].includes(type);
  function onClickEvent(status, e) {
    const pageCount = Math.ceil(items.length / (isVideo ? 4 : 6)); // 計算總頁數

    if (status === "next") {
      pageRef.current = (pageRef.current + 1) % pageCount; // 取余運算實現循環翻頁
    } else {
      pageRef.current = (pageRef.current - 1 + pageCount) % pageCount; // 取余運算實現循環翻頁
    }

    const targetPage = pageRef.current;
    const startTime = performance.now(); // 開始時間

    cancelAnimationFrame(animationRef.current); // 取消前一個動畫

    function animateItems(timestamp) {
      const elapsedTime = timestamp - startTime; // 經過的時間
      const element = containerRef.current;
      if (element) {
        element.style.transition = "1s";
        element.style.transformStyle = "flat";
        element.style.position = "relative";
        element.style.zIndex = "1";
        element.style.transform = `translate3d(-${90 * targetPage}%, 0, 0)`;
      }

      if (elapsedTime < 1000) {
        // 如果經過的時間小於 1000 毫秒 (1 秒)，繼續執行動畫
        animationRef.current = requestAnimationFrame(animateItems);
      }
    }

    // 開始動畫
    animationRef.current = requestAnimationFrame(animateItems);
  }

  const imgButtonItems = [
    {
      style: {
        transform: "scaleX(-1)",
        position: "absolute",
        left: 10,
        top: "35%",
        zIndex: 3
      },
      status: "prev",
    },
    {
      style: {
        position: "absolute",
        right: 10,
        top: "35%",
        zIndex: 3
      },
      status: "next",
    },
  ];
  function judgePercentage() {
    if (continueWatch) {
      return 15;
    } else {
      if (["animated", "video"].includes(type)) {
        if (isMobile) return 50;
        return 22;
      } else {
        if (isMobile) return 30;
        return 15;
      }
    }
  }
  return (
    <SlideCarouselElement
      type={type}
      flexPercentage={judgePercentage()}
    >
      <div style={{ overflowX: "clip" }}>
        <div
          className={`carousel_content ${type}`}
          ref={(ref) => (containerRef.current = ref)}
          style={{ overflow: isMobile && "auto" }}
        >
          {items.map((data, index) => {
            if (type === "game") {
              return (
                <div className="carousel_content_item " key={data.id}>
                  <FeaturedCard data={data} />
                </div>
              );
            } else if (type === "photo")
              return (
                <div className="carousel_content_item" key={data.id}>
                  <PictureCard data={data} total_view_show />
                </div>
              );
            else {
              return (
                <div className="carousel_content_item" key={data.id}>
                  <CoverCubeItem
                    data={data}
                    type={type}
                    externalControlPosition
                    rankStyle={rankStyle}
                    rank={rankStyle ? index : undefined}
                    total_view_show={!continueWatch}
                    continueWatch={data.episode}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>

      {!isMobile &&
        items.length > (type === "anime" || type === "video" ? 4 : 6) &&
        imgButtonItems.map((item, index) => (
          <div className="img_btn_wrapper cursor">
            {index == 0 && <div className={`${type === "animated" ? 'anime-slider-btn': ''} box-left`} onClick={() => onClickEvent(item.status)}></div> }
            <Image
              key={index}
              width={0}
              height={0}
              src={arrowIcon}
              className="cursor arrowBtn"
              alt="arrowIcon"
              style={item.style}
              onClick={() => onClickEvent(item.status)}
            />
            {index == 1 && <div className={`${type === "animated" ? 'anime-slider-btn': ''} box-right`} onClick={() => onClickEvent(item.status)}></div> }
          </div>
        ))}

    </SlideCarouselElement>
  );
};

export default SlideCarousel;
const SlideCarouselElement = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "flexPercentage",
})`
  /*  */
  position: relative;
  align-self: center;
  .carousel {
    &_content {
      display: flex;
      position: relative;
      gap: 0.5rem;
      &_item {
        a {
          text-decoration: none;
        }
        flex: 0 0 ${({ flexPercentage }) => flexPercentage}%;
      }
    }
  }

  .box-left {
    position: absolute;
    left: 0px;
    top: 19%;
    width: 35px;
    height: 7.81vw;
    background-color: rgba(0, 0, 0, 0.5);
    pointer: cursor;
    z-index: 2;
  }

  .box-right {
    position: absolute;
    right: 0px;
    top: 19%;
    width: 35px;
    height: 7.81vw;
    background-color: rgba(0, 0, 0, 0.5);
    pointer: cursor;
    z-index: 2;
  }

  .anime-slider-btn.box-left {
    top: 15%;
    height: 7.81vw;
  }

  .anime-slider-btn.box-right {
    top: 15%;
    height: 7.81vw;
  }
`;
