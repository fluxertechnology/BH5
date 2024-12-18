"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import ImageComponent from "@/components/common/ImageComponent";
import { apiUrl, colors, pageUrlConstants } from "@/lib/constants";
import LinkComponent from "@/components/common/LinkComponent";

const { vendor } = pageUrlConstants;

const VendorItemCard = ({ data }) => {
  const t = useTranslations();
  const { picurl } = data;
  return (
    <VendorItemCardElement>
      <LinkComponent
        className="container"
        routes={{
          name: vendor.pages.vendorGoods.name + data.title,
          path: vendor.pages.vendorGoods.path,
          dynamic: {
            goodsId: data.id,
          },
        }}
      >
        {/* 目前沒有資料 */}
        {/* <div className="container_tab">
          <span className="container_tab_text">
            新品
          </span>
        </div> */}

        <ImageComponent
          src={picurl?.indexOf("http") === -1 ? apiUrl + picurl : picurl}
          alt={data.title}
          title={data.title}
          border_radius={0}
          background_color="#fff"
          height={100}
          // is_cover={true}
          // toFixSize={true}
        />
        <div className="container_text">{data.title}</div>
        {moneyAndGold(data.mone, data.yue)}
        {/* 暫時拔掉 */}
        <div className="container_amount">
          {t("Vendor.item.label.unit.remain_amount")} ：{data.qty}
        </div>
      </LinkComponent>
    </VendorItemCardElement>
  );
};

export const moneyAndGold = (money, yue) => {
  const t = useTranslations();
  if (yue && money) {
    return (
      <div className="price">
        {yue}
        <span className="price_small"> {t("Global.money")}</span>
        <span> / </span>
        {money}
        <span className="price_small"> {t("Global.gold_money")}</span>
      </div>
    );
  } else if (yue) {
    return (
      <div className="price">
        {yue}
        <span className="price_small"> {t("Global.money")}</span>
      </div>
    );
  } else if (money) {
    return (
      <div className="price">
        {money}
        <span className="price_small">{t("Global.gold_money")}</span>
      </div>
    );
  } else {
    return <div className="price">{t("Global.free")}</div>;
  }
};

export default VendorItemCard;

export const VendorItemCardElement = styled.div`
  /*  */
  .container {
    cursor: pointer;
    display: block;
    overflow: hidden;
    margin-top: 10px;
    text-decoration: none;
    color: #000;
    border: 1px solid rgb(0 0 0 / 20%);
    border-radius: 10px;
    box-shadow: 0 3px 4px -1px rgb(0 0 0 / 50%);

    &_tab {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      padding: 4px 8px;
      background-color: #f48c79;
      border-radius: 0 0 10px;

      &_text {
        font-size: 12px;
        color: #fff;
      }
    }

    &_text,
    &_price,
    &_amount {
      padding: 2px 5px;
      @media (min-width: 899px) {
        padding: 5px 10px;
      }
    }

    &_text {
      overflow: hidden;
      height: ${2 * 1.4 * 14}px;
      font-size: 14px;
      font-weight: 900;
      word-break: break-all;
      margin-top: 5px;
      @media (min-width: 899px) {
        font-size: 18px;
        height: ${2 * 1.3 * 18}px;
        margin-top: 0px;
      }
    }

    &_amount {
      font-size: 10px;
      color: ${colors.text_grey};
      margin-bottom: 5px;
      font-weight: 900;
      @media (min-width: 899px) {
        font-size: 14px;
        margin-bottom: 0px;
      }
    }
  }

  .price {
    padding: 2px 5px;
    font-weight: 700;
    font-size: 14px;
    color: ${colors.dark_pink};
    @media (min-width: 899px) {
      padding: 5px 10px;
      font-size: 20px;
    }
    &_small {
      font-size: 14px;
      letter-spacing: 1px;
    }
  }
`;
