"use client";

import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import LinkComponent from "@/components/common/LinkComponent";
import { padding, pageUrlConstants } from "@/lib/constants";
import ImageComponent from "@/components/common/ImageComponent";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { getUserBuyAction } from "@/store/actions/pages/profilePurchaseRecordAction";

const ProfilePurchaseRecordSocial = () => {
  const { state } = useGlobalContext();

  const type = "BO";

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
    <ProfilePurchaseRecordSocialElement>
      <div className="container">
        {dataList.map((data) => {
          return (
            <LinkComponent
              className="container_item"
              routes={{
                name:
                  pageUrlConstants.social.pages.socialDetailInfo.name +
                  data.title,
                path: pageUrlConstants.social.pages.socialDetailInfo.path,
                dynamic: {
                  profileId: data.bid,
                },
              }}
              key={"social" + data.id}
            >
              <div className="container_item_cover">
                <ImageComponent
                  src={imgUrl + data.img}
                  alt={data.title}
                  title={data.title}
                  height={145}
                />
              </div>
              <div className="container_item_description">
                <div className="container_item_description_title">
                  <p className="container_item_description_title_text">
                    {data.title}
                  </p>
                </div>
                <div className="container_item_description_info">
                  <p className="container_item_description_info_text">
                    {data.description}
                  </p>
                </div>
              </div>
            </LinkComponent>
          );
        })}
      </div>
    </ProfilePurchaseRecordSocialElement>
  );
};

export default ProfilePurchaseRecordSocial;

export const ProfilePurchaseRecordSocialElement = styled.div`
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

    &_cover {
      flex-shrink: 0;
      width: 20%;
      max-width: 150px;
    }

    &_description {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      margin-left: 20px;
    }
  }
`;
