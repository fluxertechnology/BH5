"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import LinkComponent from "@/components/common/LinkComponent";
import {
  apiUrl,
  colors,
  padding,
  pageUrlConstants,
  requestUrlConstants,
} from "@/lib/constants";

import { useLang } from "@/i18n/Metronici18n";
import useMediaQuery from "@/hooks/useMediaQuery";
import ProfileTransferCoinPage from "@/app/profile/transfer/page.js";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { pushRoutes } from "@/store/actions/historyActions";
import { getPriceUnit, getUserPremiumDiamond } from "@/lib/services/price";

const { profile } = pageUrlConstants;

const ProfilePayment = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const lang = useLang();
  const { isMobile } = useMediaQuery();
  const [showTransfer, setShowTransfer] = useState(false);
  const [infoData, setInfoData] = useState(() => [
    {
      icon: "/images/icons/bag_gold.svg",
      data: getUserPremiumDiamond(t, state.user, "sign"),
      text: t("Profile.payment.own_gold"),
    },
    {
      icon: "/images/icons/bag_money.svg",
      data: getUserPremiumDiamond(t, state.user, "money"),
      text: t("Profile.payment."),
    },
  ]);
  const [listData] = useState(() => [
    {
      icon: "/images/icons/document.svg",
      routes: profile.pages.profilePaymentRecord,
      title: t("Profile.payment.charge.history"),
      text: t("Profile.payment.charge.history_clear"),
    },
  ]);
  function onOpenFloatCover() {
    setShowTransfer(true);
  }
  function onCloseFloatCover() {
    setShowTransfer(false);
  }
  useEffect(() => {
    setInfoData([
      {
        icon: "/images/icons/bag_gold.svg",
        data: getUserPremiumDiamond(t, state.user),
        text: t("Profile.payment.own_gold"),
      },
      {
        icon: "/images/icons/bag_money.svg",
        data: getUserPremiumDiamond(t, state.user),
        text: t("Profile.payment."),
      },
    ]);
  }, [state.user.money, state.user.sign]);

  useEffect(() => {
    let Element = document.getElementsByClassName("PCFooterElement");
    if (!isMobile && Element.length) {
      if (showTransfer) {
        Element[0].style.setProperty("display", "none");
      } else {
        Element[0].style.setProperty("display", "block");
      }
    }
  }, [showTransfer]); //這裡暫時把PC版Footer關起來 這樣背景才不會隨著 TransferCoin滾動

  const goHistory = (route) => {
    useGlobalDispatch(pushRoutes(route));
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <TopBarContainer show_shadow={false}>
            <TopTitleBar
              title={t("Global.action.charge_1")}
              showBack={true}
              color="#000"
              back_color="#fff"
            />
          </TopBarContainer>
        ),
      },
    });
  }, []);

  const openCrispChatInNewTab = () => {
    window.open(
      `https://go.crisp.chat/chat/embed/?website_id=${process.env.NEXT_PUBLIC_CRISP_LIVE_CHAT_ID}`,
      "_blank"
    );
  };
  return (
    <ProfilePaymentElement main_height={state.navbar.mainHeight}>
      <div className="info_container">
        <div className="info_container_content">
          <div className="info_container_content_title">
            <p className="info_container_content_title_text">
              {t("Profile.payment.own_account")}
            </p>
          </div>
          <div className="flex justify-center item-center pt-[6.9vw] pb-[5.9vw] md:pt-[5vw] md:pb-[3.7vw] mx-3 md:!mx-auto">
            <div className="flex item-center">
              <Image
                src="/images/icons/diamond.png"
                width={192}
                height={192}
                alt="diamond icon"
                className="w-[26.133vw] md:w-[8.49vw] h-auto "
              />
            </div>
            <div className="md:ml-[2vw]">
              <p className="text-[4.8vw] md:text-[24px] text-[#666666] m-auto text-center">
                -- 总精钻 --
              </p>
              <p className="text-[8vw] md:text-[4.126vw] text-[#f04c7e] font-bold">
                {getUserPremiumDiamond(t, state.user)}
              </p>
            </div>
          </div>
          <div className="h-[1px] bg-[#cdcdcd]" />
          <div className="text-[2.933vw] md:text-[1.533vw] 2xl:text-[0.833vw] text-[#666666] pt-[5vw] md:pt-[2vw] pb-[8.5vw] md:pb-[3.6vw] flex flex-col gap-1">
            <p>1美金=10精钻</p>
            <p>
              精钻可购买VIP尊荣会员与黄游，钻石可用于游戏中使用，其他则用金币购买，如有疑问请与客服联络
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[min(80px,15.333vw)] md:max-w-[65%] xl:max-w-[42%] md:mx-auto flex gap-3 px-[20px] mt-[14.4vw] md:mt-[2vw]">
        <LinkComponent
          className="w-full rounded-[10px] bg-gradient-to-t from-[rgba(253,140,79,0.9999999999999999)] to-[rgba(250,114,154,0.996078431372549)] flex items-center gap-3 py-[7.65vw] px-[2vw] md:p-[2vw]"
          routes={profile.pages.profileDirectBuyVip}
        >
          <Image
            className="payment_container_buttonbox_button_content_img h-[min(70px,10.667vw)] !w-[min(70px,10.667vw)]"
            src="/images/profile/vip_buy_icon.png"
            width={192}
            height={192}
            alt="vip"
          />
          <p className="text-[min(30px,4.8vw)] text-white font-bold">VIP直购</p>
        </LinkComponent>
        <LinkComponent
          className="w-full rounded-[10px] bg-gradient-to-t from-[rgba(253,140,79,0.9999999999999999)] to-[rgba(250,114,154,0.996078431372549)] flex items-center gap-3 py-[7.65vw] px-[2vw] md:p-[2vw]"
          routes={{
            linkurl:
              apiUrl +
              requestUrlConstants.toPaymentPageUrl +
              `?uid=${state.user.id}&ctype=3&content-language=${lang}&origin=${window.location.origin}`,
          }}
        >
          <Image
            className="payment_container_buttonbox_button_content_img h-[min(70px,10.667vw)] !w-[min(70px,10.667vw)]"
            src="/images/profile/diamond_buy_icon.png"
            width={192}
            height={192}
            alt="vip"
          />
          <p className="text-[min(30px,4.8vw)] text-white font-bold">
            精钻充值
          </p>
        </LinkComponent>
      </div>
      <div className="payment_container !hidden">
        <div className="payment_container_buttonbox">
          <LinkComponent
            className="payment_container_buttonbox_button"
            routes={{
              linkurl:
                apiUrl +
                requestUrlConstants.toPaymentPageUrl +
                `?uid=${state.user.id}&ctype=2&content-language=${lang}`,
            }}
          >
            <p className="payment_container_buttonbox_button_content">
              <Image
                className="payment_container_buttonbox_button_content_img"
                src="/images/profile/payment_bipink.svg"
                width={0}
                height={0}
                alt={getPriceUnit(t)}
              />
              <span className="payment_container_buttonbox_button_content_span">
                {t("Profile.payment.charge.gold")}
              </span>
            </p>
          </LinkComponent>

          <LinkComponent
            className="payment_container_buttonbox_button"
            routes={profile.pages.profileDirectBuyVip}
          >
            <p className="payment_container_buttonbox_button_content">
              <Image
                className="payment_container_buttonbox_button_content_img"
                src="/images/profile/payment_vip.svg.svg"
                width={0}
                height={0}
                alt={getPriceUnit(t)}
              />
              <span className="payment_container_buttonbox_button_content_span">
                {t("Profile.payment.transfer.direct_purchase")}
              </span>
            </p>
          </LinkComponent>

          <LinkComponent
            className="payment_container_buttonbox_button"
            routes={{
              linkurl:
                apiUrl +
                requestUrlConstants.toPaymentPageUrl +
                `?uid=${state.user.id}&ctype=3&content-language=${lang}&origin=${window.location.origin}`,
            }}
          >
            <p className="payment_container_buttonbox_button_content">
              <Image
                className="payment_container_buttonbox_button_content_img"
                src="/images/profile/payment_rmbwhtie.svg"
                width={0}
                height={0}
                alt={getPriceUnit(t)}
              />
              <span className="payment_container_buttonbox_button_content_span">
                {t("Profile.payment.charge.drill")}
              </span>
            </p>
          </LinkComponent>
        </div>
      </div>
      <div className="list_container">
        {/*充值紀錄 */}
        {listData.map((listItem) => {
          return (
            <LinkComponent
              className="list_container_card"
              key={listItem.title}
              routes={listItem.routes}
            >
              <div className="list_container_card_body">
                <div className="list_container_card_body_item">
                  <div className="list_container_card_body_item_header">
                    <Image
                      className="list_container_card_body_item_header_icon"
                      src={listItem.icon}
                      width={0}
                      height={0}
                      alt={listItem.title}
                    />
                  </div>
                  <div className="list_container_card_body_item_body">
                    <p className="list_container_card_body_item_body_title fw-m ">
                      {listItem.title}
                    </p>
                  </div>
                </div>
                <div className="list_container_card_body_item_body_description ml-5">
                  <p className="list_container_card_body_item_body_text">
                    {listItem.text}
                  </p>
                </div>
              </div>
              <div className="list_container_card_footer">
                <FontAwesomeIcon
                  className="list_container_card_footer_icon"
                  icon={faAngleRight}
                />
              </div>
            </LinkComponent>
          );
        })}
        {/* 兌換金幣 */}
        {isMobile ? (
          <LinkComponent
            className="list_container_card !hidden"
            routes={{
              name: profile.pages.profileTransferCoin.name,
              path: profile.pages.profileTransferCoin.path,
            }}
          >
            <div className="list_container_card_body">
              <div className="list_container_card_body_item">
                <div className="list_container_card_body_item_header">
                  <Image
                    className="list_container_card_body_item_header_icon"
                    src="/images/profile/transfer_bicoin.svg"
                    width={0}
                    height={0}
                    alt={getPriceUnit(t)}
                  />
                </div>
                <div className="list_container_card_body_item_body">
                  <p className="list_container_card_body_item_body_title fw-m ">
                    {t("Profile.payment.transfer.gold")}
                  </p>
                </div>
              </div>
              <div className="list_container_card_body_item_body_description ml-5">
                <p className="list_container_card_body_item_body_text">
                  {t("Profile.payment.transfer.gold")}
                </p>
              </div>
            </div>
            <div className="list_container_card_footer">
              <FontAwesomeIcon
                className="list_container_card_footer_icon"
                icon={faAngleRight}
              />
            </div>
          </LinkComponent>
        ) : (
          <div
            className="list_container_card cursor !hidden"
            onClick={onOpenFloatCover}
          >
            <div className="list_container_card_body">
              <div className="list_container_card_body_item">
                <div className="list_container_card_body_item_header">
                  <Image
                    className="list_container_card_body_item_header_icon"
                    src="/images/profile/transfer_bicoin.svg"
                    width={0}
                    height={0}
                    alt={getPriceUnit(t)}
                  />
                </div>
                <div className="list_container_card_body_item_body">
                  <p className="list_container_card_body_item_body_title fw-m ">
                    {t("Profile.payment.transfer.gold")}
                  </p>
                </div>
              </div>
              <div className="list_container_card_body_item_body_description ml-5">
                <p className="list_container_card_body_item_body_text">
                  {t("Profile.payment.transfer.gold")}
                </p>
              </div>
            </div>
            <div className="list_container_card_footer">
              <FontAwesomeIcon
                className="list_container_card_footer_icon"
                icon={faAngleRight}
              />
            </div>
          </div>
        )}
        {/* 申請提現 */}
        <LinkComponent
          className="list_container_card"
          routes={{
            name: profile.pages.profileWithdraw.name,
            path: profile.pages.profileWithdraw.path,
          }}
        >
          <div className="list_container_card_body">
            <div className="list_container_card_body_item">
              <div className="list_container_card_body_item_header">
                <Image
                  className="list_container_card_body_item_header_icon"
                  src="/images/profile/transfer_withdraw.svg"
                  width={0}
                  height={0}
                  alt={"transferWithDraw"}
                />
              </div>
              <div className="list_container_card_body_item_body">
                <p className="list_container_card_body_item_body_title fw-m ">
                  {t("Profile.payment.transfer.with_draw")}
                </p>
              </div>
            </div>
            <div className="list_container_card_body_item_body_description ml-5">
              <p className="list_container_card_body_item_body_text">
                {t("Profile.payment.transfer.with_draw_content")}
              </p>
            </div>
          </div>
          <div className="list_container_card_footer">
            <FontAwesomeIcon
              className="list_container_card_footer_icon"
              icon={faAngleRight}
            />
          </div>
        </LinkComponent>
        {/* 在线客服 */}
        <div
          className="list_container_card cursor-pointer"
          onClick={() => {
            openCrispChatInNewTab();
          }}
        >
          <div className="list_container_card_body">
            <div className="list_container_card_body_item">
              <div className="list_container_card_body_item_header">
                <Image
                  className="list_container_card_body_item_header_icon"
                  src="/images/profile/transfer_withdraw.svg"
                  width={0}
                  height={0}
                  alt="transferWithDraw"
                />
              </div>
              <div className="list_container_card_body_item_body">
                <p className="list_container_card_body_item_body_title fw-m">
                  {t("Profile.payment.charge.qna")}
                </p>
              </div>
            </div>
          </div>
          <div className="list_container_card_footer">
            <FontAwesomeIcon
              className="list_container_card_footer_icon"
              icon={faAngleRight}
            />
          </div>
        </div>
      </div>

      {/* PC版的換金幣MODAL */}
      <FloatElement>
        <div
          className="float_cover"
          style={{
            height: showTransfer ? "70vh" : "0vh",
            transform: showTransfer && "translateY(" + -70 + `vh) `,
            display: isMobile && "none",
          }}
        >
          <div className="float_cover_container">
            <div className="float_cover_header">
              <div className="float_cover_header_left">
                兑换{getPriceUnit(t)}
              </div>
              <div
                className="float_cover_header_right cursor"
                onClick={() => goHistory(profile.pages.profileTransferRecord)}
              >
                记录
              </div>
              <div className="float_cover_close" onClick={onCloseFloatCover}>
                <CloseIcon
                  fontSize="large"
                  className="float_cover_close_img cursor"
                />
              </div>
            </div>
            <div className="float_cover_body">
              <ProfileTransferCoinPage />
            </div>
          </div>
        </div>
      </FloatElement>
      {/* PC版的換金幣MODAL的背景 */}
      <div
        className="background_cover"
        onClick={onCloseFloatCover}
        style={{ display: !showTransfer && "none" }}
      />
    </ProfilePaymentElement>
  );
};

