"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import styled from "styled-components";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import LinkComponent from "@/components/common/LinkComponent";
import { colors, padding, pageUrlConstants } from "@/lib/constants";
import ImageComponent from "@/components/common/ImageComponent";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { getUserCollectAction } from "@/store/actions/pages/profileMyCollectAction";
import Image from "next/image";

const ProfileMyCollectComic = ({ type = "CAC" }) => {
  const t = useTranslations();

  const { state } = useGlobalContext();
  const dataList = [...state.myCollectList["CAC"].list];
  const getListData = (type) => {
    useGlobalDispatch(getUserCollectAction(type));
  };

  useEffect(() => {
    getListData(type);
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollEvent() {
    scrollBottomCallEvent(() => {
      getListData(type);
    });
  }
  return (
    <ProfileMyCollectComicElement>
      <div className="container">
        {dataList.length ? (
          dataList.map((data) => {
            return (
              <LinkComponent
                className="container_item"
                routes={{
                  name:
                    pageUrlConstants.home.pages.homeComicList.pages
                      .homeComicListSwitch.pages.homeComicListContent.name +
                    data.title,
                  path: pageUrlConstants.home.pages.homeComicList.pages
                    .homeComicListSwitch.pages.homeComicListContent.path,
                  dynamic: {
                    comicId: data.cid,
                  },
                }}
                key={data.id}
              >
                <div className="container_item_cover">
                  <ImageComponent
                    src={data.img}
                    alt={data.title}
                    title={data.title}
                    height={145}
                  />
                </div>
                <div className="container_item_description">
                  <div className="container_item_description_title">
                    <p className="container_item_description_title_text fw-m">
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
                      {data.collect_time}
                    </p>
                  </div>
                </div>
              </LinkComponent>
            );
          })
        ) : (
          <div className="empty">
            <Image
              width={233}
              height={375}
              className="empty_img"
              src={"/images/imgPlaceholder/girl404.png"}
              alt="404 girl"
            />
            <p className="empty_text mb-5 fw-m">
              {t("Global.tip.nothing")}
            </p>
            <LinkComponent
              className="empty_button fw-m"
              routes={{
                name: pageUrlConstants.home.pages.homeMain.pages.homeCategory
                  .name,
                path: pageUrlConstants.home.pages.homeMain.pages.homeCategory
                  .path,
                dynamic: {
                  tab: t("Global.comics"),
                },
              }}
            >
              {t("Global.tip.search")}
            </LinkComponent>
          </div>
        )}
      </div>
    </ProfileMyCollectComicElement>
  );
};

export default ProfileMyCollectComic;

export const ProfileMyCollectComicElement = styled.div`
  /*  */
  .container_item {
    display: flex;
    padding: ${padding}px;
    text-decoration: none;
    color: #000;
    border-bottom: 1px solid #aaa;

    &:last-child {
      border-bottom: none;
    }

    &_cover {
      flex-shrink: 0;
      width: 20%;
      max-width: 100px;
    }

    &_description {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      margin-left: 20px;

      &_title {
        font-size: 20px;
      }

      &_ep,
      &_time {
        &_text {
          color: ${colors.text_grey};
        }
      }

      &_ep {
        margin-top: 40px;
      }
    }
  }

  .empty {
    width: 100%;
    text-align: center;

    &_img {
      margin: 8% auto 10px auto;
      width: 10%;
      vertical-align: middle;
    }

    &_text {
      font-size: 16px;
      color: #777;
    }

    &_button {
      background-color: ${colors.dark_pink};
      color: #fff;
      border-radius: 20px;
      font-size: 18px;
      padding: 10px 5%;
      border: 0;
    }
  }
`;
