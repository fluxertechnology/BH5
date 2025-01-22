import styled from "styled-components";

import { backRoutes, pushRoutes } from "@/store/actions/historyActions";

import { colors, padding, pageUrlConstants } from "@/lib/constants";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import HomeIcon from '@mui/icons-material/Home';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faStar as fillStart,
} from "@fortawesome/free-solid-svg-icons";

import { faStar } from "@fortawesome/free-regular-svg-icons";

import { useGlobalDispatch, useGlobalContext } from "@/store";

const TopTitleBar = ({
  title = "",
  iconState,
  iconCallback,
  showBack,
  backIndex,
  show_back_color = "#000",
  color = "#fff",
  back_color = colors.dark_pink,
  to_absolute = false,
  children,
  onChildrenClick,
  textAlign = "center",
  not_clear_history = false,
  show_border_bottom = false,
}) => {
  const { state } = useGlobalContext();

  const { home } = pageUrlConstants;

  const backEvent = (backIndex, not_clear_history) => {
    if (backIndex) {
      useGlobalDispatch(
        pushRoutes({
          name: pageUrlConstants.home.pages.homeMain.pages.homeVideos.name,
          path: pageUrlConstants.home.pages.homeMain.pages.homeVideos.path,
        })
      );
    } else {
      useGlobalDispatch(backRoutes(-1, not_clear_history));
    }
  };

  return (
    <TopTitleBarElement
      color={color}
      back_color={back_color}
      title={title}
      show_back_color={show_back_color}
      to_absolute={to_absolute}
      text_align={textAlign}
      show_border_bottom={show_border_bottom}
      main_height={state.navbar.mainHeight}
    >
      <div className="container">
        {showBack ? (
          <div>
            <div
              className="container_back"
              onClick={() => {
                backEvent(backIndex, not_clear_history);
              }}
              style={{
                color: show_back_color,
              }}
            >
              <KeyboardBackspaceIcon
                className="container_back_icon"
                icon={faAngleLeft}
              />
            </div>
            <HomeIcon
              className="container_back_icon ml-4"
              onClick={() =>
                useGlobalDispatch(
                  pushRoutes(
                    home.pages.homeMain
                  )
                )}
              style={{ cursor: 'pointer', color: show_back_color }}
            />
          </div>
        ) : (
          ""
        )}

        {title ? (
          <h1 className="container_title container_title_text">
            {title}
          </h1>
        ) : (
          ""
        )}
        {children ? (
          <div className="container_custom" onClick={onChildrenClick}>
            {children}
          </div>
        ) : iconCallback ? (
          <div className="container_icon">
            <FontAwesomeIcon
              className={"container_icon_img " + (iconState ? "light" : "")}
              icon={iconState ? fillStart : faStar}
              onClick={iconCallback}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </TopTitleBarElement>
  );
};

export default TopTitleBar;

export const TopTitleBarElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "color",
      "back_color",
      "show_back_color",
      "title",
      "show_border_bottom",
      "to_absolute",
      "textAlign",
      "main_height",
    ].includes(prop),
})`
  /*  */
  position: ${({ to_absolute }) => (to_absolute ? "absolute" : "unset")};
  z-index: 1;
  height: ${({ main_height }) => main_height}px;
  color: ${({ color }) => color};
  background-color: ${({ back_color }) => back_color};
  padding: 0 5px;
  ${({ show_border_bottom }) =>
    show_border_bottom ? " border-bottom: 1px solid #a8a8a8;" : ""}

  .container {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    &_back,
    &_icon,
    &_custom {
      margin-right: 0.5em;
      cursor: pointer;
      position: absolute;
    }

    &_back {
      background-color: ${({ show_back_color }) =>
    show_back_color === "#fff" ? "#0007" : "transparent"};
      border-radius: 50%;

      &_icon {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
    }

    &_title {
      width: 100%;
      flex-grow: 0.1;
      padding: 0 ${padding}px;
      @media (min-width: 899px) {
        padding: 0 10px;
      }

      &_text {
        overflow: hidden;
        font-size: ${({ title }) => (title.length < 10 ? 20 : 18)}px;
        // max-height: ${({ title }) => (title.length < 10 ? 20 : 16)}px;

        word-break: break-all;
        text-align: ${({ text_align }) => text_align};
        letter-spacing: 1px;
        font-weight: 700;
        padding: 1% 5%;
        @media (min-width: 899px) {
          padding: 0;
          font-size: 18px;
        }
      }
    }

    &_icon,
    &_custom {
      right: 0;

      &_img {
        width: 30px;
        height: 30px;
        vertical-align: middle;

        &.light {
          color: ${colors.light_star};
        }
      }
    }
  }
`;
