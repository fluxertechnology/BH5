"use client";

import styled from "styled-components";

// import SwitchRoute from "../component/SwitchRoute";
import { sub_height } from "@/components/layout/Header/TopBarContainer"

const HomeProtocolRender = ({ children }) => {

  return (
    <HomeProtocolRenderElement>
      <div className="container">
        {/* <SwitchRoute routes={routes} routesStep={5} exact={true} /> */}
        {children}
      </div>
    </HomeProtocolRenderElement>
  );
};

export default HomeProtocolRender;

const HomeProtocolRenderElement = styled.div`
  /*  */
  padding: ${sub_height}px 0;
  
  .container {
    position: relative;
    max-width: unset;
  }
`;
