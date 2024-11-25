"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { ReadNotice } from "@/store/actions/noticeListRead";
import { useParams } from "next/navigation";

const NoticeContentPage = () => {

  const noticeId = parseInt(useParams().id);

  const { state, dispatch } = useGlobalContext();
  let data = "";
  for(let i = 0 ; i < state.noticeList.length ; i++) {
    
    if(state.noticeList[i].id === noticeId) {
      data = state.noticeList[i];
      break;
    }else{
    }
  }

  const title = data.title || "";
  const content = data.miaoshu;

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
              <TopTitleBar
                title={title}
                showBack={true}
                show_back_color="#ffffff"
              />
            </TopBarContainer>
          </>
        ),
      },
    });
  }, [title]);

  const readNotice = () => {
    useGlobalDispatch(ReadNotice(noticeId));
  };

  useEffect(()=>{
    readNotice(noticeId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <NoticeContentPageElement>
      <div 
        className="content px-indent15"
        dangerouslySetInnerHTML={{
          __html: content
        }}
      />
    </NoticeContentPageElement>
  )
}

export default NoticeContentPage;

const NoticeContentPageElement = styled.div`/*  */
padding: 2px;
padding-top: ${main_height + 2}px;

.px-indent15{
  padding-left:15%;
  padding-right:15%;
}
.content {
  p {
    margin-top: 18px;
    font-size: 22px;
    font-weight: 900;
  }

  a {
    text-decoration: underline;
    color: #00f;
  }

  img {
    width: 100%;
    height: auto;
    vertical-align: middle;
  }
}
`;