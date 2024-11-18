import styled from "styled-components";
import useMediaQuery from "@/hooks/useMediaQuery";

export let main_height = window.innerWidth > 768 ? 72 : 50;
export let sub_height = window.innerWidth > 768 ? 42 : 38;
export let sub_fontSize = window.innerWidth > 768 ? 20 : 12;

/**
 * @description TopBarContainer component
 *
 * @param {*} { children }
 * @return {*}
 */
const TopBarContainer = ({
  not_fixed = "false",
  show_shadow = "true",
  children,
  z_index = 10,
  backgroundColor = "transparent", 
  ...props 
}) => {
  const { isMobile } = useMediaQuery();
  main_height = !isMobile ? 72 : 50;
  sub_height = !isMobile ? 42 : 38;
  sub_fontSize = !isMobile ? 20 : 16;

  return (
    <TopBarContainerElement
      not_fixed={not_fixed}
      show_shadow={show_shadow}
      z_index={z_index}
      background_color={backgroundColor}
      {...props}
    >
      {children}
    </TopBarContainerElement>
  );
};

TopBarContainer.propTypes = {
  // Define any PropTypes here if necessary
};

export default TopBarContainer;

const TopBarContainerElement = styled.header`
  background-color: ${({ background_color }) => background_color}; 
  position: ${({ not_fixed }) => (not_fixed === "false" ? "fixed" : "absolute")};
  top: 0;
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
