"use client"; // This directive marks the file as a Client Component

import { useTranslations } from "next-intl";
import styled from "styled-components";
import ImageComponent from "@/components/common/ImageComponent";
import { apiUrl, pageUrlConstants, colors } from "@/lib/constants/index.js";

const { vendor } = pageUrlConstants;

const VendorItemCard = ({ data }) => {
  const t = useTranslations("Vendor");
  const { image, price, store_name } = data;

  return (
    <VendorItemCardElement>
      {/* Uncomment LinkComponent if routing is needed */}
      {/* <LinkComponent
                className="container"
                routes={{
                    name: vendor.pages.vendorGoods.name + data.title,
                    path: vendor.pages.vendorGoods.path,
                    dynamic: {
                        goodsId: data.id,
                    },
                }}
            > */}
      <ImageComponent
        src={image}
        alt={store_name}
        title={store_name}
        border_radius={0}
        background_color="#fff"
      />
      <div className="container_body">
        <div className="container_text">{store_name}</div>
        <div className="container_price">${Number(price).toFixed(2)}</div>
      </div>
      {/* </LinkComponent> */}
    </VendorItemCardElement>
  );
};

export const moneyAndGold = (money, yue, t) => {
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
    return <div className="price"> {t("Global.free")}</div>;
  }
};

export default VendorItemCard;

export const VendorItemCardElement = styled.div`
  /*  */
  padding: 10px;
  background-color: #fff;
  @media (min-width: 899px) {
    padding: 15px;
  }
  .container {
    cursor: pointer;
    display: block;
    overflow: hidden;
    padding-bottom: 10px;
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
    &_body {
      height: 90px;
    }

    &_text {
      color: #666;
      margin-top: 5px;
      overflow: hidden;
      height: ${3 * 1.2 * 16}px;
      font-size: 14px;
      font-weight: 900;
      word-break: break-all;
      @media (min-width: 599px) {
        font-size: 16px;
        height: ${3 * 1.4 * 16}px;
      }
    }

    &_amount {
      margin-top: 10px;
      font-size: 10px;
      color: ${colors.text_grey};
      font-weight: 900;
      @media (min-width: 599px) {
        font-size: 14px;
      }
    }

    &_price {
      font-weight: 700;
      margin-top: 10px;
      font-size: 16px;
      color: #e93323;
      @media (min-width: 899px) {
        font-size: 18px;
      }
      &_small {
        font-size: 14px;
        letter-spacing: 1px;
      }
    }
  }

  .price {
    padding: 0 10px;
    font-weight: 700;
    margin-top: 10px;
    font-size: 16px;
    color: ${colors.dark_pink};
    @media (min-width: 899px) {
      font-size: 20px;
    }
    &_small {
      font-size: 14px;
      letter-spacing: 1px;
    }
  }
`;
