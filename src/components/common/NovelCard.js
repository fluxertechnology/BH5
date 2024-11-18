import styled from "styled-components";

import heartIcon from "@public/images/icons/heart.svg";
import { checkinPageConditioncheckAction } from "@/store/actions/utilities";
import ImageComponent from "@/components/common/ImageComponent";
import errorImg from "@public/images/imgPlaceholder/fail404.jpg";
import { colors } from "@/lib/constants";
const NovelCard = ({ data, total_view_show }) => {
  const toNovelPage = (data) => {
    dispatch(
      checkinPageConditioncheckAction({
        itemId: data.id,
        itemType: 0,
        needGold: data.need_jinbi,
      })
    );
  };

  function clickNovelCard() {
    toNovelPage(data);
  }

  return (
    <NovelCardElement onClick={clickNovelCard}>
      <div className="card">
        <div className="card_img">
          <ImageComponent
            is_cover={true}
            src={data.img || errorImg}
            alt={data.title}
            title={data.title}
            height={100}
            border_radius={0}
            total_view={data.fake_total_view}
            total_view_show={total_view_show}
          />
        </div>
        <div className="card_header">
          <h6 className="card_header_title">{data.title}</h6>
        </div>
        <div className="card_body">
          <div
            className="card_body_content"
            dangerouslySetInnerHTML={{
              __html: data.miaoshu,
            }}
          />
        </div>
        <div className="card_heart">
          <img className="card_heart_img" src={heartIcon} alt="heart" />
          {data.need_jinbi}金币
        </div>
      </div>
    </NovelCardElement>
  );
};

export default NovelCard;

export const NovelCardElement = styled.div`
  /*  */
  &:hover {
    color: ${colors.back_dark_pink};
    box-shadow: 0 0 7px 0 rgba(250, 113, 154, 0.84);
    border-radius: 5%;
  }
  box-sizing: border-box;

  .card {
    cursor: pointer;
    border: 1px solid rgb(0 0 0 / 20%);
    border-radius: 10px;
    overflow: hidden;

    &_img {
      width: 100%;
      vertical-align: middle;
    }

    &_header {
      padding: 5px;
      &_title {
        overflow: hidden;
        font-size: 16px;
        font-weight: 600;
        height: ${2.5 * 17}px;
      }
    }

    &_heart {
      padding: 5px;
      margin-top: 5px;
      font-size: 14px;
      color: #fa719a;

      &_img {
        margin-right: 5px;
        width: 16px;
        height: 16px;
        vertical-align: bottom;
      }
    }

    &_body {
      padding: 5px;
      overflow: hidden;
      height: 35px;
      font-size: 16px;
      // line-height: 20px;

      &_content {
        text-align: justify;
        text-justify: inter-ideograph;
        max-height: ${2.5 * 17}px;
        font-size: 16px;
        overflow: hidden;
        word-break: break-all;
        @media (max-width: 599px) {
          max-height: ${2.5 * 15}px;
          font-size: 14px;
        }
      }
    }
  }
`;
