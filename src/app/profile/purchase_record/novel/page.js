"use client";

import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import LinkComponent from "@/components/common/LinkComponent";
import { colors, padding, pageUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { getUserBuyAction } from "@/store/actions/pages/profilePurchaseRecordAction";

const ProfilePurchaseRecordNovel = () => {
  const { state } = useGlobalContext();

  const type = "BX";

  const dataList = useMemo(() => {
    return [...state.myBuyList[type].list];
  }, [state.myBuyList[type].list]);

  useEffect(() => {
    if (dataList.length === 0) {
      getListData(type);
    }
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
  }, []);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      getListData(type, scrollColdEnd);
    });
  }

  const getListData = (type, scrollColdEnd) => {
    useGlobalDispatch(getUserBuyAction(type, scrollColdEnd));
  };
  return (
    <ProfilePurchaseRecordNovelElement>
      <div className="container">
        {dataList.map((data) => {
          return (
            <LinkComponent
              className="container_item"
              routes={{
                name:
                  pageUrlConstants.home.pages.homeNovelsContent.name +
                  data.title,
                path: pageUrlConstants.home.pages.homeNovelsContent.path,
                dynamic: {
                  novelId: data.bid,
                },
              }}
              key={"novel" + data.id}
            >
              <div className="container_item_description">
                <div className="container_item_description_title">
                  <p className="container_item_description_title_text">
                    {data.title}
                  </p>
                </div>
                <div className="container_item_description_time">
                  <p className="container_item_description_time_text">
                    {data.create_time}
                  </p>
                </div>
              </div>
            </LinkComponent>
          );
        })}
      </div>
    </ProfilePurchaseRecordNovelElement>
  );
};

export default ProfilePurchaseRecordNovel;

export const ProfilePurchaseRecordNovelElement = styled.div`
  /*  */
  .container_item {
    display: flex;
    padding: ${padding / 2}px;
    text-decoration: none;
    color: #000;
    border-bottom: 1px solid #aaa;

    &:last-child {
      border-bottom: none;
    }

    &_description {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      margin-left: 20px;

      &_time {
        margin-top: 20px;

        &_text {
          color: ${colors.text_grey};
        }
      }
    }
  }
`;
