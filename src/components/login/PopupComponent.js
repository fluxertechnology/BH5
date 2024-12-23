"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import PopupDialogLogin from "@/components/login/PopupComponentLogin";
import PopupDialogRegister from "@/components/login/PopupComponentRegister";
import PopupDialogRecoverPassword from "@/components/login/PopupComponentRecoverPassword";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { closePopup } from "@/store/actions/user";

const PopupDialog = () => {
  const t = useTranslations();
  const { state } = useGlobalContext();

  const [popupType, setPopupType] = useState(state.navbar.dialogType);

  const toLogin = () => {
    // useGlobalDispatch(pushRoutes(login));

    useGlobalDispatch({
      type: "UPDATE_POPUP_TYPE",
      data: {
        popupType: "login",
      },
    });
  };

  const toRegister = () => {
    // useGlobalDispatch(pushRoutes(login));

    useGlobalDispatch({
      type: "UPDATE_POPUP_TYPE",
      data: {
        popupType: "register",
      },
    });

  };

  const closeModal = () => {
    useGlobalDispatch({
      type: "UPDATE_POPUP_TYPE",
      data: {
        popupType: "login",
      },
    });

    useGlobalDispatch(closePopup());
  };

  useEffect(() => {
    console.log("popupType");
    console.log(popupType);
    console.log(state.navbar.dialogType);

    setPopupType(state.navbar.dialogType);

  }, [state.navbar.dialogType]);

  // useEffect(() => {
  //   useGlobalDispatch({
  //     type: "UPDATE_POPUP_TYPE",
  //     data: {
  //       popupType,
  //     },
  //   });
  // }, [popupType]);

  return (
    <div id="popup-dialog" style={{ display: 'none' }}>
      {popupType == "register" && (
        <PopupDialogWrapper>
          <div className="card-container">
            <div className="close-cont" onClick={closeModal}>
              <FontAwesomeIcon
                className="close-icon"
                icon={faX}
                style={{ color: "#434343" }}
              />
            </div>
            <div className="card-header">
              <h3 className="title-text">{t("Login.register")}</h3>
              <p className="subtitle-text">
                {t("Register.have_acc")}
                <span className="green cursor-pointer" onClick={toLogin}>
                  {t("Login.login")}
                </span>
              </p>
            </div>

            <PopupDialogRegister />
          </div>
        </PopupDialogWrapper>
      )}
      {popupType == "login" && (
        <PopupDialogWrapper>
          <div className="card-container">
            <div className="close-cont" onClick={closeModal}>
              <FontAwesomeIcon
                className="close-icon"
                icon={faX}
                style={{ color: "#434343" }}
              />
            </div>
            <div className="card-header">
              <h3 className="title-text">{t("Login.login")}</h3>
              <p className="subtitle-text">
                {t("Register.no_acc")}
                <span className="green cursor-pointer" onClick={toRegister}>
                  {t("Login.register")}
                </span>
              </p>
            </div>
            <PopupDialogLogin />
          </div>
        </PopupDialogWrapper>
      )}
      {popupType == "forget" && (
        <PopupDialogWrapper>
          <div className="card-container">
            <div className="close-cont" onClick={closeModal}>
              <FontAwesomeIcon
                className="close-icon"
                icon={faX}
                style={{ color: "#434343" }}
              />
            </div>
            <div className="card-header">
              <h3 className="title-text">{t("Login.forget_password")}</h3>
              <p className="subtitle-text">
                {t("Register.have_acc")}
                <span className="green cursor-pointer" onClick={toLogin}>
                  {t("Login.login")}
                </span>
              </p>
            </div>
            <PopupDialogRecoverPassword />
          </div>
        </PopupDialogWrapper>
      )}
    </div>
  );
};

export default PopupDialog;

