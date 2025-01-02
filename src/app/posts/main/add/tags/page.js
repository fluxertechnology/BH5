"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { colors } from "@/lib/constants";
import WavaButton from "@/components/layout/Header/WavaButton";
import Image from "next/image";
import { backRoutes } from "@/store/actions/historyActions";
import {
  getPostAddTags,
  setPostSelectTags,
} from "@/store/actions/pages/postAddTagsAction";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useSaveStateData from "@/hooks/useSaveStateData";

const PostAddTags = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const [storeSelect, setStoreSelect] = useState(
    state.postTags.selectTags || []
  );
  const { isMobile } = useMediaQuery();
  useEffect(() => {
    getPostAddTagsDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isSubmit, setIsSubmit] = useState(false);
  function onSubmitStore() {
    setIsSubmit(true);
    setPostSelectTagsDispatch(storeSelect);
  }

  useEffect(() => {
    if (isSubmit) {
      setIsSubmit(false);
      useSaveStateData(state);
        goBackRoutes();
    }
  }, [state.postTags.selectTags]);

  function onSelect(select) {
    if (storeSelect.find((data) => data.id === select.id)) {
      setStoreSelect(storeSelect.filter((data) => data.id !== select.id));
    } else {
      setStoreSelect((pre) => [...pre, select]);
    }
  }
  function onDelete(select) {
    setStoreSelect(storeSelect.filter((data) => data.id !== select.id));
  }

  const getPostAddTagsDispatch = (goodsId) => {
    useGlobalDispatch(getPostAddTags(goodsId));
  };
  const setPostSelectTagsDispatch = (data) => {
    useGlobalDispatch(setPostSelectTags(data));
  };
  const goBackRoutes = () => {
    useGlobalDispatch(backRoutes());
  };

  return (
    <PostAddTagsElement main_height={state.navbar.mainHeight}>
      {isMobile && (
        <TopBarContainer>
          <TopTitleBar
            title={t("Post.hot_topic")}
            showBack={true}
            color="#000"
            back_color="#fff"
            show_back_color="#000"
          >
            <div className="post_add_tags_confirm_h5" onClick={onSubmitStore}>
              確定
            </div>
          </TopTitleBar>
        </TopBarContainer>
      )}
      {!isMobile && (
        <>
          <TopTitleBar
            title={t("Post.hot_topic")}
            showBack={true}
            color="#000"
            back_color="#fff"
            show_back_color="#000"
          />
          <div className="post_add_tags_confirm" onClick={onSubmitStore}>
            確定
          </div>
        </>
      )}
      <section className="post_add_tags_main">
        <h2 className="post_add_tags_title">热门标籤</h2>
        <div className="post_add_tags ">
          {state.postTags.postTags.map((item, index) => {
            return (
              <div onClick={() => onSelect(item)} key={index}>
                <WavaButton
                  className={`post_add_tags_main_item cursor ${
                    storeSelect.find((data) => data.id === item.id)
                      ? "active"
                      : ""
                  }`}
                  key={`${item.name}-${index}`}
                >
                  {item.name}
                </WavaButton>
              </div>
            );
          })}
        </div>

        <h2 className="post_add_tags_title">已选择</h2>
        <div className="post_add_tags">
          {storeSelect.map((item, index) => {
            return (
              <div className="post_add_tags_main_item_container" key={index}>
                <div
                  className={`post_add_tags_main_item  ${
                    storeSelect.find((data) => data.id === item.id)
                      ? "active"
                      : ""
                  }`}
                  key={item.name}
                >
                  {item.name}
                </div>
                <div
                  className="post_add_tags_close cursor"
                  onClick={() => onDelete(item)}
                >
                  <Image
                    src="/images/post/close_icon.svg"
                    width={0}
                    height={0}
                    alt="Close Icon"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PostAddTagsElement>
  );
};

export default PostAddTags;

export const PostAddTagsElement = styled.article.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
  /*  */
  .post_add_tags {
    padding: 10px 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 5em;
    @media (max-width: 899px) {
      padding: 5px 10px;
    }
    &_confirm {
      position: absolute;
      top: 0;
      right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: ${main_height}px;
      cursor: pointer;
      color: ${colors.dark_pink};
      font-weight: 600;
      &_h5 {
        cursor: pointer;
        color: ${colors.dark_pink};
        font-weight: 600;
      }
    }

    &_title {
      padding: 5px 25px;
      margin-top: 10px;
      color: ${colors.text_grey};
      font-weight: 600;
      font-size: 18px;
    }

    &_main {
      padding-top: ${main_height}px;
      background-color: #fff;
      min-height: 100vh;
      border-top: solid;
      border-width: 1px;
      border-color: rgba(0, 0, 0, 0.3);
      &_item {
        line-height: 20px;
        padding: 5px 20px;
        border-radius: 16px;
        color: #a8a8a8;
        background: #f3f4f5;
        white-space: nowrap;
        transition: all 0.5s ease-in-out;
        &.active {
          color: #fff;
          background: ${colors.dark_pink};
        }

        &_container {
          position: relative;
        }
      }
    }

    &_close {
      position: absolute;
      top: 0;
      right: 0;
      top: -6px;
      right: -4px;
      img {
        width: 15px;
        height: 15px;
      }
    }
  }
`}
`;
