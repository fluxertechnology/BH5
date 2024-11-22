"use client";

import React, { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import PropTypes from "prop-types";

import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { useGlobalContext, useGlobalDispatch } from "@/store";

import NoticeListCard from "@/components/common/NoticeListCard";
import { pageUrlConstants } from "@/lib/constants";

const { notice } = pageUrlConstants;

const { noticeContent } = notice.pages;

const NoticeListPage = ({  }) => {
  const t = useTranslations();
  const root = useRef(null);

  const { state, dispatch } = useGlobalContext();
  const noticeList = state.noticeList;

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
              <TopTitleBar
                title={t("Profile.main.option.news")}
                showBack={true}
                show_back_color="#ffffff"
              />
            </TopBarContainer>
          </>
        ),
      },
    });
  }, []);

  return (
    <NoticeListPageElement ref={root}>
      <div className="notice_container fw-m">
        {noticeList.map((data) => {
          return (
            <NoticeListCard
              title={data.title}
              isNew={data.isNew}
              root={root}
              key={data.id}
              routes={{
                name: noticeContent.name + data.title,
                path: noticeContent.path,
                dynamic: {
                  noticeId: data.id,
                },
              }}
            />
          );
        })}
      </div>
    </NoticeListPageElement>
  );
};

NoticeListPage.propTypes = {
  // noticeList: PropTypes.array,
};

export default NoticeListPage;

const NoticeListPageElement = styled.div`
  /*  */
  padding-top: ${main_height}px;

  /* .notice_container {
  margin-top: 5px;
} */
`;

export { NoticeListPageElement };
