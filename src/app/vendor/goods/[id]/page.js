'use client';

import { useState, useEffect,useMemo } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";

import ImageComponent from "@/components/common/ImageComponent";
import {
  apiUrl,
  colors,
  padding,
  requestUrlConstants,
  pageUrlConstants,
} from "@/lib/constants/index.js";
import { moneyAndGold } from "@/components/vendor/VendorItemCard";

import likeIcon from "@public/images/icons/heart.svg";
import unLikeIcon from "@public/images/icons/empty_heart.svg";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";

import buyIcon from "@public/images/vendor/buy.svg";
// import sendGiftIcon from "../../assets/vendor/send_gift.svg";
import LinkComponent from "@/components/common/LinkComponent";
import store from "@/store";
import axiosRequest from "@/lib/services/axios";

import copyIcon from "@public/images/vendor/copy.jpg";
import callToast from "@/lib/services/toastCall.js";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useParams } from "next/navigation";
import {getVendorGoodsAction,likeVendorGoodsAction} from 'src/store/actions/pages/vendorGoodsAction.js'

function VendorGoods({
}) {

  const { state,dispatch } = useGlobalContext();
  const t = useTranslations();
  const [justBuy, setJustBuy] = useState(false);
  const params = useParams();

  const localState = useMemo(() => {

    return {
      goodsId: params.id,
      goodsData: state.vendorData[params.id] ? { ...state.vendorData[params.id] } : {}
    };
  }, [state])

  const getVendorGoods = (goodsId) => {
    useGlobalDispatch(getVendorGoodsAction(goodsId));
  }
  const toVendorSheetPage = (goodsId, buyType) => {
    const vendorGoods = store.getState().vendorData[goodsId];
    useGlobalDispatch(pushRoutes({
      name: pageUrlConstants.vendor.pages.vendorSheet.name + vendorGoods.title,
      path: pageUrlConstants.vendor.pages.vendorSheet.path,
      dynamic: {
        goodsId,
        buyType
      }
    }))
  }
  const likeVendorGoodsEvent = (goodsId) => {
    useGlobalDispatch(likeVendorGoodsAction(goodsId));
  }

  useEffect(() => {
    getVendorGoods(localState.goodsId);
    setJustBuy(window.sessionStorage.getItem("buyRecord"));
    window.sessionStorage.setItem("buyRecord", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buyGoodsEvent(buyType) {
    toVendorSheetPage(localState.goodsId, buyType);
  }

  function clickLikeEvent() {
    likeVendorGoodsEvent(localState.goodsId);
  }

  function redeemCode() {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    formData.append("sid", localState.goodsId);
    axiosRequest
      .post(requestUrlConstants.postGetCouponRedeemUrl, formData)
      .then((data) => {
        console.log(data);
      });
  }

  function copyCode() {
    navigator.clipboard
      .writeText(justBuy)
      .then((data) => {
        callToast(t('Toast.tip.success.copy'));
      })
      .catch((err) => {
        callToast(
          t('Toast.tip.unsuccess.action.hand.copy')
        );
      });
  }

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent:()=> <></>,
      },
    });
  }, []);

  return (
    <VendorGoodsElement>
      <TopBarContainer not_fixed={true} show_shadow={false}>
        <TopTitleBar
          showBack={true}
          show_back_color="#fff"
          back_color="transparent"
        />
      </TopBarContainer>
      <div className="container">
        <div className="container_header">
          <div className="container_header_cover">
            <ImageComponent
              src={
                localState.goodsData.picurl?.indexOf("http") === -1
                  ? apiUrl + "/" + localState.goodsData.picurl
                  : localState.goodsData.picurl
              }
              placeholderImg={
                localState.goodsData.picurl?.indexOf("http") === -1
                  ? apiUrl + "/" + localState.goodsData.picurl
                  : localState.goodsData.picurl
              }
              alt={localState.goodsData.title}
              title={localState.goodsData.title}
              toFixSize={true}
              border_radius={0}
            />
          </div>
          <div className="container_header_info">
            <div className="container_header_info_description">
              <div className="container_header_info_description_title">
                <span className="container_header_info_description_title_text">
                  {localState.goodsData.title}
                </span>
              </div>
              <div className="container_header_info_description_price">
                {moneyAndGold(localState.goodsData.mone, localState.goodsData.yue, t)}
              </div>
            </div>
            <div
              className="container_header_info_like"
              onClick={clickLikeEvent}
            >
              <div className="container_header_info_like_icon">
                <img
                  className="container_header_info_like_icon_img"
                  src={localState.goodsData.is_like === 0 ? unLikeIcon : likeIcon}
                  alt="like"
                />
              </div>
              <div className="container_header_info_like_number">
                <span
                  className={
                    "container_header_info_like_number_text " +
                    (localState.goodsData.is_like === 0 ? "" : "like")
                  }
                >
                  {localState.goodsData.total_like
                    ? localState.goodsData.total_like +
                    t('Vendor.goods.label.like.people')
                    : t('Vendor.goods.label.like.')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="container_body">
          <div className="container_body_title">
            <span className="container_body_title_text">
              {t('Vendor.goods.label.product.description')}
            </span>
          </div>
          <div
            className="container_body_content "
            dangerouslySetInnerHTML={{
              __html: localState.goodsData.miaoshu,
            }}
          />
        </div>
      </div>
      <div className="footer">
        {justBuy ? (
          <>
            <div className="footer_extract">
              <img
                className="footer_extract_icon"
                src={copyIcon}
                alt="copyIcon"
                onClick={copyCode}
              />
              {localState.goodsData.item_type === "dianka"
                ? t('Vendor.goods.label.redemption_code')
                : t('Vendor.goods.label.pick_code')
              }
              <span className="footer_extract_text"> {justBuy} </span>
            </div>
            <LinkComponent
              className="footer_btn"
              routes={
                localState.goodsData.item_type === "dianka"
                  ? pageUrlConstants.profile.pages.profileBuyVip.pages
                    .profileBuyVipCommon
                  : {
                    linkurl: localState.goodsData.url,
                  }
              }
            >
              {t('Vendor.goods.action.now.go')}
            </LinkComponent>
          </>
        ) : localState.goodsData.pay_type ? (
          <span
            className="footer_btn"
            onClick={() => {
              buyGoodsEvent(0);
            }}
          >
            <img className="footer_btn_img" src={buyIcon} alt="buyIcon" />
            {t('Vendor.goods.action.now.buy')}
          </span>
        ) : localState.goodsData.item_type === "dianka" ? (
          <div className="footer_btn" onClick={redeemCode}>
            {t('Vendor.goods.action.now.received')}
          </div>
        ) : (
          <LinkComponent
            className="footer_btn"
            routes={{
              linkurl: localState.goodsData.url,
            }}
          >
            {t('Vendor.goods.action.now.go')}
          </LinkComponent>
        )}
      </div>
    </VendorGoodsElement>
  );
}

