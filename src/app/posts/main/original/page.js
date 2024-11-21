"use client";

import React, { useEffect,useMemo  } from "react";
import styled from "styled-components";
import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import { pageUrlConstants } from "@/lib/constants/index.js";
import TopTitleBar from "@/components/common/TopTitleBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTranslations } from "next-intl";
import ImageComponent from "@/components/common/ImageComponent";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import LinkComponent from "@/components/common/LinkComponent";

import { useGlobalContext, useGlobalDispatch } from "@/store";
import { postGetRecommendOriginal } from '@/store/actions/pages/postsMoreOriginalAction'

const PostsMoreOriginalPage = ({
}) => {
    const t = useTranslations();
    const { isMobile } = useMediaQuery();

    const { state } = useGlobalContext();

    const localState = useMemo(() => {
        return {
            postRecommendList: state.postRecommendList,
            user: state.user,
        };
    }, [state])

    const postGetRecommendOriginalAction = (status, scrollColdEnd) => {
        useGlobalDispatch(postGetRecommendOriginal(status, scrollColdEnd));
    }

    useEffect(() => {
        if (parseInt(localState.postRecommendList.page) === 0) {
            postGetRecommendOriginalAction("init", () => { });
        }
        window.addEventListener("scroll", scrollEvent);
        return () => {
            window.removeEventListener("scroll", scrollEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function scrollEvent() {
        scrollBottomCallEvent((scrollColdEnd) => {
            if (!localState.postRecommendList.isDone) {
                postGetRecommendOriginalAction("update", scrollColdEnd);
            }
        });
    }

    return (
        <PostsMoreOriginalPageElement>
            <TopBarContainer not_fixed={!isMobile} z_index={5}>
                <TopTitleBar
                    textAlign={isMobile ? "center" : "start"}
                    showBack={isMobile}
                    title={t('Post.recommend_original')}
                    show_back_color={isMobile && "#000"}
                    back_color={isMobile && "#fff"}
                    color={isMobile && "#000"}
                />
            </TopBarContainer>
            <div className="content">
                {localState.postRecommendList?.list?.map((data) => (
                    <div key={data.uid} className="postRecommendList_item">
                        <LinkComponent
                            routes={{
                                name: pageUrlConstants.post.pages.postMain.pages.postProfile
                                    .name,
                                path: pageUrlConstants.post.pages.postMain.pages.postProfile
                                    .path,
                                dynamic: {
                                    profileId: data.uid,
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
                        <div
                            className="postRecommendList_item_cover"
                            style={{ pointerEvents: "none" }}
                        >
                            <span>{data.nick_name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </PostsMoreOriginalPageElement>
    );
};

PostsMoreOriginalPage.propTypes = {
    // title: PropTypes.string,
    // content: PropTypes.string,
    // noticeId: PropTypes.number
};

export default PostsMoreOriginalPage;

export const PostsMoreOriginalPageElement = styled.div.withConfig({
    shouldForwardProp: (prop) =>
        !["main_height"].includes(prop),
})`
  /*  */
  background: #fff;
  min-height: 120vh;
  padding: 15px;
  padding-top: ${main_height}px;

  .divider {
    height: 1px;
    width: 60%;
    background-color: #a8a8a8;
    margin-top: 20px;
  }
  .content {
    display: grid;
    padding-top: 10px;
    grid-template-columns: repeat(4, auto);
    grid-template-rows: auto;
    gap: 20px;
    @media (max-width: 898px) {
      grid-template-columns: repeat(2, auto);
      grid-template-rows: auto;
    }
  }
  .postRecommendList {
    &_item {
      position: relative;
      &_cover {
        position: absolute;
        bottom: 0;
        right: 0;
        background: rgba(1, 0, 1, 0.68);
        height: 25px;
        color: #fff;
        display: flex;
        width: 100%;
        align-items: center;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        span {
          padding-left: 10px;
        }
      }
    }
  }
`;
