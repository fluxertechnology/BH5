"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import styled from "styled-components";
import BundleFoldrComponent, {
  BundleFoldrComponentElement,
} from "@/components/profile/bundle/BundleFoldrComponent";
import { colors, requestUrlConstants } from "@/lib/constants";
import { main_height, sub_height } from "@/components/layout/Header/TopBarContainer";
import BundleCouponComponent from "@/components/profile/bundle/BundleCouponComponent";
import axiosRequest from "@/lib/services/axios";
import store, { useGlobalContext } from "@/store";

const { postGetCouponListUrl, postGetUsedCouponListUrl } = requestUrlConstants;

const ProfileBundleCoupon = () => {
  const t = useTranslations();
  const { state } = useGlobalContext();
  const user = state.user;

  let [couponList, setCouponList] = useState([]);

  let [usedCouponList, setUsedCouponList] = useState([]);

  let [expireCouponList, setExpireCouponList] = useState([]);

  useEffect(() => {
    let formData = new FormData();

    formData.append("page", 1);
    formData.append("limit", 99);
    formData.append("category_id", 0);
    formData.append("is_expire", 0);
    formData.append("uid", user.id);

    axiosRequest.post(postGetCouponListUrl, formData).then((data) => {
      setCouponList(data);
    });

    let usedData = new FormData();
    usedData.append("uid", store.getState().user.id);
    usedData.append("page", 1);
    usedData.append("limit", 99);

    axiosRequest.post(postGetUsedCouponListUrl, usedData).then((data) => {
      setUsedCouponList(data);
    });

    let expireData = new FormData();
    expireData.append("page", 1);
    expireData.append("limit", 99);
    expireData.append("is_expire", 1);
    expireData.append("uid", user.id);

    axiosRequest.post(postGetCouponListUrl, expireData).then((data) => {
      setExpireCouponList(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProfileBundleCouponElement>
      <BundleFoldrComponent
        title={t("Profile.build.effect.unuse")}
      >
        {couponList.map((data) => {
          if (data.count - (data.use_count || 0) <= 0) {
            return "";
          }

          return (
            <BundleCouponComponent
              key={data.id}
              title={data.title}
              start_date={data.start_date}
              end_date={data.end_date}
              discount_type={data.discount_type}
              discount_amount={data.discount_amount}
              discount_unit={data.discount_unit}
              count={data.count - (data.use_count || 0)}
              show_count={true}
            />
          );
        })}
      </BundleFoldrComponent>
      <BundleFoldrComponent
        title={t("Profile.build.effect.used")}
      >
        {usedCouponList.map((data) => {
          return (
            <BundleCouponComponent
              key={data.id}
              title={data.title}
              start_date={data.start_date}
              end_date={data.end_date}
              discount_type={data.discount_type}
              discount_amount={data.discount_amount}
              discount_unit={data.discount_unit}
              count={data.count - (data.use_count || 0)}
              expire={true}
            />
          );
        })}
      </BundleFoldrComponent>
      <BundleFoldrComponent
        title={t("Profile.build.effect.uneffect")}
      >
        {expireCouponList.map((data) => {
          return (
            <BundleCouponComponent
              key={data.id}
              title={data.title}
              start_date={data.start_date}
              end_date={data.end_date}
              discount_type={data.discount_type}
              discount_amount={data.discount_amount}
              discount_unit={data.discount_unit}
              count={data.count - (data.use_count || 0)}
              expire={true}
            />
          );
        })}
      </BundleFoldrComponent>
    </ProfileBundleCouponElement>
  );
};

export default ProfileBundleCoupon;

export const ProfileBundleCouponElement = styled.div`
  /*  */
  padding: 0.1px 0;
  box-sizing: border-box;
  min-height: calc(var(--vh, 1vh) * 100 - ${main_height + sub_height}px);
  background-color: ${colors.back_grey};

  ${BundleFoldrComponentElement} {
    margin-top: 10px;
  }
`;
