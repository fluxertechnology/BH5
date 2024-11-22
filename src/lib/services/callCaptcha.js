export const CALL_CAPTCHA_TYPE = {
  REGISTER: "6b03ebb2f6d592bd3821ad625974f43c",
  NEWSLETTER: "9d7bdb4c52fc63a57174e602bcdf3b93",
};

export const callCaptcha = (
  type = CALL_CAPTCHA_TYPE.REGISTER,
  callback = () => {},
  errCallback = () => {}
) => {
  window.initGeetest4(
    {
      captchaId: type,
      product: "bind",
    },
    function (captcha) {
      captcha.showCaptcha();
      captcha
        .onReady(function () {})
        .onSuccess(function () {
          const result = captcha.getValidate();

          callback(result);
          captcha.reset();
        })
        .onError(function () {
          errCallback();
        });
    }
  );
};
