"use client";

import React, { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import VendorItemCard from "@/components/vendor/VendorItemCard";
import { adsKeys, colors, side_padding, vendorUrl } from "@/lib/constants/index.js";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import { getVendorListAction } from "@/store/actions/pages/vendorMainAction.js"
import ImageCarousel from "@/components/common/ImageCarousel";
import TopTitleBar from "@/components/common/TopTitleBar";
import WebTopBar from "@/components/layout/Header/WebTopBar";

const VendorMain = () => {
  const t = useTranslations("Vendor");
  const { state, dispatch } = useGlobalContext();
  const { isMobile } = useMediaQuery();

  useEffect(() => {
    useGlobalDispatch(getVendorListAction());
  }, [isMobile]);

  function goToVendor() {
    window.open(vendorUrl);
  }

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
              {isMobile ? (
                <TopTitleBar
                  title={t("mall")}
                ></TopTitleBar>
              ) : (
                <WebTopBar />
              )}
            </TopBarContainer>
          </>
        ),
      }
    });
}, [isMobile]);

  return (
    <VendorMainElement>
      <ImageCarousel
        adsKey={adsKeys.shop_top_banner}
        threeInOneBanner={!isMobile}
        is_cover
        size="banner_main"
      />
      <div className="vendor_container" onClick={goToVendor}>
        <p className="vendor_container_title"></p>
        <div className="vendor_container_content">
          <Grid container direction="row" alignItems="start" spacing={2}>
            {state.vendorListData?.list?.map((data, index) => (
              <Grid item md={2.4} xs={6} key={index + 1}>
                <VendorItemCard data={data} />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </VendorMainElement>
  );
};

export default VendorMain

const VendorMainElement = styled.div`
  /*  */
  padding-top: ${main_height}px;
  padding-bottom: ${bottom_nav_height}px;
  background-color: #f3f4f5;

  .user_info {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    font-size: 14px;
    background-color: ${colors.light_pink};
    font-weight: 900;

    &_money {
      display: flex;

      &_gold,
      &_yue {
        position: relative;

        &::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 2px;
          background-color: ${colors.dark_pink};
        }

        &:last-of-type {
          &::after {
            content: unset;
          }
        }

        padding: 0 10px;

        &_text {
          color: ${colors.dark_pink};
        }
      }
    }

    &_link {
      text-decoration: none;

      &_text {
        color: ${colors.text_light_grey};
      }
    }
  }

  .vendor_header {
    display: flex;
    align-items: center;

    &_icon {
      &_img {
        width: 36px;
        height: 36px;
        vertical-align: middle;
        transition: 0.2s;
      }
    }

    &_text {
      overflow: hidden;
      width: 0;
      font-size: 22px;
      word-break: keep-all;
      transition: 0.2s;
      font-weight: 900;
    }

    &.trigger {
      .vendor_header_icon_img {
        width: 26px;
        height: 26px;
      }

      .vendor_header_text {
        width: 66px;
      }
    }
  }

  .vendor_nav {
    top: ${main_height}px;
    right: 0;
    left: 0;
    z-index: 10;
    margin: auto;
    padding: 0 10%;
    font-size: 16px;
    @media (max-width: 599px) {
      font-size: 12px;
      padding: 0;
    }

    &_list {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1%;
      width: 100%;
      background-color: #fff;
      transition: 0.3s;
      flex-wrap: wrap;

      &_item {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        height: 100%;

        &_link {
          width: 100%;
          text-decoration: none;
          color: #000;

          &_icon {
            padding: 10% 0 8%;
            margin: 0 auto;
            width: 60%;
            transition: 0.3s;
          }

          &_text {
            overflow: hidden;
            padding-bottom: 4%;
            text-align: center;
            white-space: nowrap;
            transition: 0.3s;

            @media (max-width: 300px) {
              font-size: 10px;
            }
          }
        }
      }
    }
    &.fixed {
      position: fixed;
      background-color: #fff;
      padding: 0;
      width: 100%;
      transition-duration: 0.2s;
      .vendor_nav_list {
        justify-content: flex-start;
        &_item {
          &_link {
            &_icon {
              width: 60%;
            }
            &_text {
              padding-bottom: 0;
              height: 0;
            }
          }
        }
      }
    }
  }

  .vendor_container {
    padding: 0 ${side_padding}px;
    cursor: pointer;

    @media (min-width: 899px) {
      padding-right: 10%;
      padding-left: 10%;
    }

    &_title {
      margin: 10px;
      font-weight: 900;
    }

    &_content {
      display: flex;
      flex-wrap: wrap;

      &::after {
        content: "";
        display: block;
        clear: both;
        width: 100%;
      }

      &_col {
        padding: ${side_padding}px;
        box-sizing: border-box;
        width: 50%;
      }
    }

    &_model {
      &_pc {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;
        &_item {
          display: flex;
          gap: 10px;
          margin: 10px 0;
          width: 100%;
        }
      }
    }
  }

  .vendor {
    &_banner {
      &_content {
        width: 100%;
      }
    }
  }
`;
