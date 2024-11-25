import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { colors, padding } from "@/lib/constants";

const BundleFoldrComponent = React.memo(({ 
  title, 
  children,
  children_length
}) => {
  const containerRef = useRef();

  const [closeContainer, setCloseContainer] = useState(true);
  const [element_height, setElement_height] = useState(0);
  useEffect(()=>{
    if(containerRef.current.offsetHeight !== 0 && !containerRef.current.style.height) {
      containerRef.current.style.height = containerRef.current.offsetHeight + "px";
      setElement_height(containerRef.current.offsetHeight / children_length);
      setCloseContainer(true);
      setTimeout(() => {
        containerRef.current.style.opacity = 1;
        containerRef.current.style.position = "unset";
        setCloseContainer(false);
      }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeContainer]);

  function toggleContainer() {
    setCloseContainer(!closeContainer);
  }

  return (
    <BundleFoldrComponentElement>
      <div className="foldr_container">
        <div 
          className="foldr_container_header"
          onClick={toggleContainer}
        >
          <p className="foldr_container_header_text">{title}</p>
          <span 
            className="foldr_container_header_arrow"
          >
            <FontAwesomeIcon
              className={"foldr_container_header_arrow_icon " + (closeContainer ? "" : "close")}
              icon={faAngleDown}
            />
          </span>
        </div>
        <div 
          ref={containerRef}
          className={"foldr_container_body " + (closeContainer ? "close" : "")}
          style={{
            height: element_height ? (element_height * children_length + "px") : ""
          }}
        >{children}</div>
      </div>
    </BundleFoldrComponentElement>
  );
});

export default BundleFoldrComponent;

export const BundleFoldrComponentElement = styled.div`/*  */
  .foldr_container {
    &_header,
    &_body {
      background-color: #fff;
    }

    &_header {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding: 10px ${padding}px;
      font-size: 18px;

      &_text {
        color: ${colors.text_grey};
        font-weight: 700;
      }

      &_arrow {
        &_icon {
          width: 18px;
          height: 18px;
          transition: 0.3s;

          &.close {
            transform: rotateX(180deg);
          }
        }
      }
    }

    &_body {
      position: absolute;
      overflow: hidden;
      opacity: 0%;
      transition: height 0.3s;

      &.close {
        height: 0 !important;
      }
    }
  }
`;
