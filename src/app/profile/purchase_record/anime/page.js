"use client";

import React, { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import LinkComponent from "@/components/common/LinkComponent";
import { colors, padding, pageUrlConstants } from "@/lib/constants";
import ImageComponent from "@/components/common/ImageComponent";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { getUserBuyAction } from "@/store/actions/pages/profilePurchaseRecordAction";

const ProfilePurchaseRecordAnime = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  const type = "BAV";
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
    <ProfilePurchaseRecordAnimeElement>
      <div className="container">
        {dataList.map((data) => {
          return (
            <LinkComponent
              className="container_item"
              routes={{
                name:
                  pageUrlConstants.home.pages.homeAnimesSwitch.pages
                    .homeAnimesContent.name +
                  data.title +
                  "-1",
                path: pageUrlConstants.home.pages.homeAnimesSwitch.pages
                  .homeAnimesContent.path,
                dynamic: {
                  animeId: data.bid,
                  animeEp: 1,
                },
              }}
              key={"animate" + data.id}
            >
              <div className="container_item_cover">
                <ImageComponent
                  src={data.img}
                  alt={data.title}
                  title={data.title}
                  height={65}
                />
              </div>
              <div className="container_item_description">
                <div className="container_item_description_title">
                  <p className="container_item_description_title_text fw-l">
                    {data.title}
                  </p>
                </div>
                <div className="container_item_description_ep">
                  <p className="container_item_description_ep_text fw-m">
                    {data.process === 1
                      ? t("Global.update_to")
                      : t("Global.total")}
                    {data.total_episode}
                    {t("Global.word")}
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
    </ProfilePurchaseRecordAnimeElement>
  );
};

export default ProfilePurchaseRecordAnime;

export const ProfilePurchaseRecordAnimeElement = styled.div`
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
      width: 12%;
      max-width: 250px;
      padding: 0.5%;
    }

    &_description {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      margin-left: 10px;

      &_ep,
      &_time {
        &_text {
          color: ${colors.text_grey};
        }
      }

      &_ep {
        margin-top: 20px;
      }
    }
  }
`;
