import { useTranslations } from "next-intl";
import styled from "styled-components";

// import LinkComponent from "../../component/LinkComponent";
// import { colors, downloadBackUrl, downloadPageUrl } from "../../../constants";
import { colors } from "@/lib/constants";
import callToast from "@/lib/services/toastCall";
import {
  // handleApkClick,
  handleSkipApkClick,
} from "@/lib/services/gtmEventHandle";
import Image from "next/image";
// import { handleSkipApkClick } from "../../../modules/gtmEventHandle";

const start_cover = "/images/start/start_cover.jpg";

const DownloadCover = ({ closeAds }) => {
  const t = useTranslations();
  function copyTelegramId() {
    try {
      navigator.clipboard.writeText("j80640");
      callToast(t("Toast.success_copy"));
    } catch (err) {
      alert(t("Toast.unsuccess_not_support"));
    }
  }

  return (
    <DownloadCoverElement>
      <div className="container">
        <div className="container_cover">
          <Image
            className="container_cover_img"
            src="/images/start/start_role.png"
            width={0}
            height={0}
            alt="blili"
          />
        </div>
        <div className="container_box">
          <div className="container_box_item">
            <div
              className="container_box_item_btn"
              onClick={() => {
                handleSkipApkClick();
                closeAds();
              }}
            >
              {t("Download.watch.now")}
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <p className="footer_content">{t("Download.label.description_1")}</p>
        <div className="footer_btn" onClick={copyTelegramId}>
          <span className="footer_btn_text">
            {t("Download.action.click.copy")}
          </span>
        </div>
      </div>
    </DownloadCoverElement>
  );
};

export default DownloadCover;

const DownloadCoverElement = styled.div`
  /*  */
  height: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-position: center;
  background-size: cover;

  background-image: url(${start_cover});

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    &_cover {
      width: 60%;
      text-align: center;
      &_img {
        width: 100%;
        @media (min-width: 599px) {
          width: 40%;
        }
      }
    }

    &_box {
      display: flex;
      justify-content: space-evenly;
      margin-top: 20px;
      width: 100%;

      &_item {
        display: flex;
        flex-direction: column;

        &_btn {
          cursor: pointer;
          padding: 15px 0;
          width: 150px;
          font-size: 20px;
          text-align: center;
          text-decoration: none;
          color: #fff;
          background-image: linear-gradient(to right, #fe8990 0, #ff647c 100%);
          border-radius: 100px;
          font-weight: 900;

          &.white {
            text-decoration: underline;
            color: #fe8990;
            background-image: unset;
          }
        }
      }
    }
  }

  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 8px;
    background-image: linear-gradient(to right, #fe8990 0, #ff647c 100%);

    &_content {
      font-size: 14px;
      color: #fff;
    }

    &_btn {
      cursor: pointer;
      padding: 6px 12px;
      background-color: #fff;
      border-radius: 30px;

      &_text {
        font-weight: 900;
        color: ${colors.dark_pink};
      }
    }
  }
`;

export { DownloadCoverElement };
