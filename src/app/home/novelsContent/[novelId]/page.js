"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { padding } from "@/lib/constants";
import { navigatorShare } from "@/store/actions/utilities";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useParams } from "next/navigation";

import { toggleCollectAction } from "@/store/actions/toggleCollect";
import { checkinPageConditioncheckAction } from "@/store/actions/utilities";

const HomeNovelsContent = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  const novelId = useParams().novelId;
  const novelData = useMemo(() => {
    return state.homeNovelsContentData[novelId]
      ? state.homeNovelsContentData[novelId]
      : {};
  }, [state.homeNovelsContentData]);

  const [font_size, setFontSize] = useState(
    (typeof window !== undefined &&
      window.localStorage.getItem("novelsFontSize")) ||
    16
  );

  const [share_ma] = useState(state.user.share_ma);
  const [rangeShow, setRangeShow] = useState(true);

  useEffect(() => {
    if (novelId) {
      if (!novelData.miaoshu) {
        // getNovelContent(novelId, (data)=>{
        checkUser({
          id: novelId,
        });
        // });
      }
    }
  }, [novelId]);

  function clickCollectEven() {
    clickCollect({
      id: novelData.id,
      status: novelData.is_collect == 0 ? 1 : 0,
    });
  }
  function shareUrl() {
    navigatorShare({
      title: novelData.title,
      text:
        "B次元真的超好看！看看我在上面发现的" +
        novelData.title +
        "\n\n立刻免费成为B次元的小伙伴" +
        (share_ma ? "，输入我的邀请码" + share_ma : "") +
        "\n",
      url: window.location.href,
    });
  }

  const checkUser = (data) => {
    useGlobalDispatch(
      checkinPageConditioncheckAction({
        itemId: data.id,
        itemType: 0,
        checkOnPage: true,
      })
    );
  };

  const clickCollect = (data) => {
    useGlobalDispatch(
      toggleCollectAction({
        id: data.id,
        type: 0,
        status: data.status,
      })
    );
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (<TopBarContainer>
          <TopTitleBar
            title={novelData.title}
            showBack={true}
            show_back_color="#ffffff"
            iconCallback={clickCollectEven}
            iconState={novelData.is_collect}
          />
        </TopBarContainer>),
      },
    });
  }, []);
  return (
    <HomeNovelsContentElement main_height={state.navbar.mainHeight} sub_height={state.navbar.subHeight} >

      <div className="share" onClick={shareUrl}>
        <div className="share_label">
          <FontAwesomeIcon
            className="footer_content_box_btn_wava_icon"
            icon={faShareAlt}
          />
          &nbsp;
          {t("Global.action.share")}
        </div>
      </div>
      <div className={"text_size " + (rangeShow ? "show" : "")}>
        <p
          className="text_size_label"
          onClick={() => {
            setRangeShow(!rangeShow);
          }}
        >
          {t("Global.setting")}
        </p>
        <div className="text_size_range">
          <input
            className="text_size_range_input"
            type="range"
            min="12"
            max="60"
            step="1"
            value={font_size}
            onChange={(e) => {
              setFontSize(e.target.value);
              window.localStorage.setItem("novelsFontSize", e.target.value);
            }}
          />
        </div>
      </div>
      <div
        className="content fw-m"
        dangerouslySetInnerHTML={{
          __html: novelData.miaoshu,
        }}
        style={{
          fontSize: font_size + "px",
        }}
      />
    </HomeNovelsContentElement>
  );
};

export default HomeNovelsContent;

const HomeNovelsContentElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height", "sub_height"].includes(prop),
})`
  ${({ main_height, sub_height }) => `

    /*  */
    @media (min-width: 599px) {
        padding: ${main_height + sub_height}px ${padding}px 0;
    }
    .share {
        position: fixed;
        bottom: 51px;
        display: flex;
        right: 0;
        align-items: center;
        padding: 8px;
        font-size: 16px;
        color: #fff;
        background-color: #000;
        opacity: 80%;
        transition: 0.1s;

        &_label {
        cursor: pointer;
        transition: 0.1s;
        }
    }
    .text_size {
        position: fixed;
        bottom: 50px;
        display: flex;
        align-items: center;
        padding: 5px;
        font-size: 16px;
        color: #fff;
        background-color: #000;
        opacity: 80%;
        transition: 0.1s;

        &_label {
        cursor: pointer;
        transition: 0.1s;
        }

        &_range {
        overflow: hidden;
        width: 0;
        transition: 0.1s;

        &_input {
            width: 100%;
        }
        }

        &.show {
        opacity: 70%;
        height: 30px;
        .text_size_label {
            color: #39b3fd;
        }

        .text_size_range {
            width: 300px;
            @media (max-width: 599px) {
            width: 150px;
            }
        }
        }
    }
    .content {
        letter-spacing: 1px;
        border-style: solid;
        border-color: gray;
        border-width: 1px;
        @media (min-width: 599px) {
        margin: 0 15%;
        }
        .p {
        margin-top: 1.2em;
        font-weight: 600;
        line-height: 1.2em;
        }
    }`}
`;
