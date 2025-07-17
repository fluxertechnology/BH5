import { forwardRef, useEffect, useState } from "react";
import styled from "styled-components";

import WavaButton from "@/components/layout/Header/WavaButton";
import { apiUrl, colors, requestUrlConstants } from "@/lib/constants";
import {
  dismissPreventPageScroll,
  preventPageScroll,
} from "@/store/actions/utilities";
import { useTranslations } from "next-intl";
import LinkComponent from "@/components/common/LinkComponent";
import { useLang } from "@/i18n/Metronici18n";
import Image from "next/image";

const FirstRechargeCover = forwardRef((props, ref) => {
  const t = useTranslations();
  const lang = useLang();
  const { user, times } = props;
  const { hour, min, sec } = times;
  const [show, setShow] = useState(false);

  useEffect(() => {
    return () => {
      dismissPreventPageScroll();
    };
  }, []);
  function handleOpen() {
    preventPageScroll();
    setShow(true);
  }
  function handleClose() {
    dismissPreventPageScroll();
    setShow(false);
  }
  useEffect(() => {
    ref.current.handleOpen = handleOpen;
    ref.current.handleClose = handleClose;
  }, []);
  return (
    <FirstRechargeCoverElement show={show} ref={ref}>
      <div className="first_charge_container">
        <div className="img">
          <Image
            src="/images/coverpage/first_charge_cover_title.png"
            width={0}
            height={0}
            alt="first_charge_cover_title"
            className="area_top_img"
          />
        </div>
        <div className="area_top_text ">
          {t("First.recharge.cover.exclusive")}
        </div>
        <div className="area_top_text1">
          {t("First.recharge.cover.discount")}
          <label className="area_top_text1_central">
            {t("First.recharge.cover.save")}
            60 &nbsp;
          </label>
          {t("Global.dollar")}
        </div>
        <div className="area_flash_sale">
          <div className="fw-m mb-1">
            {t("First.recharge.cover.flash_sale")}
          </div>
          <div className="area_flash_sale_timmer">
            <div className="area_flash_sale_timmer_block">
              <div className="area_flash_sale_timmer_block_text">{hour}</div>
            </div>
            {t("First.recharge.cover.hour")}
            <div className="area_flash_sale_timmer_block">
              <div className="area_flash_sale_timmer_block_text">{min}</div>
            </div>
            {t("First.recharge.cover.min")}
            <div className="area_flash_sale_timmer_block">
              <div className="area_flash_sale_timmer_block_text">{sec}</div>
            </div>
            {t("First.recharge.cover.sec")}
          </div>
        </div>
        <div className="nav_list">
          <div className="nav_list_tag" onClick={handleClose}>
            <LinkComponent
              className="nav_list_tag_link"
              routes={{
                linkurl:
                  apiUrl +
                  requestUrlConstants.toPaymentPageUrl +
                  `?uid=${user.id}&ctype=3&content-language=${lang}&origin=${window.location.origin}`,
              }}
            >
              <WavaButton>
                <div className="nav_list_tag_text">
                  {t("First.recharge.cover.to_buy")}
                </div>
              </WavaButton>
            </LinkComponent>
          </div>
        </div>
        <div className="close" onClick={handleClose}>
          <Image
            src="/images/shared/close.svg"
            className="close_img"
            width={0}
            height={0}
            alt="bh5_close"
          />
        </div>
      </div>
      <div className="pc_bg" onClick={handleClose} />
    </FirstRechargeCoverElement>
  );
});

export default FirstRechargeCover;
const FirstRechargeCoverElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["bottom_nav_height", "show"].includes(prop),
})`
  /*  */
  display: ${({ show }) => (!show ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  @media (min-width: 899px) {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 999;
  }
  .pc_bg {
    @media (min-width: 899px) {
      background-color: black;
      position: fixed;
      z-index: 998;
      opacity: 0.8;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
  }
  .area {
    &_top {
      position: relative;

      &_img {
        width: 100%;
      }
      &_text {
        text-align: center;
        font-size: min(6vw, 3rem);
        padding: 10px 0;
        margin: 0 10%;
        font-weight: 600;
        background-color: #9a522e;
        color: #f8eec2;
        @media (min-width: 899px) {
          font-size: min(2vw, 1.4rem);
        }
      }
      &_text1 {
        text-align: center;
        font-size: min(7vw, 4rem);
        padding: 20px 0;
        font-weight: 700;
        color: #9a522e;
        @media (min-width: 899px) {
          font-size: min(2vw, 2rem);
        }
        &_central {
          font-size: min(7.5vw, 4.5rem);
          color: #4c322c;
          @media (min-width: 899px) {
            font-size: min(3vw, 3rem);
          }
        }
      }
    }
    &_flash_sale {
      display: flex;
      flex-direction: column;
      margin: 0 5%;
      background-color: #fff;
      padding: 2% 3%;
      font-size: 1.4rem;
      @media (min-width: 899px) {
        font-size: min(1.5vw, 3rem);
      }
      &_timmer {
        display: flex;
        align-items: end;
        color: #9a522e;
        justify-content: space-between;
        font-weight: 700;

        &_block {
          position: relative;
          background-color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 20vw;
          width: 20vw;
          &_text {
            position: absolute;
            font-size: min(6vw, 3rem);
            font-weight: 700;
            color: #f8eec2;
            @media (min-width: 899px) {
              font-size: min(3.5vw, 3rem);
            }
          }
          @media (min-width: 899px) {
            height: 6vw;
            width: 10vw;
          }
        }
      }
    }
  }

  .nav_list {
    display: flex;
    overflow: auto;
    justify-content: center;
    margin: 5% 15%;

    &_tag {
      width: 100%;
      cursor: pointer;
      flex-shrink: 0;
      display: inline-block;
      overflow: hidden;
      color: #fff;
      background-color: ${colors.dark_pink};
      border-radius: 30px;

      &_link {
        text-decoration: none;
        color: #fff;
      }

      &_text {
        text-align: center;
        padding: 5%;
        font-size: 1rem;
        font-weight: 600;
        @media (min-width: 899px) {
          font-size: 2rem;
        }
      }
    }
  }

  .close {
    position: fixed;
    top: 10px;
    right: 10px;
    @media (min-width: 899px) {
      position: absolute;
    }
    &_img {
      cursor: pointer;
      width: 40px;
    }
  }
  .first_charge {
    &_container {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      overflow: auto;
      bottom: ${({ bottom_nav_height }) => bottom_nav_height}px;
      z-index: 999;
      background-color: #edd9d1;
      font-size: 1rem;
      flex-direction: column;
      justify-content: space-between;
      @media (min-width: 599px) {
        position: relative;
        bottom: auto;
        border-radius: 10px;
        width: 30vw;
      }
      @media (min-width: 899px) {
        position: relative;
        bottom: auto;
        border-radius: 10px;
        width: 25vw;
      }
    }
  }
`;
