import React, { useCallback, useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import styled from "styled-components";

import { applyOriginal, colors, pageUrlConstants } from "@/lib/constants/index.js";
import LinkComponent from "@/components/common/LinkComponent";
import WavaButton from "@/components/layout/Header/WavaButton";

import openVip from "public/json/profile/open_vip.json";
import moneyIcon from "public/images/post/money.svg";

const AsideRecommend = ({ recommendList }) => {
    const AsideRecommendRef = useRef();
    const [stickyHeight, setStickyHeight] = useState(0);

    useEffect(() => {
        if (AsideRecommendRef.current && recommendList.length) {
            setStickyHeight(
                window.innerHeight - AsideRecommendRef.current.clientHeight
            );
        }
    }, [AsideRecommendRef.current?.clientHeight, recommendList.length]);

    const goToApplyOriginal = useCallback(() => {
        window.open(applyOriginal);
    }, []);

    return (
        <AsideRecommendElement ref={AsideRecommendRef} stickyHeight={stickyHeight}>
            <LinkComponent
                routes={
                    pageUrlConstants.profile.pages.profileBuyVip.pages.profileBuyVipCommon
                }
            >
                <Lottie animationData={openVip} loop={true} alt="open vip" />
            </LinkComponent>
            <div className="aside_recommend_container">
                <div className=" title_recommend">推薦原創主</div>
                {recommendList.map((data) => (
                    <div className="aside_recommend_field fw-s" key={data.uid}>
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
                            <img src={data.avatar} alt={data.nick_name} draggable={false} />
                        </LinkComponent>
                        {data.nick_name}
                    </div>
                ))}
                <LinkComponent
                    className="aside_recommend_more"
                    routes={pageUrlConstants.post.pages.postMain.pages.postMoreOriginal}
                >
                    看更多
                </LinkComponent>
            </div>
            <div className="divider">&nbsp;</div>
            <div className="aside_recommend_container">
                <div>
                    <div className="title_apply">申请成为原创主</div>
                    <div className="title_apply_1">轻松赚取高薪也看得开心</div>
                    <div onClick={goToApplyOriginal}>
                        <WavaButton className="aside_recommend_button">
                            我要申请
                            <img
                                src={moneyIcon}
                                alt={"apply_icon"}
                                className="aside_recommend_icon"
                            />
                        </WavaButton>
                    </div>
                </div>
            </div>
        </AsideRecommendElement>
    );
};

export default AsideRecommend;

export const AsideRecommendElement = styled.aside`
  /*  */
  display: flex;
  flex-direction: column;
  background-color: #fff;
  white-space: nowrap;
  height: 100%;
  width: 100%;
  position: sticky;
  max-width: 300px;
  top: ${({ stickyHeight }) => stickyHeight}px;
  .title {
    &_recommend {
      font-size: 20px;
      font-weight: 600;
    }
    &_apply {
      font-size: 18px;
      color: #ffb000;
      &_1 {
        color: black;
      }
    }
  }
  img {
    width: 45px;
    height: 45px;
    object-fit: cover;
    border-radius: 50px;
    user-select: none;
    -webkit-touch-callout: none;
  }
  .aside_recommend {
    &_container {
      background-color: #fff;
      display: flex;
      flex-direction: column;
      gap: 25px;
      padding: 1% 15px;
    }

    &_field {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: ${colors.text_grey};
      gap: 5px;
    }

    &_more {
      cursor: pointer;
      text-decoration: none;
      color: ${colors.dark_pink};
      border-radius: 40px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    &_button {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      margin: 10px;
      cursor: default;
      font-size: 16px;
      color: #fff;
      text-shadow: 0.09px 0px ${colors.text_grey};
      background-color: #ffb000;
      transition: 0.5s;
      border-radius: 20px;
      text-align: center;
      border: 2px solid black;
      cursor: pointer;
    }
    &_icon {
      width: 25px;
      height: 25px;
    }
  }

  .divider {
    height: 10px;
    background-color: #f3f4f5;
  }
`;
