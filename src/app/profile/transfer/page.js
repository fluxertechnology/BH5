"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { styled as muiStyled } from "@mui/material/styles";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { useTranslations } from "next-intl";
import { colors, pageUrlConstants } from "@/lib/constants";
import { CardActionArea } from "@mui/material";
import Button from "@mui/lab/LoadingButton";
import useMediaQuery from "@/hooks/useMediaQuery";
import callToast from "@/lib/services/toastCall";
import FloatTip from "@/components/common/FloatTip";
import Image from "next/image";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { pushRoutes } from "@/store/actions/historyActions";
import {
  getTransferMoneyRule,
  postTransferMoney,
} from "@/store/actions/pages/profileTransferCoinAction";

const MuiButton = muiStyled((props) => <Button {...props} />)(
  ({ disabled }) => ({
    "&.MuiButton-root": {
      color: "#fff",
      borderRadius: 35,
      backgroundColor: disabled ? "#a8a8a8" : colors.back_dark_pink,
      width: "100%",
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: 0,
    },
  })
);

const { profile } = pageUrlConstants;
const ProfileTransferCoinRender = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const [transferPrice, setTransferPrice] = useState();
  const [buttonStatus, setButtonStatus] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [floatTipStatus, setFloatTipStatus] = useState(false);
  const [Tips] = useState(() => ({
    Title: t("Profile.transfer.redeem.title"),
    Content: t("Profile.transfer.redeem.content"),
    Button: t("Profile.transfer.redeem.continue_redeem"),
    Button_b: t("Profile.transfer.redeem.watch_now"),
  }));
  const { money } = state.user;
  function onSelectPrice(diamond) {
    setTransferPrice(diamond);
  }
  function onTransferMoney() {
    if (transferPrice) {
      const nowRule = state.getTransferMoney.find(
        (data) => data.money === transferPrice
      );
      setButtonLoading(true);
      postTransferMoneyFunc(nowRule, (Boolean) => {
        if (Boolean) {
          setFloatTipStatus(true);
        }
        setButtonLoading(false);
      });
    } else {
      callToast("請先選擇一項將兌換的金幣數量");
    }
  }
  useEffect(() => {
    if (transferPrice > money) {
      setButtonStatus(false);
    } else {
      setButtonStatus(true);
    }
  }, [transferPrice]);
  useEffect(() => {
    getTransferMoneyRuleFunc();
  }, []);
  const buttonContent = buttonStatus
    ? buttonLoading
      ? t("Profile.buy.label.redeem_ing")
      : t("Profile.buy.label.redeem_now")
    : t("Profile.buy.label.irredeemable");

  const goHistory = (route) => {
    useGlobalDispatch(pushRoutes(route));
  };
  const getTransferMoneyRuleFunc = () => {
    useGlobalDispatch(getTransferMoneyRule());
  };
  const postTransferMoneyFunc = (rule, callback) => {
    useGlobalDispatch(postTransferMoney(rule, callback));
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => {
          return (
            <>
              {isMobile && (
                <TopBarContainer show_shadow={false}>
                  <TopTitleBar
                    title={t("Profile.payment.transfer.gold")}
                    showBack={true}
                    show_back_color="#ffffff"
                    onChildrenClick={() =>
                      goHistory(profile.pages.profileTransferRecord)
                    }
                  >
                    {t("Profile.payment.charge.history_1")}
                  </TopTitleBar>
                </TopBarContainer>
              )}
            </>
          );
        },
        isShowFooter: false,
      },
    });
  }, [isMobile]);

  return (
    <ProfileTransferCoinElement main_height={state.navbar.mainHeight}>
      <FloatTip
        status={floatTipStatus}
        setStatus={setFloatTipStatus}
        Tips={Tips}
      />

      <div className="transfer_container_own_money_card">
        <div className="transfer_container_own_money_card_title">
          <div className="transfer_container_own_money_card_title_left">
            {t("Profile.payment.charge.own_money")}
          </div>
          <div className="transfer_container_own_money_card_title_right"></div>
        </div>
        <div className="transfer_container_own_money_content">{money}</div>
      </div>
      <div className="transfer_container">
        <div className="transfer_container_exchange_instructions">
          {t("Profile.transfer.exchange_captions")}
          <ol>
            <li>{t("Profile.transfer.captions_1")}</li>
            <li>{t("Profile.transfer.captions_2")}</li>
            <li>{t("Profile.transfer.captions_3")}</li>
          </ol>
        </div>
        <div className="transfer_container_exchange_items">
          {state.getTransferMoney.map((data, key) => {
            return (
              <div className="transfer_container_exchange_item" key={key}>
                <CardActionArea onClick={() => onSelectPrice(data.money)}>
                  <div
                    className={`transfer_container_exchange_item_top ${
                      data.money === transferPrice && "active"
                    }`}
                  >
                    <div className="mb-2">{t("Profile.transfer.redeem.")}</div>
                    <div className="transfer_container_exchange_item_top_description">
                      <Image
                        src="/images/profile/icon_coin.svg"
                        width={0}
                        height={0}
                        alt="coin"
                      />
                      {data.transform_sign}
                      {t("Global.gold_money")}
                    </div>
                  </div>
                  <div className="transfer_container_exchange_item_bottom">
                    <div className="transfer_container_exchange_item_bottom_tip">
                      {t("Profile.transfer.redeem.")}
                      {data.transform_sign}
                      {t("Global.gold_money")}
                    </div>
                    <div className="transfer_container_exchange_item_bottom_description">
                      {t("Profile.transfer.deduct")}
                      {data.money}
                      {t("Global.money")}
                    </div>
                  </div>
                </CardActionArea>
              </div>
            );
          })}
        </div>
        <div className="transfer_button">
          <MuiButton
            disabled={!buttonStatus}
            loading={buttonLoading}
            onClick={onTransferMoney}
            className="transfer_button_style"
          >
            {buttonContent}
          </MuiButton>
        </div>
      </div>
    </ProfileTransferCoinElement>
  );
};
export default ProfileTransferCoinRender;

