"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
// import PropTypes from "prop-types";

import PostCardItem from "@/components/posts/PostCardItem";
import paperAddIcon from "@public/images/icons/paper_add.svg";
import moreIcon from "@public/images/post/more_nor.svg";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { pageUrlConstants, colors } from "@/lib/constants/index.js";
import { useTranslations } from "next-intl";
import {
  clearScrollPage
} from "@/store/actions/historyActions";
import ImageComponent from "@/components/common/ImageComponent";
import LinkComponent from "@/components/common/LinkComponent";
import girl404 from "public/images/imgPlaceholder/girl404.png";
import LoadingSkeleton from "@/components/posts/LoadingSkeleton";
import { getPostListAction } from "@/store/actions/pages/postsRecommendFriendAction";
import { postGetRecommendOriginal } from "@/store/actions/pages/postsMoreOriginalAction";


import { useGlobalContext, useGlobalDispatch } from "@/store";
import Image from "next/image";

const PostsRecommendFriendRender = ({
  refreshData,
}) => {
  const location = usePathname();
  const t = useTranslations();
  const { size, isMobile } = useMediaQuery();
  const { width } = size;
  const { state } = useGlobalContext();

  const getLocalState = () => {
    const breadcrumbsLength = state.breadcrumbs.length;
    const newRoute = state.router?.location?.pathname;
    const notPath = state.breadcrumbs[breadcrumbsLength - 1]?.path;
    const lastPath = state.breadcrumbs[breadcrumbsLength - 2]?.path;
    const isFirstEnter = state.breadcrumbs.find((data, index) => {
      if (index < breadcrumbsLength - 1) return data.path === newRoute;
    });
    return {
      refreshData:
        notPath === lastPath || !isFirstEnter || breadcrumbsLength <= 1,
      postRecommendList: state.postRecommendList.list,
      postListData: state.postRecommendFriendList,
    };
  };

  const [localState, setLocalState] = useState(getLocalState());

  useEffect(() => {
    setLocalState(getLocalState());
  }, [state]);

  const updatePostListData = (scrollColdEnd = () => { }) => {
    useGlobalDispatch(getPostListAction(scrollColdEnd, ""));
  }
  const initPostListData = () => {
    useGlobalDispatch(getPostListAction(() => { }, "init"));
  }
  const floatBtnClick = () => {
    let user = store.getState().user;
    if (user.id === "guest") {
      useGlobalDispatch(pushRoutes(login));
    } else {
      useGlobalDispatch(pushRoutes(post.pages.postMain.pages.postAdd));
    }
  }
  const pushToNew = () => {
    useGlobalDispatch(pushRoutes(pageUrlConstants.post.pages.postMain));
  }
  const postGetRecommendOriginalAction = () => {
    useGlobalDispatch(postGetRecommendOriginal("init", () => { }));
  }

  useEffect(() => {
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //如果再當前頁面在點一次側欄
    if (
      refreshData ||
      !localState.postRecommendList?.length ||
      !localState.postListData?.list?.length
    ) {
      initPostListData();
      postGetRecommendOriginalAction();
      clearScrollPage();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  function scrollEvent() {
    scrollBottomCallEvent((scrollColdEnd) => {
      if (!localState.postListData.isDone) {
        updatePostListData(scrollColdEnd);
      }
    });
  }
  return (
    <PostsRecommendFriendElement>
      <section className="post_main_h5_original">
        <div className="post_main_h5_original_title">
          <div className="post_main_h5_original_title_left">推薦原創主</div>
          <LinkComponent
            className="post_main_h5_original_title_right"
            routes={pageUrlConstants.post.pages.postMain.pages.postMoreOriginal}
          >
            看更多 <Image src={moreIcon} width={0} height={0} alt="more" />
          </LinkComponent>
        </div>
        <div className="post_main_h5_original_list">
          {localState.postRecommendList?.map((data) => (
            <div key={data.id} className="post_main_h5_original_list_item">
              <LinkComponent
                routes={{
                  name: pageUrlConstants.post.pages.postMain.pages.postProfile
                    .name,
                  path: pageUrlConstants.post.pages.postMain.pages.postProfile
                    .path,
                  dynamic: {
                    profileId: data.id,
                  },
                }}
              >
                <ImageComponent
                  is_cover
                  src={data.avatar}
                  alt={data.nick_name}
                  title={data.nick_name}
                  height={60}
                />
              </LinkComponent>
              <div className="post_main_h5_original_list_item_cover">
                <span>{data.nick_name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="post_main_container">
        {localState.postListData.list?.map((data, index) => {
          return (
            <div key={data.id} className="post_main_item">
              <LoadingSkeleton>
                <PostCardItem postData={data} index={index} />
              </LoadingSkeleton>
            </div>
          );
        })}
        {localState.postListData.list?.length === 0 ? (
          <div className="container_empty">
            <Image className="container_empty_girl_img" src={girl404} width={0} height={0} alt="404" />
            <p className="container_empty_girl_text">
              {t('Global.tip.nothing')}
            </p>
            <div className="container_empty_btn" onClick={pushToNew}>
              <span className="container_empty_btn_text">
                {t('Post.go_search')}
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>

      {/* <FloatBtn
        style={{
          transform: "translateX(-50%) translateX(" + width * 0.48 + "px)",
        }}
        onClick={floatBtnClick}
      >
        <img className="float_btn_img" src={paperAddIcon} alt="btnPost" />
      </FloatBtn> */}
    </PostsRecommendFriendElement>
  );
};

PostsRecommendFriendRender.propTypes = {
  // title: PropTypes.string,
  // content: PropTypes.string,
  // noticeId: PropTypes.number
};

export default PostsRecommendFriendRender;

export const PostsRecommendFriendElement = styled.div`
  /*  */
  @media (max-width: 899px) {
    background-color: #f3f4f5;
    padding-top: 0;
  }
  .post_main {
    &_container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    &_item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: 0.25em;
    }

    &_h5_original {
      background-color: #fff;
      margin-bottom: 0.1em;
      padding: 10px 20px;
      @media (min-width: 899px) {
        display: none;
      }
      &_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &_left {
          font-weight: 700;
        }
        &_right {
          display: flex;
          align-items: center;
          text-decoration: none;
          white-space: nowrap;
          color: ${colors.text_light_grey};
          img {
            height: 20px;
          }
        }
      }
      &_list {
        display: flex;
        overflow-x: scroll;
        white-space: nowrap;
        padding: 10px 0;
        gap: 10px;
        &_item {
          position: relative;
          flex-shrink: 0;
          display: inline-block;
          overflow: hidden;
          width: 40%;
          &_cover {
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            background: rgba(1, 0, 1, 0.68);
            height: 20px;
            color: #fff;
            display: flex;
            width: 100%;
            align-items: center;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            span {
              padding-left: 10px;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
  .container_empty {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;
    min-height: 100vh;
    &_girl {
      &_img {
        margin-top: 20px;
        width: 150px;
        @media (max-width: 899px) {
          width: 100px;
        }
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
      @media (max-width: 899px) {
        width: 150px;
        padding: 5px 10px;
        font-size: 18px;
      }
      background-image: linear-gradient(
        to bottom,
        #fa83b3 0%,
        #f45c8c 50%,
        #f24c7c 100%
      );
      border-radius: 36px;
    }
  }
`;

export const FloatBtn = styled.div`
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
`;
