import { useRef } from "react";
import styled from "styled-components";
import CoverCubeItem from "../../component/CoverCubeItem";
import arrowIcon from "../../../assets/icons/arrow.svg";
import useMediaSetting from "../../../reackHook/useMediaSetting";
import Image from "next/image";
const ContinueWatchSlideCarousel = ({
  itemsAnime,
  itemsComic,
  type,
  rankStyle = false,
  continueWatch = false,
}) => {
  const containerRef = useRef(null);
  const pageRef = useRef(0);
  const { isMobile } = useMediaSetting();
  const animationRef = useRef(null);
  const isVideo = ["animated", "video"].includes(type);
  function onClickEvent(status, e) {
    const pageCount = Math.ceil(
      (itemsAnime.length + itemsComic.length) / (isVideo ? 4 : 6)
    ); // 計算總頁數

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
        left: -30,
        top: "35%",
        zIndex: 2,
      },
      status: "prev",
    },
    {
      style: {
        position: "absolute",
        right: -30,
        top: "35%",
        zIndex: 2,
      },
      status: "next",
    },
  ];
  function judgePercentage() {
    if (continueWatch) {
      if (isMobile) return 30;
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
      isMobile={isMobile}
      flexPercentage={judgePercentage()}
    >
      <div style={{ overflowX: "clip" }}>
        <div
          className={`carousel_content ${type}`}
          ref={(ref) => (containerRef.current = ref)}
          style={{ overflow: isMobile && "auto" }}
        >
          {itemsAnime.map((data, index) => (
            <div className="carousel_content_item" key={data.id}>
              <CoverCubeItem
                data={data}
                type="animated"
                externalControlPosition
                rankStyle={rankStyle}
                rank={rankStyle ? index : undefined}
                total_view_show={!continueWatch}
                continueWatch={data.episode}
              />
            </div>
          ))}
          {itemsComic.map((data, index) => (
            <div className="carousel_content_item" key={data.id}>
              <CoverCubeItem
                data={data}
                externalControlPosition
                rankStyle={rankStyle}
                rank={rankStyle ? index : undefined}
                total_view_show={!continueWatch}
                continueWatch={data.episode}
              />
            </div>
          ))}
        </div>
      </div>
      {!isMobile &&
        itemsAnime.length + itemsComic.length > 6 &&
        imgButtonItems.map((item, index) => (
          <Image
            key={index}
            src={arrowIcon}
            width={0}
            height={0}
            className="cursor"
            alt="arrowIcon"
            style={item.style}
            onClick={() => onClickEvent(item.status)}
          />
        ))}
    </SlideCarouselElement>
  );
};

export default ContinueWatchSlideCarousel;
const SlideCarouselElement = styled.div`
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
`;
