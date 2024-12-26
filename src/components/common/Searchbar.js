import { useTranslations } from "next-intl";
import searchIcon from "@public/images/topbar/search.svg";
import searchGrayIcon from "@public/images/topbar/search_gray.svg";
import SearchIcon from '@mui/icons-material/Search';
import { colors } from "@/lib/constants";
import styled from "styled-components";
import Image from "next/image";

const Searchbar = ({
  value = "",
  isPlaceholder,
  scroll,
  callback,
  inputOnChange = () => { },
  inputKeyDown = () => { },
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
          <SearchIcon className="search_icon_img text-[#000000]"/>
        </div>
      </div>
    </SearchbarElement>
  );
};

export default Searchbar;

export const SearchbarElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["scroll"].includes(prop),
})`
  /*  */
  .search {
    padding: 5px;
    display: flex;
    align-items: middle;
    background-color: #fff;
    border-radius: 0.365vw;
    @media (min-width: 1024px) {
      padding: 0;
      min-width: 160px;
    }

    &_icon {
      display: flex;
      align-items: center;
      margin-right: 10px;
      vertical-align: middle;
      color: #fff;

      &_img {
        width: 11px;
        height: 11px;
        object-fit:contain;
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
      background-color: #e8e8e8;
      font-weight: 600;
      .search {
        &_icon {
          color: #fffa;
        }

        &_content {
          display: flex;
          align-items: center;

          &_placeholder {
            font-size: max(10px,0.586vw);
            color: ${({ scroll }) =>
              scroll ? '#969696' : "#969696"};
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