export default ProfilePayment;

export const FloatElement = styled.div`
  /* */
  .float_cover {
    padding-top: 0.5em;
    position: fixed;
    bottom: -70vh;
    z-index: 100;
    width: 100%;
    background-color: #fff;
    transition-duration: 2s;
    display: flex;
    justify-content: center;
    align-items: center;

    &_container {
      height: 100%;
      position: relative;
      width: 100%;
      padding: 0 34%;
    }

    &_header {
      padding: 4% 5%;
      display: flex;
      justify-content: space-between;
      font-size: 1.6rem;
      font-weight: 700;
      @media (max-width: 899px) {
        font-size: 1.2rem;
      }
      &_left {
        color: ${colors.text_grey};
        border-radius: 9px;
      }
      &_right {
        color: ${colors.back_dark_pink};
      }
    }
    &_body {
      overflow: auto;
      height: 100%;
      padding: 4% 5%;
      margin-bottom: 5%;
      &_icon {
        @media (max-width: 899px) {
          width: 30px !important;
        }
      }
    }
    &_close {
      position: absolute;
      top: 10px;
      right: 10px;
      color: ${colors.text_grey};
      @media (max-width: 899px) {
        top: 2%;
        right: 5%;
      }
      &_img {
        font-size: 3rem;
        @media (max-width: 899px) {
          font-size: 2rem;
        }
      }
    }
  }
`;
export const ProfilePaymentElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding: ${main_height}px 0px;
    .info_container {
        position: relative;
        z-index: 1;
        padding: 4.95vw 2.1vw 3vw;
        margin-bottom: 70px;
        @media (max-width: 767px) {
          padding: 9.75vw 4.667vw 3vw;
        }

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 16.667vw;
            background-image: url("/images/profile/topup_bg.png");
            background-size: cover; 
            background-repeat: no-repeat;
            background-position: center;
            z-index: -1;

            @media (max-width: 767px) {
              height: 42.667vw;
            }
        }

        &_content {
        padding: 1.6vw;
        margin-bottom: -70px;
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #0001;
        border-radius: 10px;
        box-shadow: 0 4px 12px #0005;
        @media (max-width: 767px) {
          padding: 2.0vw 3.333vw;
        }

        &_title {
            font-size: 24px;
            font-weight: 600;
            margin-left: 1%;
            margin-top: 10px;
            color: #333333;
            @media (max-width: 767px) {
              font-size: 4vw;
            }
        }

        &_account {
            display: flex;
            justify-content: center;
            margin-top: 20px;

            &_card {
            padding-top: 2%;
            position: relative;
            display: flex;
            justify-content: flex-start;
            width: 50%;

            &_header {
                &_icon {
                &_img {
                    width: 35px;
                    vertical-align: middle;
                }
                }
            }

            &_body {
                margin-left: 10px;
                font-size: 30px;
                @media (max-width: 599px) {
                font-size: 20px;
                margin-left: 0px;
                }
                &_amount {
                font-weight: 900;
                }

                &_description {
                margin-top: 5px;
                font-size: 16px;
                color: #a8a8a8;
                }
            }

            &:first-of-type {
                &::after {
                content: "";
                position: absolute;
                top: 0;
                right: -0.5px;
                bottom: 0;
                border-right: 1px solid #0003;
                }
            }
            }
        }

        &_description {
            margin-top: 40px;

            &_text {
            font-size: 12px;
            color: #999;
            }
        }
        }
    }

    .payment_container {
        margin-top: 70px;

        &_buttonbox {
        display: flex;
        justify-content: center;
        @media (max-width: 899px) {
            gap: 0;
            justify-content: space-around;
        }
        &_button {
            cursor: pointer;
            font-size: 24px;
            text-align: center;
            text-decoration: none;
            padding: 1% 3%;
            margin: 2% 5%;
            color: ${colors.dark_pink};
            border: 3px solid ${colors.dark_pink};
            border-radius: 5px;
            @media (max-width: 899px) {
            padding: 2%;
            font-size: 16px;
            margin: 1%;
            }

            &_content {
            display: flex;
            justify-content: center;
            align-items: center;
            &_img {
                width: 35px;
                vertical-align: middle;
                @media (max-width: 899px) {
                width: 25px;
                }
            }

            &_span {
                vertical-align: middle;
                font-weight: 700;
            }
            }

            &:last-of-type {
            color: #fff;
            background-color: ${colors.dark_pink};
            }
        }
        }
    }

    .list_container {
        margin-top: 20px;
        padding: 0 1%;
        @media (max-width: 767px) {
            margin: 13vw 0;
        }

        &_card {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        text-decoration: none;
        color: #000;
        border-bottom-width: 1px;
        border-style: solid;
        border-color: #a8a8a8;

        &_body {
            &_item {
            display: flex;

            &_header {
                padding: 5px;

                &_icon {
                width: 35px;
                vertical-align: middle;
                @media (max-width: 899px) {
                    width: 25px;
                }
                }
            }

            &_body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 5px;

                &_title {
                font-size: 16px;
                  @media (max-width: 767px) {
                    font-size: 2.933vw;
                  }
                }

                &_text {
                font-size: 16px;
                color: #a8a8a8a8;
                }
            }
            }
        }

        &_footer {
            display: flex;
            align-items: center;
            font-size: 26px;
            &_icon {
            color: #646464;
            }
        }
        }
    }

    .background_cover {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: black;
        opacity: 0.5;
        z-index: 99;
    }
  `}
`;
