import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import LinkComponent from "@/components/common/LinkComponent";
import CloseComponent, {
  CloseComponentElement,
} from "@/components/common/CloseComponent";
import { handleAdClick } from "@/lib/services/gtmEventHandle";

const PopAdsCover = ({ popAdsImg, closeAds, adsList }) => {
  const popAdsRoot = useRef(null);
  let [randomNum, setRandomNUm] = useState();
  const [popImg, setPopImg] = useState({});

  useEffect(() => {
    if (popAdsImg) {
      let ranNum = Math.floor(Math.random() * popAdsImg.length);
      if (!popAdsImg[ranNum]) {
        ranNum = 0;
      }
      setPopImg(popAdsImg[ranNum]);
      setRandomNUm(ranNum);
    }
  }, [popAdsImg]);

  return (
    <PopAdsCoverElement
      ref={popAdsRoot}
      onClick={() => {
        setTimeout(() => {
          closeAds();
        }, 50);
      }}
      has_picurl={!!popImg.picurl}
    >
      <div className="header_cover">
        <img
          className="header_cover_img"
          src={popImg.picurl}
          alt={"B次元啟動廣告背景"}
        />
      </div>
      <LinkComponent className="popad_link" routes={popImg}>
        <img
          className="popad_link_img"
          src={popImg.picurl}
          onError={(e) => {
            e.target.src = "/images/imgPlaceholder/fail404.jpg";
          }}
          alt="啟動廣告"
          onLoad={() => {
            popAdsRoot.current.style.opacity = 1;
          }}
          onClick={() => {
            handleAdClick(adsList.launch_random_banner[randomNum]);
          }}
        />
        <div className="close_container" onClick={closeAds}>
          <div className="close_bg" />
          <div className="font">略过</div>
          {/* <CloseComponent /> */}
          <CloseComponent callback={closeAds} />
        </div>
      </LinkComponent>
    </PopAdsCoverElement>
  );
};

export default PopAdsCover;

const PopAdsCoverElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["has_picurl"].includes(prop),
})`
  /*  */
  display: ${({ has_picurl }) => (has_picurl ? "block" : "none")};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0%;
  transition: 0.2s;
  display: flex;
  justify-content: center;

  .header {
    &_cover {
      position: absolute;
      overflow: hidden;
      z-index: 0;
      width: 100%;
      height: 100%;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: linear-gradient(to Top, #0007 0%, #0002 100%);
      }

      &_img {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        filter: blur(10px);
      }
    }
  }
  .popad_link {
    position: absolute;
    height: 100%;
    &_img {
      height: 100%;
      width: 100%;
    }
  }

  .close {
    &_container {
      z-index: 2;
      position: absolute;
      top: 3%;
      right: 2%;
      height: 40px;
      width: 80px;
      border-radius: 28px;
    }
    &_bg {
      background-color: black;
      z-index: 2;
      position: absolute;
      top: 3%;
      right: 2%;
      height: 40px;
      width: 80px;
      border-radius: 28px;
      opacity: 0.8;
    }
  }

  .font {
    position: absolute;
    right: 15px;
    top: 9.5px;
    color: #fff;
    font-size: 16px;
    height: 25px;
    z-index: 2;
  }

  ${CloseComponentElement} {
    position: absolute;
    right: 46px;
    top: 8.5px;
    width: 30px;
    height: 25px;
    background-color: transparent;
  }
`;

export { PopAdsCoverElement };
