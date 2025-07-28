"use client"; // This directive marks the file as a Client Component

import { useTranslations } from "next-intl";
import styled from "styled-components";
import ImageComponent from "@/components/common/ImageComponent";
import { apiUrl, pageUrlConstants, colors } from "@/lib/constants/index.js";
import {
  getPremiumDiamond,
  getPriceUnit,
  getPremiumDiamondWithBoth,
} from "@/lib/services/price";
import useMediaQuery from "@/hooks/useMediaQuery";

const { vendor } = pageUrlConstants;

const VendorItemCard = ({ data }) => {
  const { size } = useMediaQuery();
  const mobileScreenWidth = (size?.[0] ?? 0) < 889;
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
        border_radius={mobileScreenWidth ? "0.67vw" : "0.26vw"}
        background_color="#fff"
        is_cover={true}
        height={mobileScreenWidth ? "46.5vw" : "10.5vw"}
      />
      <div className="container_body">
        <div className="container_text">{store_name}</div>
        <div className="flex justify-start items-center">
          <div className="container_tag">优惠价</div>
          <div className="container_price">${Number(price).toFixed(2)}</div>
        </div>
        <div className="container_purchased">已抢 112件</div>
      </div>
      {/* </LinkComponent> */}
    </VendorItemCardElement>
  );
};

export const moneyAndGold = (money, yue, t) => {
  // money: 金币, yue: 精钻
  if (yue && money) {
    return (
      <div className="price">
        {getPremiumDiamondWithBoth(t, money, yue, false)}
        <span className="price_small"> {getPriceUnit(t)}</span>
      </div>
    );
  } else if (yue) {
    return (
      <div className="price">
        {getPremiumDiamond(t, yue, false, false)}
        <span className="price_small"> {getPriceUnit(t)}</span>
      </div>
    );
  } else if (money) {
    return (
      <div className="price">
        {getPremiumDiamond(t, money, true, false)}
        <span className="price_small">{getPriceUnit(t)}</span>
      </div>
    );
  } else {
    return <div className="price"> {t("Global.free")}</div>;
  }
};

export default VendorItemCard;

export const VendorItemCardElement = styled.div`
  /*  */
  @media (max-width: 898px) {
    width: 45.5vw;
    margin: auto;
  }
  @media (min-width: 899px) {
    width: 10.26vw;
    margin: auto;
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
      min-height: 90px;
    }

    &_text {
      color: #000000;
      margin-top: 3.2vw;
      margin-bottom: 2.8vw;
      line-height: 1.45;
      overflow: hidden;
      height: auto;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 3.2vw;
      font-weight: 900;
      word-break: break-all;
      @media (min-width: 899px) {
        margin-top: 0.65vw;
        margin-bottom: 11px;
        font-size: clamp(12px, 0.73vw, 100px);
        // height: ${3 * 1.4 * 16}px;
        -webkit-line-clamp: 3;
      }
    }

    &_amount {
      margin-top: 2vw;
      font-size: 10px;
      color: ${colors.text_grey};
      font-weight: 900;
      @media (min-width: 899px) {
        font-size: 14px;
      }
    }

    &_price {
      font-weight: 700;
      margin-top: 0px;
      margin-left: 1.73vw;
      font-size: 2.93vw;
      color: #ff367a;
      @media (min-width: 899px) {
        margin-left: 0.99vw;
        font-size: clamp(14px, 0.94vw, 100px);
      }
      &_small {
        font-size: 14px;
        letter-spacing: 1px;
      }
    }

    &_tag {
      font-size: 2.4vw;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
      // line-height: 1.833;
      background: #ff367a;
      padding: 0 0.27vw;
      height: 2.93vw;

      @media (min-width: 899px) {
        padding: 0 2px;
        height: 18px;
        font-size: clamp(10px, 0.63vw, 100px);
      }
    }

    &_purchased {
      margin-top: 1.3vw;
      font-size: 2.4vw;
      font-family: "Microsoft YaHei";
      color: rgb(153, 153, 153);
      line-height: 1.833;

      @media (min-width: 899px) {
        margin-top: 0.55vw;
        font-size: clamp(10px, 0.63vw, 100px);
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
