import styled from "styled-components";
import LinkComponent from "@/components/common/LinkComponent";
import ImageComponent from "@/components/common/ImageComponent";
import { pageUrlConstants } from "@/lib/constants";
import { useTranslations } from "next-intl";

const ParallelCoverCubeItem = ({
  data,
  isVideo,
  disabledBottomBorder = false,
}) => {
  const t = useTranslations;
  const { id, img, title, description, process, total_episode, create_time } =
    data;
  return (
    <ParallelCoverCubeIElement
      isVideo={isVideo}
      disabledBottomBorder={disabledBottomBorder}
    >
      <LinkComponent
        className="list_item fw-l"
        routes={
          isVideo
            ? {
                name:
                  pageUrlConstants.home.pages.homeAnimesSwitch.pages
                    .homeAnimesContent.name +
                  title +
                  "-1",
                path: pageUrlConstants.home.pages.homeAnimesSwitch.pages
                  .homeAnimesContent.path,
                dynamic: {
                  animeId: id,
                  animeEp: 1,
                },
              }
            : {
                name:
                  pageUrlConstants.home.pages.homeComicList.pages
                    .homeComicListSwitch.pages.homeComicListContent.name +
                  title,
                path: pageUrlConstants.home.pages.homeComicList.pages
                  .homeComicListSwitch.pages.homeComicListContent.path,
                dynamic: {
                  comicId: id,
                },
              }
        }
      >
        <div className="list_item_cover mr-2">
          <ImageComponent
            src={img}
            alt={title}
            title={title}
            height={isVideo ? 65 : 145}
            is_cover={true}
          />
        </div>
        <div className="list_item_container">
          <div className="list_item_container_title">
            <p className="list_item_container_title_text">{title}</p>
          </div>
          {description ? (
            <div className="list_item_container_description">
              <p className="list_item_container_description_text">
                {description}
              </p>
            </div>
          ) : (
            ""
          )}
          <div className="list_item_container_number">
            <p className="list_item_container_number_text">
              {process ? t("Global.update_to") : t("Global.total")}
              {total_episode || 0}
              {t("Global.word")}
            </p>
          </div>
          <div className="list_item_container_number mt-2">
            <p className="list_item_container_number_text fw-s">
              {create_time}
            </p>
          </div>
        </div>
      </LinkComponent>
    </ParallelCoverCubeIElement>
  );
};

export default ParallelCoverCubeItem;

export const ParallelCoverCubeIElement = styled.div`
  /*  */
  &:hover {
    .list_item {
      background: #f3f4f5 !important;
      transition: 0.5s;
    }
  }
  .list {
    &_item {
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #000;
      padding-bottom: 10px;
      padding-top: ${({ isVideo }) => !isVideo && "10px"};
      border-bottom: ${({ disabledBottomBorder }) =>
        !disabledBottomBorder && "1px solid"};
      &_cover {
        width: 100%;
        flex-shrink: 0;
        max-width: 40%;
        @media (min-width: 599px) {
          max-width: ${({ isVideo }) => (isVideo ? "10em" : "6em")};
          padding: ${({ isVideo }) => (isVideo ? "1%" : "0.5%")};
        }
      }

      &_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 100%;
        margin-left: 10px;

        &_title {
          &_text {
            overflow: hidden;
            white-space: wrap;
            font-weight: 900;
            line-height: 20px;
            margin-bottom: 5px;
            text-align: start;
            font-size: 14px;
            height: ${14 * 2.8}px;
          }
        }

        &_description,
        &_number {
          &_text {
            overflow: hidden;
            color: #646464;
          }
        }
      }
    }
  }
`;
