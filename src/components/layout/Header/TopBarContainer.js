import styled from "styled-components";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect } from "react";
import { useGlobalContext } from "@/store";
import SearchResult from "@/components/common/SearchResult";
import TcgGameHeader from "@/components/common/TcgGameHeader";
import { usePathname } from "next/navigation";

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
  top = 0,
  ...props
}) => {
  const { isMobile } = useMediaQuery();
  const { state } = useGlobalContext();
  main_height = !isMobile ? 72 : 60;
  sub_height = !isMobile ? 64 : 65;
  sub_fontSize = !isMobile ? 20 : 16;
  useEffect(() => {
    main_height = !isMobile ? 72 : 60;
    sub_height = !isMobile ? 64 : 65;
    sub_fontSize = !isMobile ? 20 : 16;
  }, [isMobile]);
  const location = usePathname();

  return (
    <TopBarContainerElement
      not_fixed={not_fixed === null ? !state.navbar.fixed : not_fixed}
      show_shadow={show_shadow}
      z_index={z_index}
      background_color={backgroundColor}
      isMobile={isMobile}
      top={top}
      {...props}
    >
      {state.navbar.prependComponent && state.navbar.prependComponent()}
      {children}
      {!["/home/tcg", "/profile"].some((path) => location.startsWith(path)) && (
        <TcgGameHeader />
      )}
      {state.navbar.appendComponent && state.navbar.appendComponent()}
      <SearchResult />
    </TopBarContainerElement>
  );
};

TopBarContainer.propTypes = {
  // Define any PropTypes here if necessary
};

export default TopBarContainer;

const TopBarContainerElement = styled.header.withConfig({
  shouldForwardProp: (prop) =>
    !["not_fixed", "show_shadow", "isMobile", "top"].includes(prop),
})`
  /*  */
  background-color: ${({ background_color }) => background_color};
  position: ${({ not_fixed }) => (not_fixed ? "absolute" : "fixed")};
  top: ${({ top }) => top};
  right: 0;
  left: 0;
  z-index: ${({ z_index }) => z_index};
  width: 100%;
  margin: auto;

  @media (min-width: 599px) {
    max-width: 100%;
  }
`;
