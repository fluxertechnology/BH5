"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import VendorItemCard from "@/components/vendor/VendorGameItemCard";
import { colors, side_padding } from "@/lib/constants";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useParams } from "next/navigation";
import { getVendorGameListAction } from "@/store/actions/pages/vendorMainAction";

const dropdownIcon = "/images/icons/dropdown.svg";

function VendorCategory() {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const t = useTranslations();
  const [typeSelect, setTypeSelect] = useState(0);

  const vendorCategoryId = useParams().category;
  const vendorListData = state.vendorGameListData.vendorList || [];
  const vendorCategoryTitle =
    typeof window !== "undefined" ? decodeURI(document.title) : "";

  useEffect(() => {
    window.removeEventListener("scroll", scrollEvent);
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeSelect]);

  useEffect(() => {
    resetGameListData(typeSelect);
    updateVendorList(typeSelect, vendorCategoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeSelect, isMobile]);

  function scrollEvent(e) {
    scrollBottomCallEvent((scrollColdEnd) => {
      updateVendorList(typeSelect, vendorCategoryId, scrollColdEnd);
    });
  }

  function onChangeType(e) {
    if (Number(e.target.value) !== typeSelect) {
      setTypeSelect(Number(e.target.value));
    }
  }

  const updateVendorList = (type, categoryId, scrollColdEnd = () => {}) => {
    useGlobalDispatch(getVendorGameListAction(type, categoryId, scrollColdEnd));
  };
  const resetGameListData = (categoryId) => {
    useGlobalDispatch({
      type: "RESET_VENDORGAMECATEGORYIDDATA",
      category_id: categoryId,
    });
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <TopBarContainer>
            <TopTitleBar
              title={vendorCategoryTitle}
              showBack={true}
              show_back_color="#ffffff"
            />
          </TopBarContainer>
        ),
      },
    });
  }, []);

  return (
    <VendorCategoryElement sub_height={state.navbar.subHeight}>
      <div className="vendor_container ">
        <p className="vendor_container_title pt-3">
          <select onChange={onChangeType}>
            <option value={0}>{t("Game.label.all_game")}</option>
            <option value={1}>{t("Game.label.pc_game")}</option>
            <option value={2}>{t("Game.label.android_game")}</option>
          </select>
        </p>
        {isMobile ? (
          <MobileContent vendorListData={vendorListData} />
        ) : (
          <WebContent vendorListData={vendorListData} />
        )}
      </div>
    </VendorCategoryElement>
  );
}

const WebContent = ({ vendorListData }) => {
  return (
    <div className="vendor_container_content">
      {vendorListData?.map((data) => (
        <div className="vendor_container_content_col" key={data.id}>
          <VendorItemCard data={data} />
        </div>
      ))}
    </div>
  );
};

const MobileContent = ({ vendorListData }) => {
  return (
    <div className="vendor_container_content">
      {vendorListData?.map((data, index) => {
        return (
          <div className="vendor_container_content_col" key={index}>
            <VendorItemCard data={data} key={data.id} />
          </div>
        );
      })}
    </div>
  );
};

export default VendorCategory;

const VendorCategoryElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["sub_height"].includes(prop),
})`
  ${({ sub_height }) => `
    /*  */
    padding-top: ${sub_height}px;
    .vendor_container {
        @media (min-width: 899px) {
        padding: 0 10px;
        }
        &_title {
        margin-top: 20px;
        font-weight: 900;
        display: flex;
        justify-content: center;
        select {
            appearance: none;
            background: url(${dropdownIcon}) no-repeat;
            background-size: 20px 20px;
            background-position: right center;
            border-radius: 24px;
            border: solid 1px ${colors.text_light_grey};
            color: ${colors.text_light_grey};
            background-color: #fff;
            font-size: 16px;
            padding: 10px 30px;
            background-position-x: 95%;
            width: 80%;
            text-align: center;
            @media (min-width: 899px) {
            background-position-x: 99%;
            }
        }
        }

        &_content {
        display: flex;
        flex-wrap: wrap;
        @media (min-width: 899px) {
            flex-direction: row;
        }

        &_col {
            padding: 1px 5px;
            box-sizing: border-box;
            width: 50%;
            @media (min-width: 899px) {
            padding: ${side_padding}px;
            width: calc(100% / 6);
            break-inside: avoid;
            }
        }
        }
    }
  `}
`;