export const PopupDialogWrapper = styled.div`
  /*  */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .card-container{
    width: 20.667vw;
    max-height: 37.458vw;
    overflow: auto;
    background-color: #fff;
    padding: 2.542vw 1.75vw 2.542vw;
    position: relative;
    @media (min-width: 769px) and (max-width:1024px) {
      width: 50vw;
      max-height: 100%;
    }
    @media (max-width: 768px) {
      width: 80vw;
      max-height: 100%;
    }

    .close-cont{
      position: absolute;
      top: 0;
      right: 0;
      margin: 0.7vw 0.5vw;
      cursor: pointer;
   
      .close-icon{
        width: 0.938vw;
        height: 0.938vw;
        @media (min-width: 769px) and (max-width:1024px){
          width: 2vw;
          height: 2vw;
        }
        @media (max-width: 768px) {
          width: 4vw;
          height: 4vw;
        }
      }
        
    }

    .card-header{
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title-text{
      margin-bottom: 0.417vw;
      line-height: 1;
      font-size: 1.25vw;
      color: #464656;
      font-weight: 700 !important;
      @media (min-width: 769px) and (max-width:1024px){
        font-size: 4vw;
        margin-bottom: 2vw;
      }
      @media (max-width: 768px) {
        font-size: 8vw;
        margin-bottom: 2vw;
      }
    }

    .subtitle-text{
      margin-bottom: 1.042vw;
      line-height: 1;
      font-size: 0.729vw;
      color: #464656;
      @media (min-width: 769px) and (max-width:1024px){
        font-size: 1.8vw;
        margin-bottom: 1vw;
      }
      @media (max-width: 768px) {
        font-size: 2.4vw;
        margin-bottom: 2vw;
      }
    }
    
    .form-item{
      position: relative;
      margin-bottom: 0.833vw;

      .form-label-cont{
        display: flex;
        justify-content: space-between;
      }
    }

    .form-label{
      line-height: 1;
      font-size: 0.625vw;
      color: #464656;
      font-weight: 700 !important;
      display: inline-block;
      margin-bottom: 0.26vw;
      min-width: 2vw;
      @media (min-width: 769px) and (max-width:1024px){
        font-size: 1.8vw;
        margin-bottom: 1vw;
      }
      @media (max-width: 768px) {
        font-size: 2.4vw;
        margin-bottom: 1vw;
      }
    }

    .forget{
      color: #a6a6a6;
      cursor: pointer;
    }

    label{
      border: none;
    }

    .form-item input{
      height: 2.083vw;
      min-height: 2.083vw;
      margin-top: 0.833vw;
      padding: 0.417vw;
      border: 0.052vw solid #d6d6d6;
      border-radius: 0.208vw;
      outline: none;
      width: 100%;
      margin: 0;
      font-size: 0.833vw;
      color: #060616;
      position: relative;
      @media (min-width: 769px) and (max-width:1024px) {
        font-size: 1.8vw;
        margin-top: 0.5vw;
        margin-bottom: 0.5vw;
        height: 4vw;
      }
      @media (max-width: 768px) {
        font-size: 2.4vw;
        margin-top: 1vw;
        margin-bottom: 1vw;
        height: 8vw;
      }

      &:disabled{
        background-color: #EBEBE4;
      }
    }

    .form-item .input_content_box{
      border: 0.052vw solid #646464;
      border-radius: 0.208vw;
    }

    .form-item .phone-verify{
      width: 65%;
    }

    .form-item .input_content_box input{
      border: none; 
    }

    .green{
      color: #56c676;
      font-weight: 700;
    }

    .eye-cont{
      position: absolute;
      right: 0;
      top:50%;
      transform: translateY(-50%);
      line-height: 0;
      margin: 0.573vw;
      z-index: 6;
      cursor: pointer;
      @media (min-width: 769px) and (max-width:1024px) {
        transform: translateY(0%);
      }
      @media (max-width: 768px) {
        transform: translateY(-30%);
      }
    }

    .eye-icon{
      display: flex;
      width: 1.25vw;
      height: 0.938vw;
      @media (min-width: 769px) and (max-width:1024px) {
        width: 2vw;
        height: auto;
      }
      @media (max-width: 768px) {
        width: 5vw;
        height: auto;
      }
    }

    .submit-btn{
      width: 100%;
      margin-bottom: 0.625vw;
      line-height: 2.083vw;
      height: 2.083vw;
      border-radius: 0.104vw !important;
      background-color: #c6c6c6;
      text-transform: none;
      display: inline-flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 0.833vw;
      font-weight: 700 !important;
      padding: 0;
      color: #fff;
      transition: background-color .2s linear;

      @media (min-width: 769px) and (max-width:1024px) { 
        height: 4vw; 
        font-size: 1.8vw; 
      }
      @media (max-width: 768px) { 
        height: 8vw; 
        font-size: 2.4vw; 
      }

      &:hover{
        background-color: #8b8b8b;
      }
    }
  }

  .other-type{
  
    .eye-cont{
      position: absolute;
      line-height: 0;
      margin: 0.573vw;
      z-index: 6;
      cursor: pointer;
    }
  }

  .phone-verify-btn{
    width: 30%;
    line-height: 2.092vw;
    height: 2.292vw;
    min-height: 2.292vw;
    border-radius: 0.208vw !important;
    background-color: #f2f2f2;
    text-transform: none;
    display: inline-flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 0.833vw;
    padding: 0.417vw;
    color: #000;
    transition: background-color .2s linear;
    border: 0.104vw solid #646464;
    cursor: pointer;
    margin:auto 0;

    @media (min-width: 769px) and (max-width:1024px) { 
      height: 4vw; font-size: 1.8vw; 
    }
    @media (max-width: 768px) { 
      height: 8vw; 
      font-size: 2.4vw; 
    }

    &:hover{
      background-color: #fff;
    }
  }

  .edit-btn{
    width: 100%;
    margin-bottom: 0.625vw;
    line-height: 2.083vw;
    height: 2.083vw;
    border-radius: 0.104vw !important;
    background-color: #f2f2f2;
    text-transform: none;
    display: inline-flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 0.833vw;
    font-weight: 700 !important;
    padding: 0;
    color: #000;
    transition: background-color .2s linear;
    border: 0.104vw solid #f2f2f2;
    @media (min-width: 769px) and (max-width:1024px) {
      height: 4vw;
      font-size: 1.8vw;
    }
    @media (max-width: 768px) {
        height: 8vw;
        font-size: 2.4vw;
    }
    &:hover{
      background-color: #fff;
    }
  }

  .fast-register{
    margin-top: 2vw;
    
    .title-wrapper{
      display: flex;
      flex-direction: column;
      align-items: center;

      h3{
        font-size: 2.5vw;
        margin-bottom: 0.26vw;
      }

      p{
        font-size: 0.833vw;
      }
    }

    .user-register{
      border: 0.104vw solid #f2f2f2;
      width: 100%;
      height: 2.083vw;
      padding: 0.66vw 0.817vw;
      display: flex;
      align-items: center;
      margin-top: 2vw;
      cursor: pointer;
      transition: background-color .2s linear;
  
      @media (min-width: 769px) and (max-width:1024px) {
        height: 4vw;
        margin-top: 2vw;
      }
      @media (max-width: 768px) {
        height: 8vw;
        margin-top: 5vw;
      }

      .mail-icon{
        width: 0.825vw;
        height: 0.825vw;
        // margin-right: 4.475vw;
        position: absolute;

        @media (min-width: 769px) and (max-width:1024px) {
          height: 2vw;
          width: 2vw;
        }
        @media (max-width: 768px) {
          width: 4vw;
          height: 4vw;
        }
      }

      p{
        font-size: 0.729vw;
        text-align: center;
        width: 100%;
        @media (min-width: 769px) and (max-width:1024px) {
          font-size: 1.8vw;
        }
        @media (max-width: 768px) {
          font-size: 2.4vw;
        }
      }

      &:hover{
        background-color: #f2f2f2;
      }
    }
  }

  .email-verify-box {
    display: flex;
    align-items: center;
    margin-bottom: 1vw !important;
    
    label{
      margin-bottom: 0 !important;
      margin-right: 1vw;
    }
  }

  .email-verify input{
    font-size: 0.729vw;
  }
  
  .verify-btn{
    width:  5vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #ffc44b;
    font-size: 0.729vw;
    @media (min-width: 769px) and (max-width:1024px) {
      font-size: 1.8vw;
    }
    @media (max-width: 768px) {
        font-size: 2.4vw;
    }
  }

  .t-and-c{
    margin-bottom: 0;
    font-size: 0.729vw;
    color: #666676;
    line-height: 1.2;
    text-align: center;

    strong{
      font-weight: 700;
    }

    @media (min-width: 769px) and (max-width:1024px) {
      font-size: 1.8vw;
    }
    @media (max-width: 768px) {
      font-size:2.4vw;
    }
  }

  .fast-login{

    margin-top: 2vw;
    @media (max-width: 768px) {
        margin-top: 5vw;
    }

    .title-wrapper{
      display: flex;
      flex-direction: column;
      align-items: center;

      h3{
        font-size: 2.5vw;
        margin-bottom: 0.26vw;
        
        @media (min-width: 769px) and (max-width:1024px) {
          font-size: 1.8vw;
        }
        @media (max-width: 768px) {
            font-size: 2.4vw;
        }
      }

      p{
        font-size: 0.833vw;
      }
    }
  
    .user-login{
      border: 0.104vw solid #f2f2f2;
      width: 100%;
      height: 2.083vw;
      padding: 0.66vw 0.817vw;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background-color .2s linear;
      margin-bottom: 0.5vw;

      @media (min-width: 769px) and (max-width:1024px) {
        height: 4vw;
      }
      @media (max-width: 768px) {
        height: 8vw;
      }

      &:first{
        margin-top: 2vw;
      }
  
      .mail-icon{
        width: 0.825vw;
        height: 0.825vw;
        margin-right: 4.475vw;
        position: absolute;

        @media (min-width: 769px) and (max-width:1024px) {
          width: 3vw;
          height: auto;
        } 
        @media (max-width: 768px) {
          width: 5vw;
          height: auto;
          margin-right: 0vw;
        }
      }

      .phone-icon-wrapper{
        width: 0.925vw;
        height: 0.925vw;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 4.475vw;
        position: absolute;

        @media (min-width: 769px) and (max-width:1024px) {
          width: 3vw;
          height: 3vw;
        } 
        @media (max-width: 768px) {
        width: 5vw;
        height: 5vw;
        }
      }

      .phone-icon{
        width: 0.725vw;
        height: 0.725vw;
        @media (min-width: 769px) and (max-width:1024px) {
          width: auto;
          height: 2vw;
        } 
        @media (max-width: 768px) {
          width: auto;
          height: 4vw;
          margin-right: 0vw;
        }
      }
  
      p{
        font-size: 0.729vw; 
        text-align:center;
        width: 100%;

        @media (min-width: 769px) and (max-width:1024px) {
          font-size: 1.8vw;
        } 
        @media (max-width: 768px) {
          font-size: 2.4vw;
        }
      }
  
      &:hover{
        background-color: #f2f2f2;
      }
    }
  }
}
`;
