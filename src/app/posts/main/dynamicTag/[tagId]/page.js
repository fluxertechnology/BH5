"use client";

import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import useMediaQuery from "@/hooks/useMediaQuery";
import PostCardItem from "@/components/posts/PostCardItem";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { useTranslations } from "next-intl";
import { colors } from "@mui/material";
import {
  getPostSameTagListAction,
  getPostTags,
} from "@/store/actions/pages/postsSameTagListAction";
import { backRoutes, pushRoutes } from "@/store/actions/historyActions";
import { pageUrlConstants } from "@/lib/constants";
import Image from "next/image";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useParams } from "next/navigation";

const { login, post } = pageUrlConstants;

const PostsSameTagListPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { size, isMobile } = useMediaQuery();
  const { width } = size;

  const tagId = useParams().tagId;
  const title = useMemo(() => {
    state.postTags.postTags.filter((data) => data.id == tagId)[0]?.name || [];
  }, [tagId]);

  useEffect(() => {
    getPostTagsFunc();
    initPostSameListTagData();

    const handleScroll = () => {
      scrollBottomCallEvent((scrollColdEnd) => {
        if (!state.postSameTagList.isDone) {
          updatePostSameListTagData(scrollColdEnd);
        }
      });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [title]);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      if (!state.postSameTagList.isDone) {
        updatePostSameListTagData(scrollColdEnd);
      }
    });
  }

  const updatePostSameListTagData = (scrollColdEnd = () => { }) => {
    useGlobalDispatch(getPostSameTagListAction(scrollColdEnd));
  };
  const initPostSameListTagData = () => {
    useGlobalDispatch(getPostSameTagListAction(() => { }, "init"));
  };
  const floatBtnClick = () => {
    let user = state.user;
    if (user.id === "guest") {
      useGlobalDispatch(pushRoutes(login));
    } else {
      useGlobalDispatch(pushRoutes(post.pages.postMain.pages.postAdd));
    }
  };
  const backRoutesFunc = () => {
    useGlobalDispatch(backRoutes());
  };
  const getPostTagsFunc = () => {
    useGlobalDispatch(getPostTags());
  };

  return (
    <PostsSameTagListPageElement main_height={state.navbar.mainHeight}>
      <TopBarContainer not_fixed={!isMobile} z_index={5}>
        <TopTitleBar
          title={title}
          showBack={true}
          show_back_color={"#000"}
          back_color={"#fff"}
          color={"#000"}
        />
      </TopBarContainer>
      <section className="post_main_container">
        {state.postSameTagList.list.map((data, index) => {
          return (
            <div key={data.id} className="post_main_item">
              <PostCardItem postData={data} index={index} />
            </div>
          );
        })}
        {state.postSameTagList.list.length === 0 ? (
          <div className="container_empty">
            <div className="container_empty_girl">
              <Image
                className="container_empty_girl_img"
                src="/images/imgPlaceholder/girl404.png"
                width={0}
                height={0}
                alt="404"
              />
              <p className="container_empty_girl_text">
                {t("Global.tip.nothing")}
              </p>
            </div>
            <div className="container_empty_btn" onClick={backRoutesFunc}>
              <span className="container_empty_btn_text">
                {t("Post.go_search")}
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
      {/* <FloatBtn
        bottom_nav_height={state.navbar.bottomNavHeight}
        style={{
          transform: "translateX(-50%) translateX(" + width * 0.48 + "px)",
        }}
        onClick={floatBtnClick}
      >
        <img className="float_btn_img" src={paperAddIcon} alt="btnPost" />
      </FloatBtn> */}
    </PostsSameTagListPageElement>
  );
};

export default PostsSameTagListPage;

export const PostsSameTagListPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    @media (max-width: 899px) {
        background-color: #f3f4f5;
    }
    .post_main {
        &_container {
        padding-top: ${main_height}px;
        display: flex;
        flex-direction: column;
        min-height: 150vh;
        }

        &_item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom: 5px;
        }
    }
    .container_empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        min-height: 150vh;
        &_girl {
        margin-top: 20px;

        &_img {
            width: 150px;
        }

        &_text {
            margin-top: 15px;
            font-size: 14px;
            color: ${colors.text_grey};
        }
        }

        &_btn {
        cursor: pointer;
        display: inline-block;
        padding: 18px;
        margin-top: 15px;
        width: 200px;
        font-size: 20px;
        text-align: center;
        color: #fff;
        background-image: linear-gradient(
            to bottom,
            #fa83b3 0%,
            #f45c8c 50%,
            #f24c7c 100%
        );
        border-radius: 36px;
        }
    }
  `}
`;

export const FloatBtn = styled.div.withConfig({
  shouldForwardProp: (prop) => !["bottom_nav_height"].includes(prop),
})`
  ${({ bottom_nav_height }) => `
    /*  */
    cursor: pointer;
    position: fixed;
    right: 0;
    bottom: calc(${(bottom_nav_height + 10) * 2}px);
    left: 0;
    z-index: 1;
    overflow: hidden;
    margin: auto;
    width: 50px;
    border-radius: 50%;
    box-shadow: 3px 3px 6px #0006;
    .float_btn_img {
        width: 100%;
        vertical-align: middle;
    }
    @media (min-width: 899px) {
        display: none;
    }
  `}
`;
