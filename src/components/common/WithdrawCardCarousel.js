import { useEffect } from "react";
import styled from "styled-components";
import useMediaQcuery from "@/hooks/useMediaQuery";
import { useGlobalDispatch } from "@/store";
import { pushRoutes } from "@/store/actions/historyActions";
import { pageUrlConstants } from "@/lib/constants";

const WithdrawCardCarousel = ({ items }) => {
  const { isMobile } = useMediaQcuery();
  function onClickEvent() {
    useGlobalDispatch(
      pushRoutes(pageUrlConstants.profile.pages.profileWithdrawBindBank),
    );
  }

  useEffect(() => {
    const slider = document.querySelector(".card-cont");
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
  }, []);

  function judgePercentage() {
    if (isMobile) return 30;
    return 15;
  }

  return (
    <WithdrawCardCarouselElement flexPercentage={judgePercentage()}>
      <div className="card-cont">
        <div>
          <div className={`carousel_content`}>
            {items.map((data, index) => {
              const itemKey = data?.id ?? `item-${index}`;
              return (
                <div
                  className="carousel_content_item"
                  key={itemKey}
                  onClick={() => onClickEvent(index)}
                >
                  <div className={`card-item card-item-${data?.id} cursor`}>
                    <div className="dashed-border">&nbsp;</div>
                    {index === 2 ? (
                      data?.card?.is_binding ? (
                        <div className="card-info-container">
                          <div className="card-header">
                            <div className="bank-name">{data.card.name}</div>
                            <div className={`card-type ${data.card.type}`}>
                              {data.card.type === "creditcard"
                                ? "信用卡"
                                : "借记卡"}
                            </div>
                          </div>

                          <div className="card-number">{data.card.number}</div>

                          {data.card.branch && (
                            <div className="card-branch">
                              {data.card.branch}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="bind-text">+立即绑定银行卡</p>
                      )
                    ) : null}
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
      @media (max-width: 1024px) {
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

  .card-cont {
    margin-bottom: 3.44vw;
    overflow: auto;
    width: 100%;
    white-space: nowrap;
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    user-select: none;
    -webkit-user-drag: none;

    @media (max-width: 1024px) {
      mask-image: none;
    }
  }

  .card-cont * {
    user-select: auto;
    -webkit-user-drag: auto;
    pointer-events: auto;
  }

  .card-item {
    position: relative;
    border-radius: 1.04vw;
    background-image: -moz-linear-gradient(180deg, #ebedf1, #c8cdd3);
    background-image: -webkit-linear-gradient(180deg, #ebedf1, #c8cdd3);
    background-image: -ms-linear-gradient(180deg, #ebedf1, #c8cdd3);
    width: 18.33vw;
    height: 9.32vw;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 1024px) {
      background-image: -moz-linear-gradient(
        180deg,
        rgba(199, 206, 216, 0.99608) 0%,
        rgb(101, 116, 133) 100%
      );
      background-image: -webkit-linear-gradient(
        180deg,
        rgba(199, 206, 216, 0.99608) 0%,
        rgb(101, 116, 133) 100%
      );
      background-image: -ms-linear-gradient(
        180deg,
        rgba(199, 206, 216, 0.99608) 0%,
        rgb(101, 116, 133) 100%
      );
      width: 47.2vw;
      height: 24.13vw;
      border-radius: 2.67vw;
    }
  }

  .dashed-border {
    position: absolute;
    border-width: 1px;
    border-style: dashed;
    border-color: #fff;
    border-radius: 1.04vw;
    width: 95%;
    height: 90%;

    @media (max-width: 1024px) {
      border-radius: 2.67vw;
    }
  }

  .card-item-3 {
    border-radius: 1.04vw;
    background-image: -moz-linear-gradient(
      180deg,
      rgba(199, 206, 216, 0.99608) 0%,
      rgb(101, 116, 133) 100%
    );
    background-image: -webkit-linear-gradient(
      180deg,
      rgba(199, 206, 216, 0.99608) 0%,
      rgb(101, 116, 133) 100%
    );
    background-image: -ms-linear-gradient(
      180deg,
      rgba(199, 206, 216, 0.99608) 0%,
      rgb(101, 116, 133) 100%
    );
    width: 18.33vw;
    height: 9.32vw;
    z-index: 10;

    @media (max-width: 1024px) {
      width: 47.2vw;
      height: 24.13vw;
      border-radius: 2.67vw;
    }
  }

  .bind-text {
    color: #fff;
    font-size: 1.125rem;

    @media (max-width: 1024px) {
      font-size: 2.4vw;
    }
  }

  /* ========== CARD INFO CONTAINER STYLES ========== */
  .card-info-container {
    position: relative;
    width: 95%;
    height: 90%;
    padding: 0.8vw;
    border-radius: 0.8vw;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    z-index: 3;

    @media (max-width: 1024px) {
      padding: 2.13vw;
      border-radius: 2vw;
    }
  }

  .card-info-container::before {
    content: "";
    position: absolute;
    top: -30%;
    right: -30%;
    width: 50%;
    height: 50%;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    z-index: 1;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 2;
    margin-bottom: 0.4vw;

    @media (max-width: 1024px) {
      margin-bottom: 1.07vw;
    }
  }

  .bank-name {
    font-size: 0.83vw;
    font-weight: 600;
    color: white;
    line-height: 1.2;

    @media (max-width: 1024px) {
      font-size: 2.13vw;
    }
  }

  .card-type {
    font-size: 0.6vw;
    padding: 0.2vw 0.4vw;
    border-radius: 0.6vw;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    line-height: 1;

    @media (max-width: 1024px) {
      font-size: 1.6vw;
      padding: 0.53vw 1.07vw;
      border-radius: 1.6vw;
    }
  }

  .card-type.creditcard {
    background: rgba(255, 215, 0, 0.3);
  }

  .card-type.debitcard {
    background: rgba(0, 255, 127, 0.3);
  }

  .card-number {
    font-size: 0.94vw;
    font-weight: 500;
    letter-spacing: 0.1vw;
    font-family: "Courier New", monospace;
    position: relative;
    z-index: 2;
    margin-bottom: 0.3vw;
    line-height: 1.2;

    @media (max-width: 1024px) {
      font-size: 2.4vw;
      letter-spacing: 0.27vw;
      margin-bottom: 0.8vw;
    }
  }

  .card-branch {
    font-size: 0.7vw;
    color: rgba(255, 255, 255, 0.85);
    position: relative;
    z-index: 2;
    line-height: 1.2;
    margin-top: auto;

    @media (max-width: 1024px) {
      font-size: 1.87vw;
    }
  }
`;
