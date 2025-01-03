import { colors } from "@/lib/constants";
import styled from "styled-components";

const FloatElement = styled.div`
  /* */
  .float_cover {
    padding-top: 0.5em;
    position: fixed;
    bottom: -70vh;
    z-index: 100;
    width: 100%;
    background-color: #fff;
    transition-duration: 2s;
    display: flex;
    justify-content: center;
    align-items: center;

    &_container {
      height: 100%;
      position: relative;
      width: 100%;
      padding: 0 34%;
    }

    &_header {
      padding: 4% 5%;
      display: flex;
      justify-content: space-between;
      font-size: 1.6rem;
      font-weight: 700;
      @media (max-width: 899px) {
        font-size: 1.2rem;
      }
      &_left {
        color: ${colors.text_grey};
        border-radius: 9px;
      }
      &_right {
        color: ${colors.back_dark_pink};
      }
    }
    &_body {
      overflow: auto;
      height: 100%;
      padding: 4% 5%;
      margin-bottom: 5%;
      &_icon {
        @media (max-width: 899px) {
          width: 30px !important;
          height: 30px !important;
        }
      }
    }
    &_close {
      position: absolute;
      top: 10px;
      right: 10px;
      color: ${colors.text_grey};
      @media (max-width: 899px) {
        top: 2%;
        right: 5%;
      }
      &_img {
        font-size: 3rem;
        @media (max-width: 899px) {
          font-size: 2rem;
        }
      }
    }
  }
`;

export default FloatElement;
