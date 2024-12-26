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
      data: state.user.sign,
      text: t("Profile.payment.own_gold"),
    },
    {
      icon: "/images/icons/bag_money.svg",
      data: state.user.money,
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
        data: state.user.sign,
        text: t("Profile.payment.own_gold"),
      },
      {
        icon: "/images/icons/bag_money.svg",
        data: state.user.money,
        text: t("Profile.payment."),
      },
    ]);
  }, [state.user.money, state.user.sign]);

  useEffect(() => {
    let Element = document.getElementsByClassName("PCFooterElement");
    if (!isMobile && Element.length)  {
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
        show: false,
      },
    });
  }, []);
  return (
    <ProfilePaymentElement main_height={state.navbar.mainHeight}>
      <TopBarContainer show_shadow={false}>
        <TopTitleBar
          title={t("Global.action.charge_1")}
          showBack={true}
          show_back_color="#ffffff"
        />
      </TopBarContainer>

      <div className="info_container">
        <div className="info_container_content">
          <div className="info_container_content_title">
            <p className="info_container_content_title_text">
              {t("Profile.payment.own_account")}
            </p>
          </div>
          <div className="info_container_content_account">
            {infoData?.map((value) => {
              return (
                <div
                  className="info_container_content_account_card ml-3"
                  key={value.text}
                >
                  <div className="info_container_content_account_card_header">
                    <div className="info_container_content_account_card_header_icon">
                      <Image
                        className="info_container_content_account_card_header_icon_img"
                        src={value.icon}
                        width={0}
                        height={0}
                        alt={value.text}
                      />
                    </div>
                  </div>
                  <div className="info_container_content_account_card_body">
                    <div className="info_container_content_account_card_body_amount">
                      {value.data}
                    </div>
                    <div className="info_container_content_account_card_body_description ">
                      {value.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="info_container_content_description">
            <p className="info_container_content_description_text">
              {t("Profile.payment.description")}
            </p>
          </div>
        </div>
      </div>
      <div className="payment_container">
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
                alt={t("Global.gold_money")}
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
                alt={t("Global.gold_money")}
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
                `?uid=${state.user.id}&ctype=1&content-language=${lang}`,
            }}
          >
            <p className="payment_container_buttonbox_button_content">
              <Image
                className="payment_container_buttonbox_button_content_img"
                src="/images/profile/payment_rmbwhtie.svg"
                width={0}
                height={0}
                alt={t("Global.money")}
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
            className="list_container_card"
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
                    alt={t("Global.gold_money")}
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
            className="list_container_card cursor"
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
                    alt={t("Global.gold_money")}
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
            name: profile.pages.profilePaymentWithDraw.name,
            path: profile.pages.profilePaymentWithDraw.path,
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
              <div className="float_cover_header_left">兑换金币</div>
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
    padding: ${main_height}px 0;
    .info_container {
        position: relative;
        z-index: 1;
        padding: ${padding}px;
        margin-bottom: 70px;
        background-color: ${colors.dark_pink};

        &_content {
        padding: 2%;
        margin-bottom: -70px;
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #0001;
        border-radius: 10px;
        box-shadow: 0 4px 12px #0005;

        &_title {
            font-size: 20px;
            font-weight: 900;
            margin-left: 1%;
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
        padding: 0 1%;
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