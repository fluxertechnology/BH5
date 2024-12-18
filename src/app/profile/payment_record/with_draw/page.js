"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import WavaButton from "@/components/layout/Header/WavaButton";
import { colors, pageUrlConstants, REG_SET } from "@/lib/constants";
import callToast from "@/lib/services/toastCall";
import useMediaQuery from "@/hooks/useMediaQuery";
import LinkComponent from "@/components/common/LinkComponent";
import Image from "next/image";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { pushRoutes } from "@/store/actions/historyActions";
import { postWithDrawAction } from "@/store/actions/pages/profilePaymentWithDrawAction";

const { qqReg } = REG_SET;
const ProfilePaymentWithDraw = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const countRef = useRef();
  const { isMobile } = useMediaQuery();
  const [regErr, setRegErr] = useState(false);
  const [amount, setAmount] = useState(null);
  const [qqAcc, setQqAcc] = useState();
  function qqAccEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setQqAcc(e.target.value);
    if (key === 13) {
      onSubmit();
    }
  }

  function onSubmit() {
    if (qqReg.test(qqAcc)) {
      if (amount % 10 !== 0) {
        callToast("提领金额必须是10的倍数");
      } else {
        postWithDrawActionDispatch(amount, qqAcc);
        goHistory({
          name: pageUrlConstants.profile.pages.profilePaymentWithDrawHistory
            .name,
          path: pageUrlConstants.profile.pages.profilePaymentWithDrawHistory
            .path,
          dynamic: {
            type: "submit",
          },
        });
      }
    }
  }
  function inputRegEvent(e) {
    if (qqReg && !qqReg.test(qqAcc)) {
      setRegErr(true);
    } else {
      setRegErr(false);
    }
  }

  function add() {
    if (amount < 100) {
      setAmount(100);
    }
    clearInterval(countRef.current);
    countRef.current = setInterval(() => {
      if ((amount < 10000 && amount >= 0) || amount === null) {
        setAmount((pre) => {
          if (pre >= 10000) {
            return 10000;
          } else if (pre % 10 !== 0) {
            return pre - (pre % 10);
          } else {
            return (pre += 10);
          }
        });
      }
    }, 50);
  }

  function reduce() {
    if (amount <= 100) {
      setAmount(100);
    } else {
      clearInterval(countRef.current);
      countRef.current = setInterval(() => {
        if (amount <= 10000 && amount >= 100) {
          setAmount((pre) => {
            if (pre <= 0 && pre !== null) {
              return 0;
            } else if (pre % 10 !== 0) {
              return pre - (pre % 10);
            } else if (pre > 100) {
              return (pre -= 10);
            } else {
              return 100;
            }
          });
        }
      }, 50);
    }
  }
  function mouseUp() {
    clearInterval(countRef.current);
  }

  const postWithDrawActionDispatch = (amount, QQAccount) => {
    useGlobalDispatch(postWithDrawAction(amount, QQAccount));
  };
  const goHistory = (route) => {
    useGlobalDispatch(pushRoutes(route));
  };

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
    <ProfilePaymentWithDrawElement main_height={state.navbar.mainHeight}>
      <TopBarContainer>
        <TopTitleBar
          title={t("Profile.payment.transfer.with_draw")}
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

      <ProfilePaymentWithDrawTopElement>
        <div className="profile_with_draw_bg img_container">
          <Image
            src="/images/profile/with_draw_bg.png"
            width={0}
            height={0}
            alt="profile_with_draw_bg"
          />
        </div>
        <div className="profile_with_draw_container">
          <div className="profile_with_draw_purse img_container">
            <Image
              src="/images/profile/purse.png"
              width={0}
              height={0}
              alt="profile_with_draw_purse"
            />
          </div>
          <div className="profile_with_draw_information">
            <div className="profile_with_draw_information_top">
              {parseInt(state.user.money) - amount}
            </div>
            <div className="profile_with_draw_information_bottom">
              ({t("Profile.payment.")})
            </div>
          </div>
        </div>
      </ProfilePaymentWithDrawTopElement>

      <ProfilePaymentWithDrawBottomElement
        buttonStatus={
          parseInt(state.user.money) - amount >= 0 &&
          amount !== null &&
          amount >= 100 &&
          qqReg.test(qqAcc)
        }
      >
        <div className="profile_with_draw_bottom_container">
          <div className="profile_with_draw_item">
            <div className="profile_with_draw_item_top">
              {t("Profile.with_draw.apply.")}
            </div>
            <div className="profile_with_draw_item_bottom amount">
              <button
                className="profile_with_draw_item_bottom_amount_control"
                onMouseDown={reduce}
                onMouseUp={mouseUp}
                onTouchStart={reduce}
                onTouchEnd={mouseUp}
                onMouseLeave={mouseUp}
              >
                –
              </button>
              <input
                className="profile_with_draw_item_bottom_amount"
                min={100}
                step={10}
                max={10000}
                type={isMobile ? "tel" : "number"}
                placeholder={t("Profile.with_draw.apply_money")}
                value={amount ?? ""}
                onBlur={(e) =>
                  setAmount(e.target.value - (e.target.value % 10))
                }
                onChange={(e) => {
                  if (e.target.value > 10000) {
                    setAmount(10000);
                  } else if (e.target.value < 0 && e.target.value !== null) {
                    setAmount(0);
                  } else if (!e.target.value) {
                    setAmount(null);
                  } else {
                    setAmount(parseInt(e.target.value));
                  }
                }}
              />
              <button
                className="profile_with_draw_item_bottom_amount_control"
                onMouseUp={mouseUp}
                onMouseDown={add}
                onTouchStart={add}
                onTouchEnd={mouseUp}
                onMouseLeave={mouseUp}
              >
                +
              </button>
              <span
                className="with_draw_tip"
                onClick={() => {
                  setAmount(
                    parseInt(state.user.money - (state.user.money % 10))
                  );
                }}
              >
                {t("Profile.with_draw.apply.all_money")}
              </span>
            </div>
          </div>

          <div className="profile_with_draw_item">
            <div className="profile_with_draw_item_top">
              {t("Social.detail.info.label.contact_details")}
            </div>
            <div className="profile_with_draw_item_bottom">
              <input
                step={0}
                type={isMobile ? "tel" : "number"}
                placeholder={t("Login.placeholder_qq")}
                onKeyDown={qqAccEvent}
                onChange={qqAccEvent}
                onBlur={inputRegEvent}
                enterKeyHint="send"
                value={qqAcc}
              />
              {regErr && (
                <span className="error">{t("Login.tip.error.qq")}</span>
              )}
            </div>
          </div>

          <div className="profile_with_draw_detail">
            <ol>
              <li className="title">规格说明</li>
              <li>1.最低提领申请金额为100精钻(1精钻=1RMB)</li>
              <li>2.申请完成后将有专人与您联系，大约等待1-2个工作天</li>
              <li>
                3.提领金额以10的倍数为准，若有填写个位数金额将替用户做四捨五入处理，也能使用「-」「+」符号增减提领金额
              </li>
              <li>
                4.平台将收取出金通道费10%(例：提现金额100精钻x0.9=实际到帐金额90精钻)
              </li>
            </ol>
          </div>
        </div>
        <div
          onClick={
            parseInt(state.user.money) - amount >= 100 ? onSubmit : () => {}
          }
        >
          <WavaButton className="footer_bottom">
            <p className="footer_bottom_wava">确认</p>
          </WavaButton>
        </div>
      </ProfilePaymentWithDrawBottomElement>
    </ProfilePaymentWithDrawElement>
  );
};

