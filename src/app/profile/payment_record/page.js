"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import axiosRequest from "@/lib/services/axios";
import { colors, requestUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const ProfilePaymentRecord = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const [recordList, setRecordList] = useState([]);

  useEffect(() => {
    // username
    axiosRequest
      .get(requestUrlConstants.getBuyGoldMoneyPaymentUrl, {
        username: state.user.username,
      })
      .then((data) => {
        setRecordList(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <ProfilePaymentRecordElement main_height={state.navbar.mainHeight}>
      <TopBarContainer>
        <TopTitleBar
          title={t("Profile.payment.charge.history")}
          showBack={true}
          show_back_color="#ffffff"
        />
      </TopBarContainer>
      <div className="payment_warning fw-m">
        {t("Profile.payment.charge.unsuccess_description")}
      </div>
      <div className="payment_container">
        <div className="payment_container_row fw-m">
          <div className="payment_container_row_col title">
            {t("Profile.payment.label.time.")}
          </div>
          <div className="payment_container_row_col title">
            {t("Profile.payment.label.charge.mode")}
          </div>
          <div className="payment_container_row_col title">
            {t("Profile.payment.label.charge.type")}
          </div>
          <div className="payment_container_row_col title">
            {t("Profile.payment.label.charge.amount")}
          </div>
          <div className="payment_container_row_col title">
            {t("Profile.payment.label.time.order.status")}
          </div>
        </div>
        {recordList.map((data) => {
          return (
            <div className="payment_container_row" key={data.id}>
              <div className="payment_container_row_col">
                {new Date(data.ctime * 1000).toLocaleDateString()}
              </div>
              <div className="payment_container_row_col">{data.way}</div>
              <div className="payment_container_row_col">{data.item_type}</div>
              <div className="payment_container_row_col">{data.num}</div>
              <div className="payment_container_row_col">
                {data.status === 0
                  ? t("Global.status.pending")
                  : data.status === 1
                  ? t("Global.status.pass")
                  : t("Global.status.reject")}
              </div>
            </div>
          );
        })}
      </div>
    </ProfilePaymentRecordElement>
  );
};

export default ProfilePaymentRecord;

export const ProfilePaymentRecordElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding-top: ${main_height}px;

    .payment_warning {
        padding: 1.5% 0;
        text-align: center;
        font-size: 20px;
        border-bottom: 2px solid ${colors.back_grey};
        background-color: ${colors.light_pink};
    }

    .payment_container {
        &_row {
        display: flex;
        border-bottom: 1px solid #aaa;

        &:last-child {
            border-bottom: none;
        }

        &_col {
            flex-grow: 1;
            padding: 1.5% 0;
            width: 0;
            font-size: 12px;
            text-align: center;

            &.title{
            font-size:20px;
            padding:2% 0;
            }
        }
        }
    }
  `}
`;
