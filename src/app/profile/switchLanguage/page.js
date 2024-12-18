'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from "react";
import Cookies from "js-cookie"; // Make sure to import Cookies
// import { withRouter } from "react-router";
import styled from "styled-components";

import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import LanguageListItem from "@/components/profile/LanguageListItem";
import { pageUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { replaceRoutes } from "@/store/actions/historyActions";

const { profile } = pageUrlConstants;

const ProfileSwitchLanguage = () => {
  const t = useTranslations();
  const lang = Cookies.get("NEXT_LOCALE") ?? 'tc';
  const { state, dispatch } = useGlobalContext();

  const LanguageList = [
    { name: "簡體中文", lang: "tc" },
    { name: "English", lang: "en" },
  ];

  const currentLanguage = LanguageList.find((x) => x.lang === lang);  
  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
                <TopTitleBar
                  title={t("Profile.main.option.switch_language")}
                  show_back_color="#ffffff"
                  showBack={true}
                />
            </TopBarContainer>
          </>
        ),
      },
    });
  }, [lang]);

  // const clickTabLabel = (key) => {
  //   let upCass = key.slice(0, 1);
  //   upCass = upCass.toUpperCase();
  //   useGlobalDispatch(
  //     replaceRoutes(
  //       profile.pages.ProfileSwitchLanguage.pages[
  //         "ProfileSwitchLanguage" + upCass + key.slice(1)
  //       ]
  //     )
  //   );
  // };
  
  return (
    <ProfileSwitchLanguageElement>
      <LanguageListItem list={LanguageList} currentLanguage={currentLanguage} />
    </ProfileSwitchLanguageElement>
  );
};

export default ProfileSwitchLanguage;

// const ProfileSwitchLanguageStateToProps = (state, ownProps) => {
//   return {
//     routes: ownProps.routes,
//   };
// };

// const ProfileSwitchLanguageDispatch = (dispatch) => {
//   return {
//     clickTabLabel: (key) => {
//       let upCass = key.slice(0, 1);
//       upCass = upCass.toUpperCase();
//       dispatch(
//         replaceRoutes(
//           profile.pages.ProfileSwitchLanguage.pages[
//             "ProfileSwitchLanguage" + upCass + key.slice(1)
//           ]
//         )
//       );
//     },
//   };
// };

// export default withRouter(
//   connect(
//     ProfileSwitchLanguageStateToProps,
//     ProfileSwitchLanguageDispatch
//   )(ProfileSwitchLanguage)
// );

const ProfileSwitchLanguageElement = styled.div`
  /*  */
  padding-top: ${main_height}px;

  .grid {
    background-color: #fff;
  }

  .container {
    position: relative;
  }
`;
