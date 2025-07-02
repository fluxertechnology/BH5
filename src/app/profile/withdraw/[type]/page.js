"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import callToast from "@/lib/services/toastCall";
import useMediaQuery from "@/hooks/useMediaQuery";
import { pageUrlConstants, apiUrl } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useWithdraw from "@/hooks/useWithdraw";
import { getUserPremiumDiamond } from "@/lib/services/price";
import { useParams } from "next/navigation";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import LinkComponent from "@/components/common/LinkComponent";
import ImageComponent from "@/components/common/ImageComponent";
import LoadingComponent from "@/components/common/LoadingComponent";

import AlipayWithdraw from "@/app/profile/withdraw/[type]/AlipayWithdraw";
import AppleWalletWithdraw from "@/app/profile/withdraw/[type]/AppleWalletWithdraw";
import BankWithdraw from "@/app/profile/withdraw/[type]/BankWithdraw";
import USDTWithdraw from "@/app/profile/withdraw/[type]/USDTWithdraw";

function WithdrawPage() {
  const t = useTranslations();
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const { type } = useParams();

  const withdrawOptions = {
    alipay: {
      title: `支付宝${t("Profile.withdraw.title")}`,
      backgroundImage: "/images/profile/withdraw_bg_alipay.png",
      component: AlipayWithdraw,
    },
    "apple-wallet": {
      title: `Apple Wallet ${t("Profile.withdraw.title")}`,
      backgroundImage: "/images/profile/withdraw_bg_apple_wallet.png",
      component: AppleWalletWithdraw,
    },
    bank: {
      title: `银行卡 ${t("Profile.withdraw.title")}`,
      backgroundImage: "/images/profile/withdraw_bg_bank.png",
      component: BankWithdraw,
    },
    usdt: {
      title: `USDT ${t("Profile.withdraw.title")}`,
      backgroundImage: "/images/profile/withdraw_bg_usdt.png",
      component: USDTWithdraw,
    },
  };

  const {
    userBalance,
    withdrawableAmount,
    withdrawThreshold,
    paymentMethods,
    loading,
  } = useWithdraw();

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        show: false,
        isShowFooter: false,
      },
    });
  }, []);

  return (
    <WithdrawPageElement main_height={state.navbar.mainHeight} bg={withdrawOptions[type]?.backgroundImage}>
      <TopBarContainer>
        <TopTitleBar
          title={withdrawOptions[type]?.title || t("Profile.withdraw.title")}
          showBack={true}
          show_back_color="#ffffff"
        >
          <LinkComponent
            className="profile_with_draw_history"
            routes={{
              name: pageUrlConstants.profile.pages.profilePaymentWithDrawHistory
                .name,
              path: pageUrlConstants.profile.pages.profilePaymentWithDrawHistory
                .path,
            }}
          >
            {t("Profile.payment.charge.history_1")}
          </LinkComponent>
        </TopTitleBar>
      </TopBarContainer>

      <LoadingComponent isLoading={loading} />

      <div className="relative">
        <div className="info-container">
          <p className="title">-- 总精钻 --</p>
          <p className="amount"> {userBalance}</p>
          <p className="available-amount">
            可提现：{getUserPremiumDiamond(t, { money: withdrawableAmount })}
          </p>
        </div>
      </div>
      <div className="absolute bottom-[19px] w-full h-[60%]">
        <div className="component-container">
          {withdrawOptions[type]?.component ? (
            (() => {
              const Component = withdrawOptions[type].component;
              return (
                <Component
                  userBalance={userBalance}
                  withdrawableAmount={withdrawableAmount}
                  withdrawThreshold={withdrawThreshold}
                  paymentMethod={
                    paymentMethods.find((e) => e.name === type) || {}
                  }
                />
              );
            })()
          ) : (
            <div className="text-center p-4">未知的提现类型: {type}</div>
          )}
        </div>
      </div>
    </WithdrawPageElement>
  );
}

export default WithdrawPage;

const WithdrawPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height,bg }) => `
    margin-top: ${main_height}px;
    font-family: "Microsoft YaHei";
    background: ${bg ? `url(${bg})` : "none"};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    height: 23.96vw;
  
    .info-container{
      // display:flex;
      position: absolute;
      // margin: calc(${main_height}px + 3.65vw) 0 1.72vw 53.7vw;
      top: 3.67vw;
      left: 53.7vw;
      border-radius: 10px;
      padding-top: 1vw;
      background-image: -moz-linear-gradient( 90deg, rgb(254,224,233) 0%, rgb(255,255,255) 100%);
      background-image: -webkit-linear-gradient( 90deg, rgb(254,224,233) 0%, rgb(255,255,255) 100%);
      background-image: -ms-linear-gradient( 90deg, rgb(254,224,233) 0%, rgb(255,255,255) 100%);
      width: 14.58vw;
      height: 8.85vw;

      .title{
        font-size: 1.25vw;
        color: rgb(102, 102, 102);
        line-height: 1.2;
        text-align: center;
        font-weight: 300;
      }

      .amount {
        font-size: 3.75vw;
        color: rgb(255, 69, 122);
        line-height: 0.98;
        text-align: center;
      }


      .available-amount{
        background-image: -moz-linear-gradient( 0deg, rgb(254,177,112) 0%, rgb(240,76,126) 100%);
        background-image: -webkit-linear-gradient( 0deg, rgb(254,177,112) 0%, rgb(240,76,126) 100%);
        background-image: -ms-linear-gradient( 0deg, rgb(254,177,112) 0%, rgb(240,76,126) 100%);
        position: absolute;
        height: 1.98vw;
        width: 100%;
        bottom:0;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        font-size: 1.25vw;
        color: rgb(255, 255, 255);
        line-height: 1.2;
        text-align: center;
        display:flex;
        align-items:center;
        justify-content:center;
      } 
    }

    .component-container{
      border-width: 1px;
      border-color: rgb(205, 205, 205);
      background-color: #ffffff;
      border-style: solid;
      border-radius: 20px;
      width: 95.89vw;
      margin: auto;
      padding: 3.13vw;
    }
  `}
`;
