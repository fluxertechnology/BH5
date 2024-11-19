import React, { useState, useMemo } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import { capsuleUrl, pageUrlConstants } from "@/lib/constants";
import useMediaQuery from "@/hooks/useMediaQuery";
import CloseComponent, {
  CloseComponentElement,
} from "@/components/common/CloseComponent";
import LinkComponent from "@/components/common/LinkComponent";
import { pushRoutes } from "@/store/actions/historyActions";
const { login } = pageUrlConstants;
import { useGlobalContext, useGlobalDispatch } from "@/store";

const DraggableComponent = ({
  slide_height,
  position_style,
  css_in,
  direct_route,
  children,
  type,
  onClick,
}) => {
  const { isMobile } = useMediaQuery();
  const [show, setShow] = useState(true);
  const [drag, setDrag] = useState(false);
  const [mobileDrag, setMobileDrag] = useState(false);
  function onTouchMobile() {
    if (isMobile) {
      mobileDrag
        ? setMobileDrag(false)
        : user.id === "guest"
        ? window.location.assign(pageUrlConstants.login.pages.loginMain.path)
        : window.open(direct_route);
    }
  }

  const { state } = useGlobalContext();
  const user = useMemo(() => state.user, [state.user]);

  function onTouchClick() {
    if (mobileDrag) {
      setMobileDrag(false);
    } else if (user.id == "guest") {
      useGlobalDispatch(pushRoutes(login));
    } else {
      onClick();
    }
  }
  return (
    <DraggableComponentElement
      show={show}
      drag={drag}
      slide_height={slide_height}
      position_style={position_style}
    >
      <CSSTransition
        timeout={200}
        in={css_in}
        classNames="CSSTransition_opacity"
        unmountOnExit
      >
        <Draggable
          onDrag={() => {
            setDrag(true);
            setMobileDrag(true);
          }}
          onStop={() => {
            setDrag(false);
          }}
        >
          <div className="capsule_container">
            <CloseComponent
              callback={() => {
                setShow(false);
              }}
              styleType={0}
            />
            {type === "capsule" ? (
              <div onTouchEndCapture={onTouchMobile}>
                <LinkComponent
                  className="capsule_container_link"
                  routes={
                    user.id === "guest"
                      ? pageUrlConstants.login.pages.loginMain
                      : {
                          linkurl:
                            capsuleUrl +
                            "?id=" +
                            user.id +
                            "&free=" +
                            user.free_gashapon,
                        }
                  }
                >
                  {children}
                </LinkComponent>
              </div>
            ) : (
              <div onTouchEndCapture={onTouchClick} onClick={onTouchClick}>
                {children}
              </div>
            )}
          </div>
        </Draggable>
      </CSSTransition>
    </DraggableComponentElement>
  );
};

const DraggableComponentElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["show","drag"].includes(prop),
})`
  /*  */
  display: ${({ show }) => (!show ? "none" : "auto")};
  .capsule_container {
    position: fixed;
    top: auto;
    left: ${({ position_style }) => position_style.left};
    bottom: ${({ position_style }) => position_style.bottom};
    right: ${({ position_style }) => position_style.right};
    z-index: 10;
    &_link {
      pointer-events: ${({ drag }) => (drag ? "none" : "auto")};
      &_img {
        width: 70px;
      }
    }
    ${CloseComponentElement} {
      position: absolute;
      top: -5px;
      right: 0;
      width: 25px;
      height: 25px;
    }
  }
`;

export default DraggableComponent;
