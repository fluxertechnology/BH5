import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { CSSTransition } from "react-transition-group";
import CloseComponent, {
  CloseComponentElement,
} from "@/components/common/CloseComponent";
import {
  buyContentAction,
  closeOutOfQuotaPortalAction,
  hideOutOfQuotaPortalAction,
} from "@/store/actions/outOfQuotaData";
import { colors, padding, pageUrlConstants } from "@/lib/constants";
import {
  addMissionRecordAction,
  pushRoutes,
} from "@/store/actions/historyActions";
import Image from "next/image";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  getOutOfQuotaPrice,
  getPriceUnit,
  getPremiumDiamond,
  getUserPremiumDiamond,
} from "../../lib/services/price";

let typeStr = ["小说", "美图", "漫画", "动画"];
const OutOfQuotaPortal = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  const [showBuyBoard, setShowBuyBoard] = useState(
    state.outOfQuotaData.showBuy
  );

  function judgeUnit() {
    return state.outOfQuotaData.unit === "gold" ? "精钻" : "钻石";
  }
  function onClick() {
    buyContent(() => {
      switch (state.outOfQuotaData.buy_type) {
        case 0:
        case 1:
        case 2:
          return addMissionRecord(6);
        case 3:
          return addMissionRecord(5);
        default:
          break;
      }
    });
  }

  const closeOutOfQuotaPortal = () => {
    if (state.outOfQuotaData.closeType === "back") {
      useGlobalDispatch(closeOutOfQuotaPortalAction());
    } else {
      useGlobalDispatch(hideOutOfQuotaPortalAction());
    }
  };
  const buyContent = (callback) => {
    useGlobalDispatch(buyContentAction(callback));
  };
  const toBuyVipPage = (buy_type) => {
    useGlobalDispatch({
      type: "CLOSE_OUTOFQUOTAPORTAL",
    });
    const url = [
      pageUrlConstants.profile.pages.profileDirectBuyVip,
      // pageUrlConstants.profile.pages.profileBuyVip.pages.profileBuyVipSex,
      pageUrlConstants.profile.pages.profileBuyVip.pages.profileBuyVipVideo,
    ];

    useGlobalDispatch(pushRoutes(url[buy_type === 4 ? 1 : 0]));
  };
  const toBuyGoldPage = () => {
    useGlobalDispatch({
      type: "CLOSE_OUTOFQUOTAPORTAL",
    });
    useGlobalDispatch(
      pushRoutes(pageUrlConstants.profile.pages.profilePayment)
    );
  };
  const addMissionRecord = (mission_id) => {
    useGlobalDispatch(addMissionRecordAction(mission_id));
  };

  const buyRef = useRef(null);
  return (
    <OutOfQuotaPortalElement>
      <CSSTransition
        timeout={200}
        in={!showBuyBoard}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_show_cover"
        nodeRef={buyRef}
      >
        <div className="show">
          <div className="show_container">
            <div className="show_container_cover">
              <Image
                className="show_container_cover_girl"
                src="/images/outOfQuota/outQuotaGirl.png"
                width={200}
                height={200}
                alt="Girl"
              />
              <Image
                className="show_container_cover_bg"
                src="/images/outOfQuota/outQuotaBg.jpg"
                width={0}
                height={0}
                alt="Bg"
              />
            </div>

            <div className="show_container_content">
              <div className="show_container_content_description">
                <Image
                  className="show_container_content_description_title"
                  src="/images/outOfQuota/outQuotaText.svg"
                  width={0}
                  height={0}
                  alt="Text"
                />
                <p className="show_container_content_description_text">
                  升级VIP，取得无限观看次数
                </p>
              </div>
              <div className="show_container_content_button">
                <div
                  className="show_container_content_button_btn"
                  onClick={() => setShowBuyBoard(true)}
                >
                  {`${getPriceUnit(t)}支付`}
                </div>
                <div
                  className="show_container_content_button_btn highlight"
                  onClick={() => toBuyVipPage(state.outOfQuotaData.buy_type)}
                >
                  升级VIP
                </div>
              </div>
              <CloseComponent callback={closeOutOfQuotaPortal} styleType={1} />
            </div>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        timeout={200}
        in={showBuyBoard}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_buy_cover"
        nodeRef={buyRef}
      >
        <div className="buy" ref={buyRef}>
          <div className="buy_content">
            <div className="buy_content_card">
              <div className="buy_content_card_title">
                <p className="buy_content_card_title_text">解锁新内容</p>
                <CloseComponent
                  callback={closeOutOfQuotaPortal}
                  styleType={2}
                />
              </div>
              <div className="buy_content_card_description">
                <p className="buy_content_card_description_title">
                  {state.outOfQuotaData.buy_type === 5
                    ? "付费更换头像"
                    : `此${
                        typeStr[state.outOfQuotaData.buy_type]
                      }需要付费才可继续观看`}
                </p>
                <p className="buy_content_card_description_text">
                  金额：{getOutOfQuotaPrice(t, state.outOfQuotaData)}
                </p>
              </div>
              <div className="buy_content_card_button">
                {/* <div
                  className="buy_content_card_button_btn"
                  onClick={closeOutOfQuotaPortal}
                >
                  <span className="buy_content_card_button_btn_text">
                    再想想
                  </span>
                </div> */}
                <div
                  className="buy_content_card_button_btn highLight"
                  onClick={onClick}
                >
                  <span className="buy_content_card_button_btn_text">
                    {t("Profile.buy.label.buy_now")}
                  </span>
                </div>
              </div>
            </div>
            <div className="buy_content_recharge">
              <div className="buy_content_recharge_gold">
                <p className="buy_content_recharge_gold_text">
                  当前拥有：
                  <span className="buy_content_recharge_gold_text_span pr-1">
                    {getUserPremiumDiamond(t, state.user)}
                    {/* {`${
                      state.outOfQuotaData.unit === "gold"
                        ? getPremiumDiamond(t, state.user.sign, true)
                        : getPremiumDiamond(t, state.user.money, false)
                    }`} */}
                  </span>
                </p>
              </div>
              <div className="buy_content_recharge_btn" onClick={toBuyGoldPage}>
                <p className="buy_content_recharge_btn_text">前往充值</p>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </OutOfQuotaPortalElement>
  );
};

