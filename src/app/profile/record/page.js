"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { colors } from "@/lib/constants";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import Image from "next/image";
import { getTransferHistory } from "@/store/actions/pages/profileTransferRecordAction";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const ProfileTransferRecordRender = () => {
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
      },
    });
  }, []);
  return (
    <ProfileTransferRecordElement main_height={state.navbar.mainHeight}>
      <TopBarContainer show_shadow={false}>
        <TopTitleBar
          title={t("Profile.transfer.redeem_record")}
          showBack={true}
          show_back_color="#ffffff"
        />
      </TopBarContainer>
      <div className="transfer_record_container">
        {dataItems?.map((data) => (
          <div className="transfer_record_card" key={data.create_time}>
            <div className="transfer_record_card_row">
              <div className="transfer_record_card_row_l">
                <Image
                  src="/images/profile/transfer_coin.svg"
                  width={0}
                  height={0}
                  alt="coinIcon"
                  className="mr-2"
                />
                兑换精钻123
              </div>
              <div className="transfer_record_card_row_r">
                {data.transform_sign}
              </div>
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
                扣除精钻
              </div>
              <div className="transfer_record_card_row_r">{data.money}</div>
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
                兑换时间
              </div>
              <div className="transfer_record_card_row_r">
                {data.create_time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ProfileTransferRecordElement>
  );
};
export default ProfileTransferRecordRender;

export const ProfileTransferRecordElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    background-color: ${colors.back_grey};
    .transfer_record {
        &_container {
        padding-top: ${main_height}px;
        position: relative;
        background-color: ${colors.back_grey};
        }
        &_card {
        height: 20vh;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1%;
        margin-bottom: 0.5em;
        &_row {
            display: flex;
            justify-content: space-between;
            padding: 1% 0%;
            font-size: 1.4rem;
            padding-bottom: 0px;
            &:first-child {
            border-bottom: solid 1px ${colors.text_light_grey};
            padding-bottom: 1%;
            .transfer_record_card_row_r {
                color: ${colors.back_dark_pink};
            }
            }
            & > div {
            display: flex;
            align-items: center;
            color: ${colors.text_light_grey};
            }
        }
        }
    }
  `}
`;
