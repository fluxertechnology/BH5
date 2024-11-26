"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import styles from "@/styles/components/ProfileMyorderDetailRender.module.scss";
import ImageComponent from "@/components/common/ImageComponent";
import { apiUrl, pageUrlConstants } from "@/lib/constants";
import cx from "classnames";
import { getMyorderDetailAction } from "@/store/actions/pages/profileMyorderDetailAction";
import LinkComponent from "@/components/common/LinkComponent";
import { useParams } from "next/navigation";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const ProfileMyorderDetail = () => {
  const { state } = useGlobalContext();

  const goodsId = useParams().orderId;

  const t = useTranslations();
  useEffect(() => {
    getMyorderDetail(goodsId);
  }, []);

  const goodsData = useMemo(() => {
    return state.myorderDataDetail[goodsId]
      ? state.myorderDataDetail[goodsId]
      : {};
  }, [state.myorderDataDetail]);

  const getMyorderDetail = (goodsId) => {
    useGlobalDispatch(
      getMyorderDetailAction({
        uid: state.user.id,
        oderid: goodsId,
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
              title={goodsData.title}
              showBack={true}
              color="#000"
              back_color="#fff"
            />
          </TopBarContainer>
        ),
      },
    });
  }, []);

  return (
    <ProfileMyorderDetailElement main_height={state.navbar.mainHeight}>
      <div className={styles.myorder_detail_container}>
        <div className={styles.myorder_detail_container_info}>
          <div className={styles.myorder_detail_container_info_cover}>
            <ImageComponent
              className={styles.myorder_detail_container_info_cover_img}
              src={
                goodsData.picurl?.indexOf("http") === -1
                  ? apiUrl + goodsData.picurl
                  : goodsData.picurl
              }
              placeholderImg={
                goodsData.picurl?.indexOf("http") === -1
                  ? apiUrl + goodsData.picurl
                  : goodsData.picurl
              }
              alt={goodsData.title}
              title={goodsData.title}
              border_radius="0"
            />
          </div>
          <div className={styles.myorder_detail_container_info_description}>
            <h3
              className={styles.myorder_detail_container_info_description_title}
            >
              {goodsData.title}
            </h3>
          </div>
        </div>
        <div className={styles.myorder_detail_container_price}>
          <div className={styles.myorder_detail_container_price_label}>
            <p className={styles.myorder_detail_container_price_label_text}>
              {t("Profile.my.order.detail.total")}
            </p>
          </div>
          <div className={styles.myorder_detail_container_price_amount}>
            <p className={styles.myorder_detail_container_price_amount_text}>
              {parseInt(goodsData.amount || 0)}
              <span
                className={
                  styles.myorder_detail_container_price_amount_text_unit
                }
              >
                {goodsData.paytype ? t("Global.gold_money") : t("Global.money")}
              </span>
            </p>
          </div>
        </div>
        <div className={styles.myorder_detail_container_serial}>
          <div className={styles.myorder_detail_container_serial_label}>
            <p className={styles.myorder_detail_container_serial_label_text}>
              {t("Profile.my.order.detail.redeem_code")}
            </p>
          </div>
          <div className={styles.myorder_detail_container_serial_amount}>
            <p className={styles.myorder_detail_container_serial_amount_text}>
              {goodsData.gift_status === "1" ? "--" : goodsData.extract_code}
            </p>
          </div>
        </div>
        <div className={styles.myorder_detail_container_state}>
          <div className={styles.myorder_detail_container_state_label}>
            <p className={styles.myorder_detail_container_state_label_text}>
              {t("Profile.my.order.detail.status")}
            </p>
          </div>
          <div className={styles.myorder_detail_container_state_show}>
            <p
              className={cx(styles.myorder_detail_container_state_show_text, {
                [styles.done]:
                  goodsData.fahuoxinxi ===
                    t("Profile.my.order.detail.success") ||
                  goodsData.order_type !== "actual",
              })}
            >
              {goodsData.order_type === "actual"
                ? goodsData.fahuoxinxi
                : t("Profile.my.order.detail.success")}
            </p>
          </div>
        </div>

        {goodsData.order_type === "actual" ? (
          <div className={styles.myorder_detail_container_receiver}>
            <div className={styles.myorder_detail_container_receiver_title}>
              <h3
                className={styles.myorder_detail_container_receiver_title_text}
              >
                {t("Profile.my.order.detail.received_data")}
              </h3>
              {goodsData.gift_status === "1" ? (
                <p
                  className={
                    styles.myorder_detail_container_receiver_title_give
                  }
                >
                  {t("Profile.my.order.detail.donate")}
                  {goodsData.to_username}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className={styles.myorder_detail_container_receiver_info}>
              <p className={styles.myorder_detail_container_receiver_info_text}>
                {t("Profile.my.order.detail.received")}
                {goodsData.username}
              </p>
              <p className={styles.myorder_detail_container_receiver_info_text}>
                {t("Profile.my.order.detail.area")}
                {goodsData.area}
              </p>
              <p className={styles.myorder_detail_container_receiver_info_text}>
                {t("Profile.my.order.detail.address")}
                {goodsData.address}
              </p>
              <p className={styles.myorder_detail_container_receiver_info_text}>
                {t("Profile.my.order.detail.post_code")}
                {goodsData.zip}
              </p>
              <p className={styles.myorder_detail_container_receiver_info_text}>
                {t("Profile.my.order.detail.cellphone")}
                {goodsData.phone}
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
        {goodsData.order_type !== "actual" ? (
          <div className={styles.myorder_detail_container_submit}>
            {goodsData.gift_status === "1" ? (
              <div
                className={cx(styles.myorder_detail_container_submit_btn, {
                  [styles.disable]: goodsData.gift_status === "1",
                })}
              >
                <span
                  className={styles.myorder_detail_container_submit_btn_text}
                >
                  {t("Profile.my.order.detail.donate")}
                  {goodsData.to_username}
                </span>
              </div>
            ) : (
              <LinkComponent
                className={styles.myorder_detail_container_submit_btn}
                routes={
                  goodsData.order_type === "dianka"
                    ? pageUrlConstants.profile.pages.profileBuyVip.pages
                        .profileBuyVipCommon
                    : {
                        linkurl: goodsData.url,
                      }
                }
              >
                <span
                  className={styles.myorder_detail_container_submit_btn_text}
                >
                  {t("Profile.my.order.detail.go.now")}
                  
                </span>
              </LinkComponent>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </ProfileMyorderDetailElement>
  );
};

export default ProfileMyorderDetail;

export const ProfileMyorderDetailElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
        /*  */
        display: flex;
        flex-direction: column;
        padding-top: ${main_height}px;

        /*  */
        box-sizing: border-box;
        min-height: 100vh;
        min-height: calc(var(--vh, 1vh) * 100);
    `}
`;