export default OutOfQuotaPortal;

export const OutOfQuotaPortalElement = styled.div`
  /*  */
  position: relative;
  z-index: 20;

  .show,
  .buy {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    background-color: #000a;
  }

  .show {
    ${CloseComponentElement} {
      position: absolute;
      bottom: -90px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 50px;
    }

    &_container {
      position: relative;
      justify-content: center;
      align-items: center;
      width: 60%;
      @media (min-width: 599px) {
        max-width: 400px;
      }
      &_cover {
        position: relative;

        &_girl,
        &_bg {
          overflow: hidden;
          vertical-align: middle;
          border-radius: 10px;
        }

        &_girl {
          position: absolute;
          bottom: 0;
          width: 100%;
        }

        &_bg {
          width: 100%;
        }
      }

      &_content {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        padding-bottom: 40px;

        &_description {
          text-align: center;

          &_title {
            width: 80%;
          }

          &_text {
            font-size: 12px;
            color: #fff;
          }
        }

        &_button {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateY(50%);
          display: flex;
          justify-content: space-evenly;

          &_btn {
            cursor: pointer;
            padding: 10px 0;
            width: 100px;
            font-size: 16px;
            text-align: center;
            color: #f24c7c;
            background-color: white;
            border-radius: 10px;

            &.highlight {
              color: #885f2c;
              background-image: linear-gradient(
                to right,
                #efd7ad 0%,
                #daad75 100%
              );
            }
          }
        }
      }
    }
  }

  .buy {
    text-wrap: nowrap;
    &_content {
      margin-top: auto;
      width: 100%;
      padding: 0 35%;
      background-color: #fff;
      border-radius: 20px 20px 0 0;
      @media (max-width: 899px) {
        padding: 0;
      }
      &_card {
        padding: ${padding * 1.5}px ${padding}px;

        &_title {
          display: flex;
          justify-content: space-between;

          &_text {
            font-size: 1.6rem;
            font-weight: 900;
            color: #646464;
          }
          ${CloseComponentElement} {
            position: relative;
            width: 30px;
            height: 30px;
          }
        }

        &_description {
          font-size: 1.4rem;
          font-weight: 700;
          text-align: center;

          &_title {
            margin-top: 20px;
          }

          &_text {
            margin-top: 20px;
            color: ${colors.dark_pink};
          }
        }

        &_button {
          display: flex;
          justify-content: space-evenly;
          margin-top: 20px;

          &_btn {
            cursor: pointer;
            padding: 15px 20px;
            text-align: center;
            border: 2px solid #a8a8a8;
            border-radius: 5px;

            &_text {
              font-size: 1.2rem;
              font-weight: 700;
              color: ${colors.dark_pink};
            }

            &.highLight {
              width: 100%;
              // background-image: linear-gradient(
              //   to top,
              //   ${colors.dark_pink} 0%,
              //   #fa83b3 100%
              // );
              background: ${colors.back_dark_pink};
              border: none;
              border-radius: 20px;
              .buy_content_card_button_btn_text {
                color: #fff;
              }
            }
          }
        }
      }

      &_recharge {
        display: flex;
        margin-top: 20px;
        font-size: 1.4rem;
        flex-wrap: 900;
        font-weight: bold;
        justify-content: center;
        &_gold {
          flex-grow: 1;
          padding: 20px;
          text-align: center;
          background-color: ${colors.back_grey};

          &_text {
            color: #646464;

            &_span {
              color: #000;
            }
          }
        }

        &_btn {
          flex-grow: 1;
          text-align: center;
          cursor: pointer;
          padding: 20px;
          background-color: #1a2950;

          &_text {
            color: #fff;
          }
        }
      }
    }
  }
`;