export default VendorGoods;

const VendorGoodsElement = styled.div`
  /*  */
  padding-bottom: ${bottom_nav_height}px;

  .container {
    max-width: 100% !important;

    &_header {
      padding-bottom: 20px;
      border-bottom: 20px solid #f3f4f5;

      &_cover {
        padding: 0%;
        @media (min-width: 599px) {
          padding: 0 30%;
        }
      }

      &_info {
        display: flex;
        justify-content: space-between;
        padding: 0 ${padding}px;

        &_description {
          &_title {
            margin-top: 10px;

            &_text {
              font-size: 20px;
              font-weight: 700;
            }
          }
        }

        &_like {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-self: center;
          text-align: center;

          &_icon {
            width: 35px;
            height: 35px;
            @media (min-width: 599px) {
              width: 50px;
              height: 50px;
            }
            &_img {
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }

          &_number {
            &_text {
              &.like {
                color: ${colors.dark_pink};
              }
            }
          }
        }
      }
    }

    &_body {
      &_title {
        padding: ${padding}px;

        &_text {
          font-size: 20px;
          flex-wrap: 700;
          color: ${colors.text_grey};
        }
      }

      &_content {
        padding: 1% 10%;

        img {
          margin-bottom: 10px;
          width: 100%;
        }

        span,
        p {
          margin-bottom: 15px;
          line-height: 22px;
        }
      }
    }
  }

  .footer {
    position: fixed;
    display: flex;
    bottom: 0;
    height: ${bottom_nav_height}px;
    color: #fff;
    background-color: #fff;
    width: 100%;
    padding-bottom: 15px;

    &_btn {
      cursor: pointer;
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px;
      height: 100%;
      text-decoration: none;
      color: #fff;
      background-color: ${colors.back_dark_pink};
      border-radius: 10px;

      &_img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
        vertical-align: middle;
      }

      &.send {
        color: ${colors.back_dark_pink};
        background-color: #fff;
        border: 2px solid ${colors.back_dark_pink};
      }
    }

    &_extract {
      flex-grow: 1;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      padding: 0 10px;

      &_icon {
        cursor: pointer;
        width: 30px;
      }

      &_text {
        margin-left: 10px;
        color: ${colors.text_grey};
      }

      & + .footer_btn {
        max-width: 200px;
      }
    }
  }

  .price {
    font-weight: 700;
    margin-top: 10px;
    font-size: 20px;
    color: ${colors.dark_pink};

    &_small {
      font-size: 14px;
      letter-spacing: 1px;
    }
  }
`;
