import { createContext } from "react";
import styled from "styled-components";
import { colors } from "@/lib/constants";
import { Links } from "@/components/common/CoverCubeItem";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ranks } from "@/components/games/GameRender";
import ImageComponent from "@/components/common/ImageComponent";

const comicRankingProps = createContext("");
const Provider = comicRankingProps.Provider;
const ComicRankingItem = ({ list }) => {
  const { isMobile } = useMediaQuery();
  return (
    <>
      {isMobile ? (
        <section
          style={{
            display: "grid",
            gridAutoColumns: "100%",
            gridAutoFlow: "column dense",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: "10px",
            width: "85%",
          }}
        >
          {list.map((item, index) => {
            const { title, description, type, img } = item;
            if (index <= 11) {
              return (
                <ComicRankingElement index={index + 1} key={`${title}-${index}`}>
                  <Provider value={{ data: item, type }}>
                    <Links contextProps={comicRankingProps}>
                      <section className="comic_ranking_h5">
                        <img
                          className="comic_ranking_h5_badge"
                          src={ranks[index]}
                          alt={`badge${index}`}
                        />
                        <div className="comic_ranking_h5_img">
                          <ImageComponent
                            src={img}
                            alt={title}
                            title={title}
                            border_radius={"10px"}
                            background_color="#fff"
                            height={100}
                            toFixSize={true}
                          />
                        </div>
                        <div className="comic_ranking_h5_description">
                          <div className="comic_ranking_h5_description_title">
                            {title}
                          </div>
                          <div className="comic_ranking_h5_description_text">
                            {description}
                          </div>
                        </div>
                      </section>
                    </Links>
                  </Provider>
                </ComicRankingElement>
              );
            }
          })}
        </section>
      ) : (
        <>
          {list.map((item, index) => {
            const { title, description, type, img } = item;
            if (index <= 11) {
              return (
                <ComicRankingElement index={index + 1} key={index}>
                  <Provider value={{ data: item, type }}>
                    <Links contextProps={comicRankingProps}>
                      <section className="comic_ranking_number">
                        {index + 1}
                      </section>
                      <section className="g-flex-column-start">
                        <span className="comic_ranking_title">{title}</span>
                        <span className="comic_ranking_description">
                          {description}
                        </span>
                      </section>
                    </Links>
                  </Provider>
                </ComicRankingElement>
              );
            }
          })}
        </>
      )}
    </>
  );
};

export default ComicRankingItem;
const ComicRankingElement = styled.div`
  /*  */
  width: 100%;
  &:hover {
    .comic_ranking_title,
    .comic_ranking_description {
      color: ${colors.back_dark_pink}!important;
    }
  }
  &:hover {
    .comic_raking {
      &_number,
      &_title,
      &_description {
        color: ${colors.back_dark_pink}!important;
      }
    }
  }
  .item {
    text-decoration: none;
    color: #000;
    display: flex;
    gap: 0.5rem;
  }

  .comic_ranking {
    &_h5 {
      display: flex;
      justify-content: start;
      align-items: center;
      width: 100%;
      gap: 0.5rem;
      &_badge {
        flex: 0 0 10%;
        max-width: 30px;
      }
      &_img {
        flex: 0 0 30%;
      }
      &_description {
        flex: 0 0 50%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        &_title {
          font-size: 14px;
          overflow: hidden;
          height: ${14 * 1.4}px;
          color: #010001;
        }
        &_text {
          font-size: 12px;
          color: ${colors.text_light_grey};
        }
      }
    }
    &_number {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25px;
      height: 25px;
      min-width: 25px;
      font-weight: 600;
      color: ${({ index }) => (index <= 3 ? "#fff" : "#000")};
      background: ${({ index }) =>
        index <= 3 ? colors.back_dark_pink : colors.text_light_grey};
    }
    &_title {
      font-size: 16px;
      overflow: hidden;
      height: ${16 * 1.5}px;
      color: #010001;
    }
    &_description {
      font-size: 14px;
      overflow: hidden;
      height: ${14 * 1.5}px;
      color: ${colors.text_light_grey};
    }
  }
`;