export default ProfilePaymentWithDraw;

const ProfilePaymentWithDrawElement = styled.article`
  /*  */
  background: #f3f4f5;
  .profile_with_draw_history {
    text-decoration: none;
    color: #fff;
    font-weight: bold;
  }
`;

const ProfilePaymentWithDrawTopElement = styled.section.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding-top: ${main_height}px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: #fff;
    margin-bottom: 0.5rem;

    .profile_with_draw {
        &_container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-width: 100px;
        }

        &_information {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &_top {
            color: ${colors.back_dark_pink};
            font-size: 30px;
            font-weight: bold;
        }

        &_bottom {
            position: relative;
            color: ${colors.text_grey};
            font-size: 16px;
        }
        }

        &_purse {
        padding-bottom: 130%;
        width: 130%;
        @media (max-width: 899px) {
            padding-bottom: 100%;
            width: 100%;
        }
        img {
            width: 100%;
            height: 100%;
        }
        }
        &_bg {
        padding-bottom: 16%;
        width: 35%;
        @media (max-width: 899px) {
            padding-bottom: 55%;
            width: 100%;
        }
        }
    }
  `}
`;

const ProfilePaymentWithDrawBottomElement = styled.section.withConfig({
  shouldForwardProp: (prop) => !["buttonStatus"].includes(prop),
})`
  /*  */
  background: #fff;
  position: relative;
  .profile_with_draw {
    &_bottom_container {
      display: flex;
      flex-direction: column;
      position: relative;
      background: #fff;
      padding: 20px 15px;
      gap: 10px;
    }
    &_item {
      display: flex;
      flex-direction: column;
      padding-bottom: 5px;
      gap: 10px;
      &_top {
        color: black;
        font-size: 20px;
      }
      &_bottom {
        position: relative;
        display: flex;
        align-items: center;
        &.amount {
          @media (max-width: 899px) {
            border-bottom: 2px solid ${colors.text_light_grey};
          }
        }
        input {
          color: ${colors.text_grey};
          padding: 10px 0;
          width: 100%;
          font-size: 16px;
          border: none;
          border-radius: 0;
          border-bottom: 2px solid ${colors.text_light_grey};
          outline: name;
          &:focus {
            outline: none;
            border-bottom: 2px solid ${colors.text_light_grey};
          }
        }
        &_amount {
          @media (max-width: 899px) {
            width: 40% !important;
            border-bottom: 0 !important;
            text-align: center;
          }
          &_control {
            display: none;
            @media (max-width: 899px) {
              color: black;
              state.user-select: none;
              display: block;
              font-size: 30px;
              font-weight: 600;
              border: none;
              background: transparent;
            }
          }
        }
      }
    }
    &_detail {
      margin-bottom: 10em;
      li {
        font-size: 16px;
        &.title {
          color: ${colors.text_grey};
        }
        color: ${colors.text_light_grey};
      }
    }
  }
  .footer {
    &_bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      cursor: ${({ buttonStatus }) => (buttonStatus ? "pointer" : "default")};
      width: 100%;
      text-decoration: none;
      color: #fff;
      background-color: ${({ buttonStatus }) =>
        buttonStatus ? colors.back_dark_pink : "gray"};
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      &_wava {
        padding: 20px 0;
        @media (max-width: 899px) {
          padding: 10px 0;
        }
      }
    }
  }
  .with_draw_tip {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 25px;
    font-weight: 700;
    color: #39b3fd;
    font-size: 18px;
    cursor: pointer;
    @media (max-width: 899px) {
      right: 0px;
    }
  }
  .error {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 25px;
    font-weight: 700;
    color: #f00;
    font-size: 14px;
    @media (max-width: 899px) {
      right: 0px;
    }
  }
`;
