import styled from "styled-components";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect } from "react";
import { useGlobalContext } from "@/store";

export let main_height = 72;

export let sub_height = 42;

export let sub_fontSize = 20;
/**
 * @description TopBarContainer component
 *
 * @param {*} { children }
 * @return {*}
 */
const TopBarContainer = ({
  not_fixed = null,
  show_shadow = "true",
  children,
  z_index = 10,
  backgroundColor = "transparent",
  ...props
}) => {
  const { isMobile } = useMediaQuery();
  const { state } = useGlobalContext();

  useEffect(() => {
    main_height = !isMobile ? 72 : 50;
    sub_height = !isMobile ? 42 : 38;
    sub_fontSize = !isMobile ? 20 : 16;
  }, [isMobile]);

  return (
    <TopBarContainerElement
      not_fixed={not_fixed === null ? !state.navbar.fixed : not_fixed}
      show_shadow={show_shadow}
      z_index={z_index}
      background_color={backgroundColor}
      {...props}
    >
      {state.navbar.prependComponent && state.navbar.prependComponent()}
      {children}
      {state.navbar.appendComponent && state.navbar.appendComponent()}
    </TopBarContainerElement>
  );
};

TopBarContainer.propTypes = {
  // Define any PropTypes here if necessary
};

export default TopBarContainer;

const TopBarContainerElement = styled.header.withConfig({
  shouldForwardProp: (prop) => !["not_fixed", "show_shadow"].includes(prop),
})`
  /*  */
  background-color: ${({ background_color }) => background_color};
  position: ${({ not_fixed }) => (not_fixed ? "absolute" : "fixed")};
  //top: 0;
  right: 0;
  left: 0;
  z-index: ${({ z_index }) => z_index};
  width: 100%;
  margin: auto;
  ${({ show_shadow }) =>
    show_shadow === "true" ? "box-shadow: 0 1px 0px 0 rgb(0 0 0 / 30%);" : ""}

  @media (min-width: 599px) {
    max-width: 100%;
  }
`;
