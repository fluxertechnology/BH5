import * as React from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import placeholder_300x300 from "@public/images/imgPlaceholder/300x300.jpg";
import { colors } from "@/lib/constants";
import { moneyAndGold } from "@/components/vendor/VendorItemCard";
import useMediaQuery from "@/hooks/useMediaQuery";
import ImageComponent from "@/components/common/ImageComponent";
import { useTranslations } from "next-intl";

const areEqual = (pre, next) => {
  return JSON.stringify(pre) === JSON.stringify(next);
};
function ImgMediaCard(props) {
  const { isMobile } = useMediaQuery();
  const [fixHeight, setFixHeight] = React.useState(null);
  const {
    data,
    className,
    horizontal,
    goldFrame = false,
    disabledPrice,
  } = props;

  // function judeFontLength(data) {
  //   if (data.length >= 15) return data.substr(0, 15) + "...";
  //   return data;
  // }
  const t = useTranslations();
  return (
    <CardElement
      goldFrame={goldFrame}
      className={className + " cursor"}
      onClick={() => data.name && window.open(data.url)}
    >
      <Card className="box_effect">
        {horizontal ? (
          <CardMedia
            component="img"
            alt={data.title}
            onLoad={(e) => {
              let img = document.createElement("img");
              img.src = e.target.src;
              img.addEventListener("load", function () {
                setFixHeight(img.height / 2);
                img.remove();
              });
            }}
            onError={(e) => {
              e.target.src = placeholder_300x300;
            }}
            image={data.img || data.picurl}
          />
        ) : (
          <ImageComponent
            cover
            src={data.img || data.picurl}
            alt={data.title}
            title={data.title}
            border_radius={0}
            background_color="#fff"
            height={100}
            is_cover={true}
            // toFixSize={true}
          />
        )}

        <CardContent
          className="content p-1"
          style={{
            height: horizontal ? 30 : isMobile ? 60 : disabledPrice ? 40 : 75,
          }}
        >
          <Typography gutterBottom component="div" className="content_main ">
            <div className="fw-xl card_title">{data.name || data.title}</div>
          </Typography>
          {data.title && !disabledPrice ? (
            <div className="content_tip">
              {moneyAndGold(data.mone, data.yue, t)}
            </div>
          ) : (
            ""
          )}
        </CardContent>
      </Card>
    </CardElement>
  );
}
export default React.memo(ImgMediaCard, areEqual);
export const CardElement = styled.div`
  /*  */
  .box_effect {
    &:hover {
      color: ${colors.back_dark_pink};
      box-shadow: 0 0 7px 0 rgba(250, 113, 154, 0.84);
      border-radius: 5%;
    }
    box-shadow: 0 0 2px black;
    border-radius: 10px;
    &::before {
      visibility: ${({ goldFrame }) => (goldFrame ? "init" : "hidden")};
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 2px solid gold;
      animation: clippath 3s infinite linear;
      border-radius: 10px;
      @keyframes clippath {
        0%,
        100% {
          clip-path: inset(0 0 95% 0);
        }
        25% {
          clip-path: inset(0 95% 0 0);
        }
        50% {
          clip-path: inset(95% 0 0 0);
        }
        75% {
          clip-path: inset(0 0 0 95%);
        }
      }
    }
  }

  .content {
    position: relative;
    &_main {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      font-size: 12px;
    }

    &_tip {
      width: 100%;
      position: absolute;
      bottom: 5px;
      color: ${colors.dark_pink};
      white-space: nowrap;

      @media (max-width: 599px) {
        font-size: 12px;
      }
    }
  }

  .card {
    &_title {
      overflow: hidden;
      max-height: ${2.5 * 18}px;
      font-size: 16px;
      font-weight: 900;
      word-break: break-all;
      @media (max-width: 899px) {
        font-size: 14px;
        height: ${2.5 * 16}px;
      }
    }
  }
`;
