"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import styles from "@/styles/components/ProfileMyorderRender.module.scss";
import ImageComponent from "@/components/common/ImageComponent";
import cx from "classnames";
import LinkComponent from "@/components/common/LinkComponent";
import { apiUrl, pageUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { getMyOrderListAction } from "@/store/actions/pages/profileMyorderAction";

const { profile } = pageUrlConstants;

const ProfileMyorder = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  useEffect(() => {
    if (state.myorderData.list.length === 0) {
      getMyOrderList();
    }
  }, []);

  const getMyOrderList = () => {
    let uid = state.user.id;
    useGlobalDispatch(
      getMyOrderListAction({
        uid,
      })
    );
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <TopBarContainer>
            <TopTitleBar
              title={t("Profile.my.order.mall.order")}
              show_back_color="#ffffff"
              showBack={true}
            />
          </TopBarContainer>
        ),
      },
    });
  }, []);

  return (
    <ProfileMyorderElement main_height={state.navbar.mainHeight}>
      <div className={styles.myorder_container}>
        {state.myorderData.list.map((data) => {
          return (
            <LinkComponent
              className={styles.myorder_container_item}
              routes={{
                name: profile.pages.profileMyorderDetail.name + data.title,
                path: profile.pages.profileMyorderDetail.path,
                dynamic: {
                  orderId: data.oderid,
                },
              }}
              key={data.oderid}
            >
              <div className={styles.myorder_container_item_cover}>
                <ImageComponent
                  className={styles.myorder_container_item_cover_img}
                  src={
                    data.picurl.indexOf("http") === -1
                      ? apiUrl + data.picurl
                      : data.picurl
                  }
                  alt={data.title}
                  title={data.title}
                  border_radius="0"
                />
              </div>
              <div className={styles.myorder_container_item_info}>
                <h3 className={styles.myorder_container_item_info_title}>
                  {data.title}
                </h3>
                <p className={styles.myorder_container_item_info_price}>
                  {~~data.amount}{" "}
                  {data.paytype ? t("Global.gold_money") : t("Global.money")}
                </p>
                <p
                  className={cx(styles.myorder_container_item_info_state, {
                    [styles.done]:
                      data.fahuoxinxi === t("Profile.my.order.success") ||
                      data.order_type !== "actual",
                  })}
                >
                  {data.order_type === "actual"
                    ? data.fahuoxinxi
                    : intl.formatMessage({ id: "PROFILE.MY.ORDER.SUCCESS" })}
                </p>
              </div>
            </LinkComponent>
          );
        })}
      </div>
    </ProfileMyorderElement>
  );
};

export default ProfileMyorder;

export const ProfileMyorderElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding-top: ${main_height}px;
  `}
`;
