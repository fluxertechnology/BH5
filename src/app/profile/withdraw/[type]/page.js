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
    <WithdrawPageElement main_height={state.navbar.mainHeight}>
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
        <div className="absolute inset-x-0 mx-auto z-[1] w-[15%] border-2 border-solid">
          <p className="text-[4.8vw] md:text-[24px]">-- 总精钻 --</p>
          <p> {getUserPremiumDiamond(t, { money: userBalance })}</p>
          <p>
            可提现：{getUserPremiumDiamond(t, { money: withdrawableAmount })}
          </p>
        </div>
        <ImageComponent
          className="w-full"
          height="45vh"
          src={withdrawOptions[type]?.backgroundImage}
        />
      </div>
      <div className="absolute bottom-0 w-full h-[60%]">
        <div className="h-full mx-[2%] rounded border-2 border-solid">
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
  ${({ main_height }) => `
    padding-top: ${main_height}px;
  `}
`;
