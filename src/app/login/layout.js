"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";

// import SwitchRoute from "../component/SwitchRoute";

import ImageComponent from "@/components/common/ImageComponent";

import TopBarContainer, {
  main_height,
} from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import WebTopBar from "@/components/layout/Header/WebTopBar";
import React, { useEffect } from "react";
import { useGlobalContext, useGlobalDispatch } from "@/store";
// import { bottom_nav_height } from "../component/BottomNavBar";

function Login({ children }) {
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const { state, dispatch } = useGlobalContext();
  const blockIn = state.routesGuard.blockIn;
  const banner = state?.adsList?.register_banner?.[0]?.img || null;

  useEffect(() => {
    dispatch({
      type: "UPDATE_NAVBAR",
      key: "customComponent",
      data: () => (
        <>
          <TopBarContainer show_shadow={false}>
            {isMobile ? (
                <TopTitleBar
                  showBack={true && !blockIn}
                  color="#000"
                  back_color="transparent"
                />
              ) : (
                <React.Fragment>
                  <WebTopBar />
                  <TopTitleBar
                    showBack={true && !blockIn}
                    color="#000"
                    back_color="transparent"
                  />
                </React.Fragment>
              )}
          </TopBarContainer>
        </>
      ),
    });
  }, []);

  return (
    <LoginElement>
      <ImageComponent
        imgStyle={{ objectFit: isMobile ? "cover" : "contain" }}
        height={isMobile ? 60 : 18}
        border_radius={0}
        src={banner}
        alt="login banner"
        title={t("Login.welcome")}
      />
      <div className="container">
        {/* <SwitchRoute routes={routes} routesStep={2} /> */}
        {children}
      </div>
    </LoginElement>
  );
}

// const LoginStateToProps = (state, ownProps) => {
//   return {
//     routes: ownProps.routes,
//     blockIn: state.routesGuard.blockIn,
//     banner: state?.adsList?.register_banner?.[0]?.img || "",
//   };
// };

// const LoginDispatchToProps = (dispatch) => {
//   return {};
// };

// export default withRouter(
//   connect(LoginStateToProps, LoginDispatchToProps)(Login)
// );

const LoginElement = styled.div`
  /*  */
  padding-bottom: 5%;
  position: relative;
  // z-index: 1;
  overflow: hidden;
  height: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #fff;
  @media (min-width: 599px) {
    padding-top: ${main_height}px;
  }
  .container {
    position: relative;
    max-width: unset;
  }
`;

export default Login;
