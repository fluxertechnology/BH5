import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Make sure to import Cookies
import LanguageItem from "@/components/profile/LanguageItem";
import { useRouter } from "next/navigation";

import styled from "styled-components";
import { colors } from "@/lib/constants";
export default function LanguageListItem({ list, currentLanguage }) {
    
  const [selectedValue, setSelectedValue] = useState(currentLanguage.lang);

  const router = useRouter();

  const changeLanguage = (newLocale) => {
    Cookies.set("NEXT_LOCALE", newLocale, { path: "/" });
    router.refresh();
  };

  const handleChange = (event) => {
    changeLanguage(event.target.value);
    setSelectedValue(event.target.value);
  };
  const handleClick = (event) => {
    changeLanguage(event);
    setSelectedValue(event);
  };
  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "size-radio-button-demo",
    inputProps: { "aria-label": item },
  });

  return (
    <LanguageListItemElement>
      {list.map((data) => (
        <LanguageItem
          key={data?.lang}
          controlProps={controlProps}
          data={data}
          handleClick={handleClick}
        />
      ))}
    </LanguageListItemElement>
  );
}

export const LanguageListItemElement = styled.div`
  /*  */
  padding: 0 1%;
  .container {
    display: flex;
    width: 100%;
    padding: 1% 0;
    border-bottom: 1px solid #bbb;
    font-size: 20px;
    color: ${colors.text_grey};
    justify-content: space-between;
    align-items: center;

    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
`;