export const ProfileTransferCoinElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding-top: ${main_height}px;
    @media (min-width: 599px) {
        padding-top: 0px;
    }
    .transfer_container {
        padding: 3% 3% 15% 3%;
        @media (min-width: 899px) {
        padding: 3% 3% 35% 3%;
        }
        &_own_money {
        &_card {
            width: 100%;
            border-radius: 5px;
            background-image: url(/images/profile/transfer_bg.svg);
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);

            &_title {
            display: flex;
            justify-content: space-between;
            padding: 5%;
            font-size: 1rem;
            align-self: center;
            font-weight: 700;
            @media (min-width: 599px) {
                font-size: 1.6rem;
            }
            }
        }
        &_content {
            font-size: 1.2rem;
            padding: 5%;
            @media (min-width: 599px) {
            font-size: 1.8rem;
            }
        }
        }
        &_exchange {
        &_instructions {
            margin: 2%;
            line-height: 1.3;
            ol {
            li {
                color: ${colors.text_grey};
                font-size: 0.9rem;
                @media (min-width: 599px) {
                font-size: 1.2rem;
                }
            }
            }
        }

        &_items {
            display: grid;
            grid-template-columns: repeat(2, auto);
            grid-column-gap: 1em;
            grid-row-gap: 1em;
        }

        &_item {
            padding: 1%;
            &_top {
            text-align: center;
            background-color: #f3f4f5;
            radius: 5px;
            height: 12vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 1rem;
            border: solid 3px #f3f4f5;
            border-radius: 5px;
            &.active {
                border: solid 3px #f24c7c;
                border-radius: 5px;
            }
            @media (min-width: 599px) {
                font-size: 1.4rem;
            }
            &_description {
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fac500;
                font-weight: 700;
                img {
                margin-right: 0.2em;
                width: 15px;
                height: 15px;
                }
            }
            }
            &_bottom {
            margin-top: 1em;
            &_tip {
                font-size: 1rem;
                @media (min-width: 599px) {
                font-size: 1.6rem;
                }
            }
            &_description {
                font-size: 0.8rem;
                color: ${colors.text_grey};
                @media (min-width: 599px) {
                font-size: 1.4rem;
                }
            }
            }
        }
        }
    }
    .transfer_button {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        @media (min-width: 599px) {
        width: 30%;
        left: 35%;
        position: absolute;
        }
        &_style {
        font-size: 1.2rem;
        @media (min-width: 599px) {
            font-size: 1.8rem;
        }
        }
    }
`}
`;
