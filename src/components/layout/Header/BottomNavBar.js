"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import useMediaQuery from "@/hooks/useMediaQuery";

// import PropTypes from "prop-types";
import styled from "styled-components";
import { pushRoutes } from "@/store/actions/historyActions";
import { colors, pageUrlConstants } from "@/lib/constants";
import WavaButton from "@/components/layout/Header/WavaButton";

// import socialIcon from "public/images/header/bottomNav/social_pre_btn.png";
// import socialIconSelected from "public/images/header/bottomNav/social_selected_btn.png";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import Image from "next/image";

const { home, post, social, vendor, profile } = pageUrlConstants;

const areEqual = (pre, next) => {
  return JSON.stringify(pre) === JSON.stringify(next);
};

const BottomNavBar = () => {
  const root = useRef(null);
  const t = useTranslations();
  const location = usePathname();
  const { state } = useGlobalContext();
  const new_coupon_notification = state.user.new_coupon_notification;
  const { isMobile } = useMediaQuery();

  let [navList, setNavList] = useState(() => [
    {
      cname: t("Navbar.bottom_navigator_index"),
      name: home.pages.homeMain.name,
      path: home.pages.homeMain.path,
      image: "/images/header/bottomNav/home_pre_btn.png",
      activeImage: "/images/header/bottomNav/home_selected_btn.png",
    },
    {
      cname: t("Navbar.bottom_navigator_dynamic"),
      name: post.pages.postMain.name,
      path: post.pages.postMain.path,
      image: "/images/header/bottomNav/feed_pre_btn.png",
      activeImage: "/images/header/bottomNav/feed_selected_btn.png",
    },
    // {
    //   cname: intl.formatMessage({ id: "BOTTOM.NAVIGATOR.AND_CHILL" }),
    //   name: social.name,
    //   path: social.path,
    //   image: socialIcon,
    //   activeImage: socialIconSelected,
    // },
    {
      cname: t("Navbar.bottom_navigator_mall"),
      name: vendor.name,
      path: vendor.path,
      image: "/images/header/bottomNav/shop_pre_btn.png",
      activeImage: "/images/header/bottomNav/shop_selected_btn.png",
    },
    {
      cname: t("Navbar.bottom_navigator_my"),
      name: profile.name,
      path: profile.path,
      image: "/images/header/bottomNav/info_pre_btn.png",
      activeImage: "/images/header/bottomNav/info_selected_btn.png",
      decoration: {
        show: new_coupon_notification,
      },
    },
  ]);

  useEffect(() => {
    // navList[4].decoration.show = new_coupon_notification;
    setNavList(navList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [new_coupon_notification]);

  const clickItem = (routes) => {
    useGlobalDispatch(pushRoutes(routes));
  };

  return (
    <BottomNavBarElement ref={root} show_bottom_nav={isMobile}>
      <div className="bottom_nav">
        {navList.map((data) => {
          return (
            <div
              className="bottom_nav_item"
              key={data.cname}
              onClick={(e) => {
                clickItem(data);
              }}
            >
              <WavaButton
                className={
                  "bottom_nav_item_btn " +
                  (location.indexOf(data.path) !== -1 ? "active" : "")
                }
                currentRefs={[root]}
              >
                <div className="bottom_nav_item_btn_icon">
                  <Image
                    className={"bottom_nav_item_btn_icon_img"}
                    src={
                      location.indexOf(data.path) !== -1
                        ? data.activeImage
                        : data.image
                    }
                    width={30}
                    height={30}
                    alt="icon"
                  />
                  {data.decoration?.show ? (
                    <div className="bottom_nav_item_btn_icon_dot" />
                  ) : (
                    ""
                  )}
                </div>
                <div className="bottom_nav_item_btn_title">
                  <p className="bottom_nav_item_btn_title_text">{data.cname}</p>
                </div>
              </WavaButton>
            </div>
          );
        })}
      </div>
    </BottomNavBarElement>
  );
};

export default React.memo(BottomNavBar, areEqual);

export const bottom_nav_height = 62;

const BottomNavBarElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["show_bottom_nav"].includes(prop),
  })`
  /*  */
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  height: ${bottom_nav_height}px;
  transform: ${({ show_bottom_nav }) =>
    "translateY(" + (show_bottom_nav ? "1" : "110") + "%)"};
  margin: auto;
  background-color: #fff;
  box-shadow: 0 -1px 2px 0 rgb(0 0 0 / 30%);
  .bottom_nav {
    display: flex;
    &_item {
      cursor: pointer;
      user-select: none;
      flex-grow: 1;

      &_btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;

        &_icon {
          position: relative;
          width: 30px;
          height: 30px;

          &_img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
            transition: 0.3s;
          }

          &_dot {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 10px;
            height: 10px;
            background-color: #f00;
            border-radius: 50%;
          }
        }

        &_title {
          &_text {
            font-size: 12px;
            color: ${colors.text_grey};
            font-weight: 600;
          }
        }

        &.active {
          .bottom_nav_item_btn_icon_img {
            transform: translateY(-3px) scale(1.01);
            transform-origin: bottom center;
          }

          .bottom_nav_item_btn_title_text {
            color: ${colors.dark_pink};
          }
        }
      }
    }
  }
  @media (min-width: 599px) {
    max-width: 100%;
    .bottom_nav_item_btn_title_text {
      font-size: 16px;
    }
    .bottom_nav_item_btn_icon {
      width: 30px;
      height: 30px;
    }
  }
`;
