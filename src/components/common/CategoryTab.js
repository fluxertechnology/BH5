import React from "react";
import styled from "styled-components";

import { colors, pageUrlConstants } from "@/lib/constants";
import LinkComponent from "@/components/common/LinkComponent";

const CategoryTab = ({
  title,
  type = 0, // 0 動畫 1 漫畫
}) => {
  return (
    <CategoryTabElement
      onClick={(e) => {
        e.stopPropagation();
        //e.preventDefault();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        //e.preventDefault();
      }}
    >
      <LinkComponent
        className="link"
        routes={{
          name: pageUrlConstants.home.pages.homeLabel.name + title,
          path: pageUrlConstants.home.pages.homeLabel.path,
          dynamic: {
            label: title,
            type,
          },
        }}
      >
        {title}
      </LinkComponent>
    </CategoryTabElement>
  );
};

export default React.memo(CategoryTab);

export const CategoryTabElement = styled.span`
  /*  */
  cursor: pointer;
  display: inline-block;
  padding: 1px 6px 3px;
  @media (min-width: 599px) {
    padding: 6px 15px 6px 15px;
  }
  margin-top: 3px;
  margin-right: 3px;
  margin-bottom: 3px;
  font-size: 14px;
  background-color: ${colors.light_pink};
  border-radius: 30px;

  .link {
    text-decoration: none;
    color: ${colors.dark_pink};
    text-shadow: 0.2px 0.2px ${colors.dark_pink};
  }
`;
