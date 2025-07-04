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
import Image from "next/image";
import LoadingComponent from "@/components/common/LoadingComponent";

import AlipayWithdraw from "@/app/profile/withdraw/[type]/AlipayWithdraw";
import AppleWalletWithdraw from "@/app/profile/withdraw/[type]/AppleWalletWithdraw";
import BankWithdraw from "@/app/profile/withdraw/[type]/BankWithdraw";
import USDTWithdraw from "@/app/profile/withdraw/[type]/USDTWithdraw";

function WithdrawPage() {
  const t = useTranslations();
  const { state } = useGlobalContext();
  const { isDesktop } = useMediaQuery();
  const { type } = useParams();

  const withdrawOptions = {
    alipay: {
      title: `支付宝${t("Profile.withdraw.title")}`,
      backgroundImage: "/images/profile/withdraw_bg_alipay.png",
      mobileBackgroundImage: "/images/profile/withdraw_mobile_bg_alipay.png",
      component: AlipayWithdraw,
    },
    "apple-wallet": {
      title: `Apple Wallet ${t("Profile.withdraw.title")}`,
      backgroundImage: "/images/profile/withdraw_bg_apple_wallet.png",
      mobileBackgroundImage:
        "/images/profile/withdraw_mobile_bg_apple_wallet.png",
      component: AppleWalletWithdraw,
    },
    bank: {
      title: `银行卡 ${t("Profile.withdraw.title")}`,
      backgroundImage: "/images/profile/withdraw_bg_bank.png",
      mobileBackgroundImage: "/images/profile/withdraw_mobile_bg_bank.png",
      component: BankWithdraw,
    },
    usdt: {
      title: `USDT ${t("Profile.withdraw.title")}`,
      backgroundImage: "/images/profile/withdraw_bg_usdt.png",
      mobileBackgroundImage: "/images/profile/withdraw_mobile_bg_usdt.png",
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
    <WithdrawPageElement
      main_height={state.navbar.mainHeight}
      bg={withdrawOptions[type]?.backgroundImage}
      mobileBg={withdrawOptions[type]?.mobileBackgroundImage}
    >
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

      <div className="info-container--outer">
        <div className="info-container">
          <p className="title">-- 总精钻 --</p>
          <p className="amount"> {userBalance}</p>
          <p className="available-amount">
            可提现：{getUserPremiumDiamond(t, { money: withdrawableAmount })}
          </p>
        </div>
      </div>
      <div className="component-container--outer">
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
      {/* 提示信息 */}
      {!isDesktop && (
        <p className="tip">
          <span className="tip-icon">※</span>{" "}
          提现精钻仅限通过实名认证的账号，点击账户信息页可申请提现
        </p>
      )}
    </WithdrawPageElement>
  );
}

export default WithdrawPage;

const WithdrawPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height, bg, mobileBg }) => `
    margin-top: ${main_height}px;
    font-family: "Microsoft YaHei";
    background: ${bg ? `url(${bg})` : "none"};
    background-position: top;
    background-repeat: no-repeat !important;
    background-size: 100% 23.96vw ;
    // height: 23.96vw;
  
    .info-container--outer{
      position: relative;
      top: 0;

      .info-container{
        // display:flex;
        position: relative;
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


        .available-amount {
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
    }

    .component-container--outer {
      margin: 13.6vh 0 5vh;
      position: relative;
      bottom: 19px;
      width: 100%;
      height:60%;


      .component-container {
        border-width: 1px;
        border-color: rgb(205, 205, 205);
        background-color: #ffffff;
        border-style: solid;
        border-radius: 20px;
        width: 95.89vw;
        margin: auto;
        padding: 3.13vw;
      }
    }



    .withdraw-container {
      font-family: 'Microsoft YaHei', sans-serif;

      .form-section {

        .form-group {
          margin-bottom: 5.056vw;
          
          .form-label {
            display: block;
            padding-bottom: 0.69vw;
            margin-bottom: 2.24vw;
            font-size: 1.25vw;
            font-family: "Microsoft YaHei";
            color: rgb(255, 69, 122);
            font-weight: 700;
            line-height: 1.2;
            text-align: left;
            border-bottom: 1px solid rgb(205, 205, 205);
          }

          .form-inputs {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 0 auto;
            width: 32.24vw;

            .input,
            .select {
              width: 100%;
              height: 3.65vw;
              padding: 10px 14px;
              border: 1px solid #ccc;
              font-size: 14px;
              box-sizing: border-box;
              border-color: rgb(205, 205, 205);
              border-style: solid;
              background-color: rgb(255, 255, 255);
              border-width: 1px;
              box-shadow: inset 0px -3px 7px 0px rgba(0, 0, 0, 0.1);
              font-size: 0.83vw;
              color:#5c5c5c;
            }

            .input-row {
              display: flex;
              align-items: center;
              gap: 6px;
              position: relative;

              .currency {
                position: absolute;
                right: 3.7vw;
                top: 50%;
                transform: translateY(-50%);
                font-weight: bold;
                font-size: 14px;
                color: #333;
              }

              .flag {
                position: absolute;
                right: 1.04vw;
                top: 50%;
                transform: translateY(-50%);
                width: 2.03vw;
                height: 2.03vw;
              }
            }

            .summary {
              display: flex;
              flex-direction: column;
              gap: 10px;
              color: #666;
              margin-bottom: 0.5vw;

              .summary-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              .value-with-bullet {
                display: flex;
                align-items: center;
                gap: 6px;

                .bullet {
                  width: 1.09vw;
                  height: 1.09vw;
                  background-color: #ccc;
                  border-radius: 50%;
                  font-size: 1.16vw;
                  color: #fff;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  line-height: 1;
                  font-family: 'Microsoft YaHei', sans-serif;
                  padding-bottom: 0.23vw;
                  padding-right: 0.03vw;
                }


                .value {
                  font-weight: bold;
                  color: #5c5c5c;
                  font-size: 1.15vw;
                  margin-left: 1.3vw;
                  
                }
              }

              .label {
                color: #5c5c5c;
                font-size: 0.94vw;
              }
            }
              
          }
        }

        .submit-container {
          text-align: center;
          margin-top: 10px;

          .submit-button {
            background: linear-gradient(90deg, rgb(249,54,34) 0%, rgb(255,69,122) 100%);
            border: none;
            border-radius: 999px;
            padding: 12px 48px;
            font-size: 16px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
            width: 18.75vw;
            height: 4.69vw;
            font-size: 1.56vw;
            color: rgb(255, 255, 255);
            line-height: 1.2;

            &:hover {
              opacity: 0.9;
            }
          }
        }

        .tip {
          color: rgb(102, 102, 102);
          font-size: 0.83vw;
          margin-top: 4.48vw;
          padding-top: 2.14vw;
          padding-bottom: 5.3vw;
          text-align: center;
          border-top: 1px solid rgb(205, 205, 205);
          border-bottom: 1px solid rgb(205, 205, 205);

          .tip-icon {
            color: rgb(255, 69, 122);
            font-weight: bold;
            margin-right: 5px;
          }
        }
      }
    }

    @media (max-width: 1024px) {

      background: ${mobileBg ? `url(${mobileBg})` : "none"};
      background-size: 100% 53.33vw;
      background-position: top;
      
      .info-container--outer{

        .info-container {
          border-radius: 1.33vw;
          left: 56.93vw;
          top: 7.6vw;
          width: 37.33vw;
          height: 22.67vw;
          padding-top: 2.5vw;

          .title {
            font-size: 3.2vw;
            line-height: 1.2;

          }
          .amount {
            font-size: 9.6vw;
          }
          .available-amount {
            height: 5.07vw;
            font-size: 3.2vw;
          }
        }
      }

      .component-container--outer{
        bottom: -0.7vw;
        width: 100%;
        margin-bottom: 4.9vw;

        .component-container {
          width: 93.33vw;
          padding: 6.6vw 5.73vw 13.9vw;
        }
      }

      .withdraw-container {
        .form-section {
          .form-group {
            .form-label {
                margin-bottom: 2.83vw;
                border-bottom: none;
                font-size: 4vw;
            }

            .form-inputs {
              width: 82.53vw;

              .input,
              .select  {
                height: 9.33vw;
                font-size: 2.4vw;
                padding: 0 2.4vw;
              }

              .input-row {
                .currency {
                  right: 9.47vw;
                  font-size: 3.2vw;
                }
                .flag {
                  width: 5.2vw;
                  height: 5.2vw;
                  right: 2.67vw;
                }
              }

              .summary {
                margin: 2.8vw 0 3.3vw;
                .summary-item {
                  .value-with-bullet {
                    .bullet {
                      height: 3.73vw;
                      width: 3.73vw;
                      font-size: 4vw;
                      padding-bottom: 0.50vw;
                      padding-right: 0.03vw;
                    }
                    .value {
                      font-size: 2.93vw;
                      margin-right: 2.13vw;
                    }
                  }
                  .label {
                  
                    font-size: 2.93vw;
                  }
                }
              }
            }
          }

          .submit-container {
            margin-top: 8.6vw;
            .submit-button {
              width: 46.67vw;
              height: 10.67vw;
              font-size: 4vw;
            }
          }

          .tip {
            font-size: 2.4vw;
            .tip-icon {}
          }
        }
      }

    }

    .tip {
      color: rgb(102, 102, 102);
      font-size: 2.4vw;
      margin: 0 auto 20.48vw;
      text-align: center;
      border-width: 1px;
      border-color: rgb(205, 205, 205);
      background-color: #ffffff;
      border-style: solid;
      border-radius: 20px;
      width: 93.33vw;
      height: 20.9vw;
      padding: 5.6vw 5.73vw;


      .tip-icon {
        color: rgb(255, 69, 122);
        font-weight: bold;
        margin-right: 5px;
      }
    }

  `}
`;
