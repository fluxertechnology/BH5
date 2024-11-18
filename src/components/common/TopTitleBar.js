import styled from "styled-components";

import { backRoutes, pushRoutes } from "@/store/actions/historyActions";

import { main_height } from "@/components/layout/Header/TopBarContainer";
import { colors, padding, pageUrlConstants } from "@/lib/constants";

import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faStar as fillStart,
} from "@fortawesome/free-solid-svg-icons";

import { faStar } from "@fortawesome/free-regular-svg-icons";

const TopTitleBar = ({
  title = "",
  iconState,
  iconCallback,
  showBack,
  backIndex,
  show_back_color = "#000",
  backEvent,
  color = "#fff",
  back_color = colors.dark_pink,
  to_absolute = false,
  children,
  onChildrenClick,
  textAlign = "center",
  not_clear_history = false,
  show_border_bottom = false,
}) => {
  return (
    <TopTitleBarElement
      color={color}
      back_color={back_color}
      title={title}
      show_back_color={show_back_color}
      to_absolute={to_absolute}
      textAlign={textAlign}
      show_border_bottom={show_border_bottom}
    >
      <div className="container">
        {showBack ? (
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
        ) : (
          ""
        )}

        {title ? (
          <h2 className="container_title">
            <p className="container_title_text">{title}</p>
          </h2>
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

const TopTitleBarStateToProps = (state, ownProps) => {
  return {
    title: ownProps.title,
    iconState: ownProps.iconState,
    iconCallback: ownProps.iconCallback,
    showBack: ownProps.showBack,
    color: ownProps.color,
    back_color: ownProps.back_color,
    show_back_color: ownProps.show_back_color,
    children: ownProps.children,
    backIndex: ownProps.backIndex,
  };
};

const TopTitleBarDispatchToProps = (dispatch) => {
  return {
    backEvent: (backIndex, not_clear_history) => {
      console.log(backIndex, not_clear_history);
      if (backIndex) {
        dispatch(
          pushRoutes({
            name: pageUrlConstants.home.pages.homeMain.pages.homeVideos.name,
            path: pageUrlConstants.home.pages.homeMain.pages.homeVideos.path,
          })
        );
      } else {
        dispatch(backRoutes(-1, not_clear_history));
      }
    },
  };
};

TopTitleBar.propTypes = {
  title: PropTypes.string,
  // iconState: PropTypes.number,
  iconCallback: PropTypes.func,
  showBack: PropTypes.bool,
};

export default compose(
  connect(TopTitleBarStateToProps, TopTitleBarDispatchToProps)(TopTitleBar)
);

export const TopTitleBarElement = styled.div`
  /*  */
  position: ${({ to_absolute }) => (to_absolute ? "absolute" : "unset")};
  z-index: 1;
  height: ${main_height}px;
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
        text-align: ${({ textAlign }) => textAlign};
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
