"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import { colors } from "@/lib/constants";
import { getPriceUnit } from "@/lib/services/price";

const BundleCouponComponent = ({
  title,
  start_date,
  end_date,
  discount_type,
  discount_amount,
  discount_unit,
  count,
  expire,
  show_count = false,
}) => {
  const t = useTranslations();
  return (
    <BundleCouponComponentElement expire={expire}>
      <div className="card">
        <div className="card_header">
          {Array.from({ length: 6 }).map((i, k) => {
            return (
              <div
                className="card_header_dot"
                style={{
                  top: k * 15 + 7 + "%",
                }}
                key={k}
              />
            );
          })}
          <span className="card_header_title">
            {discount_type === "number"
              ? discount_amount
              : discount_amount / 10 +
                t("Global.label.buy.fold")}
          </span>
          <span className="card_header_type">
            {discount_unit === 0
              ? getPriceUnit(t) // 金币
              : getPriceUnit(t) // 精钻
            }
            {t("Global.label.buy.discount")}
          </span>
        </div>
        <div className="card_body">
          <div className="card_body_title">
            <p className="card_body_title_text">{title}</p>
          </div>
          <div className="card_body_description">
            <p className="card_body_description_text">
              {discount_type === "number"
                ? t("Profile.build.reduce") +
                  discount_amount +
                  t("Profile.build.gold_money_once")
                : t("Toast.tip.buy.discount.game")}
              ，
              {t("Profile.build.buy.only_mall_consume")}
            </p>
          </div>
          <div className="card_body_time">
            <span className="card_body_time_text">
              {start_date}-{end_date}
            </span>
            {show_count ? (
              <span
                className="card_body_time_count"
                style={{
                  color: count !== 0 ? colors.dark_pink : colors.text_grey,
                }}
              >
                {t("Profile.build.buy.remains")}
                ：{count}
                {t("Profile.build.buy.times")}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </BundleCouponComponentElement>
  );
};

export default BundleCouponComponent;

export const BundleCouponComponentElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["expire"].includes(prop),
})`
  /*  */
  padding: 10px;
  box-sizing: border-box;
  filter: ${({ expire }) => (expire ? "grayscale(1)" : "")};

  .card {
    display: flex;
    background-image: linear-gradient(
      135deg,
      #fa83b3 0%,
      #f45c8c 54.468%,
      #f24c7c 100%
    );

    &_header {
      flex-shrink: 0;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 15px 0;
      width: 105px;
      color: #fff;

      &::before,
      &::after,
      &_dot {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #fff;
        border-radius: 50%;
      }

      &_dot {
        left: 0;
        transform: translateX(-50%);
      }

      &::before,
      &::after {
        content: "";
        left: 30%;
      }

      &::before {
        top: 0;
        transform: translateY(-50%);
      }

      &::after {
        bottom: 0;
        transform: translateY(50%);
      }

      &_title {
        font-size: 30px;
        font-weight: 900;
      }

      &_type {
        margin-top: 10px;
        font-size: 16px;
        font-weight: 500;
      }
    }

    &_body {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      padding: 0 5px 0 10px;
      margin: 2px;
      width: 100%;
      background-color: #fff;

      &_title,
      &_time,
      &_description {
        &_text,
        &_count {
          font-size: 14px;
        }
      }

      &_time,
      &_description {
        &_text {
          color: ${colors.text_grey};
        }
      }

      &_description {
        &_text {
          font-size: 12px;
        }
      }

      &_time {
        display: flex;
        justify-content: space-between;

        &_count {
          font-weight: 700;
        }
      }
    }
  }
`;
