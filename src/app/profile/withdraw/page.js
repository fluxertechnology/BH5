"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useGlobalContext } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import { nowLang } from "@/i18n/Metronici18n";
import toastCall from "@/lib/services/toastCall";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/constants";
import useWithdraw from "@/hooks/useWithdraw";

const withdrawOptions = [
  {
    label: "支付宝",
    fee: "1",
    type: "alipay",
    icon: "withdraw_icon_alipay",
  },
  {
    label: "Apple Wallet",
    fee: "1",
    type: "apple-wallet",
    icon: "withdraw_icon_apple",
  },
  { label: "USDT", fee: "1", type: "usdt", icon: "withdraw_icon_usdt" },
  { label: "银行卡", fee: "1", type: "bank", icon: "withdraw_icon_card" },
];

export default function WithdrawPage() {
  const router = useRouter();
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const handleSelect = (type) => {
    router.push(`/profile/withdraw/${type}`);
  };

  const { paymentMethods } = useWithdraw();
  const [validWithdrawOptions, setValidWithdrawOptions] = useState([]);

  useEffect(() => {
    setValidWithdrawOptions(
      withdrawOptions.filter((option) =>
        paymentMethods.map(m => m.name).includes(option.type)
      )
    );
  }, [paymentMethods]);

  return (
    <ProfileWithDrawComponent main_height={state.navbar.mainHeight}>
      {isMobile ? (
        <div className="mobile-container">
          <div className="annoucement-bar">
            <FontAwesomeIcon className="speaker_icon" icon={faVolumeHigh} />
            <p>续费，更方便、快捷，详情可咨询客服!</p>
          </div>
          <div className="banner">
            <Image
              src="/images/profile/withdraw_banner.png"
              fill
              alt="Broadcast Icon"
              className="banner_img"
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="withdraw-bg">
            <Image
              src="/images/profile/withdraw_main_bg.png"
              fill
              alt="Broadcast Icon"
              className="broadcast_icon"
            />
          </div>
        </div>
      )}

      <div className="md:p-6">
        <ul className="space-y-3 withdraw-list">
          {validWithdrawOptions.map((option) => (
            <li
              key={option.type}
              onClick={() => handleSelect(option.type)}
              className="cursor-pointer p-4 withdraw-list-item"
            >
              <div className="info">
                <div className="info-icon">
                  <Image
                    src={`/images/profile/${option.icon}.png`}
                    alt={option.label}
                    fill
                    className="icon"
                  />
                </div>
                <div>
                  <h5>{option.label}提现</h5>
                  <p>手续费：{option.fee}%</p>
                </div>
              </div>
              <div>
                <FontAwesomeIcon
                  className="item_arrow_icon"
                  icon={faAngleRight}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ProfileWithDrawComponent>
  );
}

const ProfileWithDrawComponent = styled.section.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `

    position: relative;
    overflow: hidden;
    margin-top: ${main_height}px;

    .withdraw-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 180px; 
      z-index: -1;

      .bg-image {
        object-fit: cover;
      }
    }

    .withdraw-list{
      margin-top: ${main_height}px;
      background:#fff;
      border-color: rgb(205, 205, 205);
      border-width: 1px;
      border-radius: 20px;

      .withdraw-list-item{
        display:flex;
        justify-content:space-between;
        align-items:center;
        width:100%;

        &:hover {
          border-color: #00cdcd;
          background-color: #f9f9f9;
        }

        &:first-child {
          border-radius: 20px 20px 0 0;
        }

        .info{
          display:flex;
          flex: 1;
          align-items:center;

          .info-icon{
            position:relative;
            width:101.28px;
            height:101.28px;
            margin-right: 36px;
          }

          h5{
            font-size: 24px;
            font-family: "Microsoft YaHei";
            color: rgb(51, 51, 51);
            line-height: 1.2;
            text-align: left;
          }
          p{
            font-size: 18px;
            font-family: "Microsoft YaHei";
            color: rgb(51, 51, 51);
          }
        }
        .item_arrow_icon{
          font-size: 27px;
          color:#fa759b;
        }
      }
    }

    .mobile-container{

      .annoucement-bar{
        display:flex;
        align-items:center;
        background-color: rgb(250, 117, 155);
        height: 8vw;
        z-index: 5;
        padding: 0 5.87vw;
        margin: 1.33vw 0;

        .speaker_icon{
          font-size:5.47vw;
          margin-right:3.07vw;
          color: rgb(255, 255, 255);
        }

        p {
          font-size: 3.2vw;
          font-family: "Microsoft YaHei";
          color: rgb(255, 255, 255);
          text-align: left;
        }

      }

      .banner{
        height: 27.47vw;
        width: 100%;
        overflow:hidden;

        .banner_img{
          position: relative !important;
          object-fit:contain;
        }
      }
    }

    @media (max-width: 899px) {
        .withdraw-list{
          margin: 4.53vw 0 28.53vw;

          .withdraw-list-item{
            padding: 4.27vw 4.53vw 4.27vw 2.27vw!important;
            border-width: 1px;
            border-color: rgb(216, 216, 216);
            border-style: solid;
            border-radius: 2.67vw;
            background-color: rgb(255, 255, 255);
            width: 93.07vw;
            height: 19.87vw;
            margin:0 auto 3.33vw;

            &:first-child {
              border-radius: 2.67vw;
            }

            .item_arrow_icon{
              font-size: 5.6vw;
            }

            .info{

              h5 {
                font-size: 4.8vw;
              }

              p {
                font-size: 3.2vw;
              }

              .info-icon{
                width:15.2vw;
                height:15.2vw;
                margin-right: 4vw;
              }
              
            }
          }
        }
      }

  `}
`;
