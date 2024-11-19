import { useTranslations } from "next-intl";
import searchIcon from "@public/images/topbar/search.svg";
import searchGrayIcon from "@public/images/topbar/search_gray.svg";
import { colors } from "@/lib/constants";
import styled from "styled-components";

const Searchbar = ({
  value = "",
  isPlaceholder,
  scroll,
  callback,
  inputOnChange = () => {},
  inputKeyDown = () => {},
}) => {
  const t = useTranslations();
  return (
    <SearchbarElement onClick={callback} scroll={scroll}>
      <div className={"search " + (isPlaceholder ? "placeholder" : "")}>
        <div className="search_content">
          {isPlaceholder ? (
            <div className="search_content_placeholder">
              {t("Search.you_want")}
            </div>
          ) : (
            <input
              type="text"
              className="search_content_input"
              placeholder="搜寻你想要的..."
              enterKeyHint="search"
              value={value}
              onChange={inputOnChange}
              onKeyDown={inputKeyDown}
            />
          )}
        </div>
        <div className="search_icon">
          <img
            src={scroll ? searchGrayIcon : searchIcon}
            className="search_icon_img"
            alt=""
          />
        </div>
      </div>
    </SearchbarElement>
  );
};

export default Searchbar;

export const SearchbarElement = styled.div`
  /*  */
  .search {
    padding: 5px;
    display: flex;
    align-items: middle;
    background-color: #fff;
    border-radius: 30px;
    @media (min-width: 899px) {
      padding: 0;
      min-width: 200px;
    }

    &_icon {
      display: flex;
      align-items: center;
      margin-right: 10px;
      vertical-align: middle;
      color: #aaa;

      &_img {
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
    }

    &_content {
      width: 100%;
      font-size: 12px;
      margin-left: 10px;
      &_input {
        width: 100%;
        background-color: transparent;
        border: none;
        outline: none;
      }
    }

    &.placeholder {
      background-color: #00000036;
      font-weight: 600;
      .search {
        &_icon {
          color: #fffa;
        }

        &_content {
          display: flex;
          align-items: center;

          &_placeholder {
            color: ${({ scroll }) =>
              scroll ? colors.text_light_grey : "#fffa"};
          }
        }
      }
    }
  }

  @media (min-width: 599px) {
    .search_icon_img {
      height: 30px;
      width: 20px;
    }

    .search_content {
      font-size: 18px;
    }

    .search_content_input {
      font-size: 18px;
      height: 30px;
      font-weight: 600;
    }
  }
`;
