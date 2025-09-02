import { useRef, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import PictureCard from "@/components/common/PictureCard";
import useMediaQcuery from "@/hooks/useMediaQuery";

const WithdrawCardCarousel = ({
  items,
}) => {
  const { isMobile } = useMediaQcuery();
  function onClickEvent(index) {
    console.log("add card " + index);
  }

  useEffect(() => {
    const slider = document.querySelector('.card-cont');
    let isDown = false;
    let startX, scrollLeft;
    let isDragging = false;

    slider.addEventListener("pointerdown", (e) => {
      isDown = true;
      isDragging = false;
      startX = e.clientX;
      scrollLeft = slider.scrollLeft;
      slider.style.cursor = "grabbing";
    });

    slider.addEventListener("pointermove", (e) => {
      if (!isDown) return;

      const walk = e.clientX - startX;

      if (Math.abs(walk) > 5) {
        if (!isDragging) {
          slider.setPointerCapture(e.pointerId);
        }
        isDragging = true;
        e.preventDefault();
        slider.scrollLeft = scrollLeft - walk;
      }
    });

    slider.addEventListener("pointerup", (e) => {
      isDown = false;
      slider.style.cursor = "grab";

      if (isDragging) {
        slider.releasePointerCapture(e.pointerId);
        e.preventDefault();
      } else {
      }
    });

  }, [])


  function judgePercentage() {
    if (isMobile) return 30;
    return 15;
  }
  return (
    <WithdrawCardCarouselElement flexPercentage={judgePercentage()}>
      <div className="card-cont">
        <div>
          <div
            className={`carousel_content`}
          >
            {items.map((data, index) => {
              const itemKey = data?.id ?? `item-${index}`;
              return (
                <div className="carousel_content_item" key={itemKey} onClick={() => onClickEvent(index)}>
                  <div className={`card-item card-item-${data?.id} cursor`}>
                    <div className="dashed-border">&nbsp;</div>
                    {index === 2 && (
                      <p className="bind-text">+立即绑定银行卡</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </WithdrawCardCarouselElement>
  );
};

export default WithdrawCardCarousel;
const WithdrawCardCarouselElement = styled.div.withConfig({
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
      @media (max-width: 1024px){
        transform: translate(-85%, 0%);
      }
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
    top: 0;
    width: 35px;
    height: 9.375rem;
    background-color: rgba(0, 0, 0, 0.5);
    pointer: cursor;
    z-index: 2;
    transform: translate(0, 1.875rem);

    @media (min-width: 2540px) {
      transform: translate(0, 4.875rem);
    }
  }

  .box-right {
    position: absolute;
    right: 0px;
    top: 0;
    width: 35px;
    height: 9.375rem;
    background-color: rgba(0, 0, 0, 0.5);
    pointer: cursor;
    z-index: 2;
    transform: translate(0, 1.875rem);

    @media (min-width: 2540px) {
      transform: translate(0, 4.875rem);
    }
  }

  .card-cont{
    margin-bottom: 3.44vw;
    overflow: auto;
    width: 100%;
    white-space: nowrap;
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    mask-repeat: no-repeat;
    mask-size: 100% 100%;;
    user-select: none;
    -webkit-user-drag: none;

    @media (max-width: 1024px){
      mask-image: none;
    }
  }

  .card-cont * {
    user-select: auto;
    -webkit-user-drag: auto;
    pointer-events: auto;
  }
    
  .card-item {
    position:relative;
    border-radius: 1.04vw;
    background-image: -moz-linear-gradient(180deg, #ebedf1, #c8cdd3);
    background-image: -webkit-linear-gradient(180deg, #ebedf1, #c8cdd3);
    background-image: -ms-linear-gradient(180deg, #ebedf1, #c8cdd3);
    width: 18.33vw;
    height: 9.32vw;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 1024px){
      background-image: -moz-linear-gradient( 180deg, rgba(199,206,216,0.99608) 0%, rgb(101,116,133) 100%);
      background-image: -webkit-linear-gradient( 180deg, rgba(199,206,216,0.99608) 0%, rgb(101,116,133) 100%);
      background-image: -ms-linear-gradient( 180deg, rgba(199,206,216,0.99608) 0%, rgb(101,116,133) 100%);
      width: 47.2vw;
      height: 24.13vw;
      border-radius: 2.67vw;
    }
    
  }

  .dashed-border{
    position: absolute;
    border-width: 1px;
    border-style: dashed;
    border-color: #fff;
    border-radius: 1.04vw;
    width: 95%;
    height: 90%;

    @media (max-width: 1024px){
      border-radius: 2.67vw;
    }
  }
    
  .card-item-3 {
    border-radius: 1.04vw;
    background-image: -moz-linear-gradient( 180deg, rgba(199,206,216,0.99608) 0%, rgb(101,116,133) 100%);
    background-image: -webkit-linear-gradient( 180deg, rgba(199,206,216,0.99608) 0%, rgb(101,116,133) 100%);
    background-image: -ms-linear-gradient( 180deg, rgba(199,206,216,0.99608) 0%, rgb(101,116,133) 100%);
    width: 18.33vw;
    height: 9.32vw;
    z-index: 10;

    @media (max-width: 1024px){
      width: 47.2vw;
      height: 24.13vw;
      border-radius: 2.67vw;
    }
  }

  .bind-text{
    color: #fff;
    font-size: 1.125rem;

    @media (max-width: 1024px){
      font-size: 2.4vw;
    }
  }
`;
