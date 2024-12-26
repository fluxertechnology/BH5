"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { colors } from "@/lib/constants";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import Image from "next/image";
import { getTransferHistory } from "@/store/actions/pages/profilePaymentWithDrawHistoryAction";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const ProfilePaymentWithDrawHistoryRender = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const [dataItems, set] = useState([]);
  const mountRef = useRef(1);
  useEffect(() => {
    getTransferHistoryDispatch({ page: mountRef.current, limit: 10 }, set);
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function scrollEvent() {
    if (!(dataItems.length < mountRef.current * 10)) {
      scrollBottomCallEvent((scrollColdEnd) => {
        mountRef.current += 1;
        getTransferHistoryDispatch(
          { page: mountRef.current, limit: 10 },
          set,
          scrollColdEnd
        );
      });
    }
  }

  const getTransferHistoryDispatch = (props, set, scrollColdEnd) => {
    useGlobalDispatch(getTransferHistory(props, set, scrollColdEnd));
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
    <ProfileTransferRecordElement main_height={state.navbar.mainHeight}>
      <TopBarContainer show_shadow={false}>
        <TopTitleBar
          title={t("Profile.payment.transfer.with_draw")}
          showBack={true}
          show_back_color="#ffffff"
        />
      </TopBarContainer>
      {window.location.pathname.split("/")[5] === "submit" && (
        <div className="reply_tip">提现申请成功，将有专人与您联系</div>
      )}
      <div className="transfer_record_container">
        {dataItems.map((data) => (
          <div className="transfer_record_card" key={data.create_time}>
            <div className="transfer_record_card_row">
              <div className="transfer_record_card_row_l">
                <Image
                  src="/images/profile/transfer_file.svg"
                  width={0}
                  height={0}
                  alt="fileIcon"
                  className="mr-2"
                />
                实际到帐
              </div>
              <div className="transfer_record_card_row_r">¥{data.income}</div>
            </div>
            <div className="transfer_record_card_row">
              <div className="transfer_record_card_row_l">
                <Image
                  src="/images/profile/transfer_wallet.svg"
                  width={0}
                  height={0}
                  alt="walletIcon"
                  className="mr-2"
                />
                提领金额
              </div>
              <div className="transfer_record_card_row_r">¥{data.amount}</div>
            </div>
            <div className="transfer_record_card_row">
              <div className="transfer_record_card_row_l">
                <Image
                  src="/images/profile/transfer_time.svg"
                  width={0}
                  height={0}
                  alt="timeIcon"
                  className="mr-2"
                />
                申请时间
              </div>
              <div className="transfer_record_card_row_r">
                {new Date(data.create_time * 1000)
                  .toLocaleDateString()
                  .replace(/\//g, ".")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ProfileTransferRecordElement>
  );
};
export default ProfilePaymentWithDrawHistoryRender;

export const ProfileTransferRecordElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding-top: ${main_height}px;
    .reply_tip {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #1a2950;
        width: 100%;
        height: 60px;
        color: #fff;
        font-size: 16px;
        @media (max-width: 899px) {
        height: 40px;
        }
    }
    .transfer_record {
        &_container {
        position: relative;
        background-color: ${colors.back_grey};
        min-height: calc(var(--vh, 1vh) * 100);
        }
        &_card {
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px 15px;
        margin-bottom: 0.5em;
        &_row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 1.2rem;
            img {
            width: 25px;
            }
            &:first-child {
            border-bottom: solid 1px ${colors.text_light_grey};
            padding-bottom: 15px;
            .transfer_record_card_row_r {
                color: ${colors.back_dark_pink};
            }
            }
            &:nth-child(2) {
            padding-top: 10px;
            }

            div {
            display: flex;
            align-items: center;
            color: ${colors.text_light_grey};
            }
        }
        }
    }
  `}
`;