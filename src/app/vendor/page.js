"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import VendorItemCard from "@/components/vendor/VendorItemCard";
import {
  adsKeys,
  colors,
  side_padding,
  vendorUrl,
} from "@/lib/constants/index.js";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import TopBarContainer, {
  main_height,
} from "@/components/layout/Header/TopBarContainer";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import { getVendorListAction } from "@/store/actions/pages/vendorMainAction.js";
import ImageCarousel from "@/components/common/ImageCarousel";
import TopTitleBar from "@/components/common/TopTitleBar";
import WebTopBar from "@/components/layout/Header/WebTopBar";
import Pagination from "@mui/material/Pagination";

const VendorMain = () => {
  const t = useTranslations("Vendor");
  const { state, dispatch } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const { size } = useMediaQuery();
  const mobileScreenWidth = (size?.[0] ?? 0) < 889;

  const [page, setPage] = useState(1);
  const rows = isMobile? 8 : 28;
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    useGlobalDispatch(getVendorListAction(page, rows));
  }, [isMobile, page]);

  useEffect(() => {
    const newData = state.vendorListData?.list || [];
    const totalCount = state.vendorListData?.count || 0;

    if (isMobile) {
      setList((prev) => {
        const ids = new Set(prev.map((item) => item.product_id));
        const filteredNewData = newData.filter(
          (item) => !ids.has(item.product_id)
        );
        return [...prev, ...filteredNewData];
      });
      setHasMore(page * rows < totalCount);
    } else {
      setList(newData);
      setHasMore(page * rows < totalCount);
    }
  }, [state.vendorListData, isMobile, page, rows]);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isMobile]);

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
                <TopTitleBar title={t("mall")}></TopTitleBar>
              ) : (
                <WebTopBar />
              )}
            </TopBarContainer>
          </>
        ),
      },
    });
  }, [isMobile]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <VendorMainElement>
      <div className="pt-[1.35vw]">
        <ImageCarousel
          adsKey={adsKeys.shop_top_banner}
          threeInOneBanner={!isMobile}
          is_cover
          size="banner_main"
        />
      </div>
      <div className="vendor_container" onClick={goToVendor}>
        <p className="vendor_container_title"></p>
        <div className="relative">
          <Grid
            container
            direction="row"
            alignItems="start"
            rowSpacing={mobileScreenWidth ? 5.3 : 6.1}
            columnSpacing={0}
            className="m-auto"
          >
            {list?.map((data, index) => (
              <Grid item md={1.712} xs={6} sm={4} key={index + 1}>
                <VendorItemCard data={data} />
              </Grid>
            ))}
          </Grid>
        </div>
        {/* 移动端加载状态提示 */}
        {isMobile && !hasMore && <div className="mt-[10vw] text-center">没有更多了</div>}

      </div>
      <div className="flex justify-center">
        {/* PC端分页 */}
        {!isMobile && (
          <StyledPagination
            count={Math.ceil((state.vendorListData?.count || 0) / rows)}
            page={page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
        )}
      </div>
    </VendorMainElement>
  );
};

export default VendorMain;

const VendorMainElement = styled.div`
  /*  */
  padding-top: ${main_height}px;
  padding-bottom: ${bottom_nav_height}px;
  background-color: #ffffff;

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
    @media (max-width: 899px) {
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
    margin-top: 6.5vw;
    margin-bottom: 15vw;

    @media (min-width: 899px) {
      padding-right: 11.7%;
      padding-left: 11.7%;
      margin-top: 2.5vw;
      margin-bottom: 0;
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

const StyledPagination = styled(Pagination)`
  margin-top: 2.05vw;
  display: flex;
  justify-content: center;

  .MuiPagination-ul {
    gap: 10px; /* 按钮之间的间距 */
  }

  .MuiPaginationItem-root {
    border-radius: 5px;
    font-weight: bold;
    color: #555;
    transition: all 0.3s ease;
    border: 1px solid #d3d3d3;
    background-color: #fff;
    width: 35px;
    height: 37px;
  }

  .MuiPaginationItem-root:hover {
    background-color: #f0f0f0;
  }

  .Mui-selected {
    background-color: ${(props) =>
      props.theme?.colors?.dark_pink || "#ff367a"} !important;
    color: white !important;
  }
`;
