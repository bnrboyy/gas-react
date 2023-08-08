import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { appActions } from "../../store/app-slice";
import axios from "axios";

import "./login.scss";
import validator from "validator";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const modalSwal = withReactContent(Swal);
const ToastModal = modalSwal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

const LoginPage = () => {
  const { t } = useTranslation("login");
  const dispatch = useDispatch();
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const keepRef = useRef();

  useEffect(() => {}, [isLoggedIn]);

  const signInHandler = async () => {
    if (!validator.isEmail(usernameRef.current.value.trim())) {
      usernameRef.current.focus();
      return false;
    }

    if (passwordRef.current.value.trim().length < 8) {
      passwordRef.current.focus();
      return false;
    }

    try {
      dispatch(appActions.isBounceActive());
      axios
        .post("login", {
          username: usernameRef.current.value.trim(),
          password: passwordRef.current.value.trim(),
        })
        .then(
          (response) => {
            dispatch(
              authActions.login({
                token: response.data.data.accessToken,
                keepLogin: true,
              })
            );
            ToastModal.fire({
              icon: "success",
              title: "เข้าสู่ระบบสำเร็จ",
            });
          },
          (error) => {
            dispatch(appActions.isBounceActive(false));
            if (error.response.status === 422) {
              const errorDesc = error.response.data.description.reduce(
                (previous, current) => (previous += `<p>${t(current.msg)}</p>`),
                ""
              );
              modalSwal.fire({
                position: "center",
                icon: "error",
                title: t("Sign-in failed"),
                html: errorDesc,
                confirmButtonColor: "#f27474",
                confirmButtonText: t("OK"),
              });
            } else {
              modalSwal.fire({
                position: "center",
                icon: "error",
                title: t("Sign-in failed"),
                text: t("ErrorSignIn"),
                confirmButtonColor: "#f27474",
                confirmButtonText: t("OK"),
              });
            }
          }
        );
    } catch (err) {}
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <form id="login-page" className="guest-form">
      <figure className="fig-logo">
        <img src="images/icons/gas-delivery.png" className="logo" />
      </figure>
      <div className="input-form">
        <h1 className="login-title"> - Jupp Gas Delivery - </h1>
        <p className="login-desc">ระบบหลังบ้าน</p>
        <p className="login-desc">เข้าสู่ระบบ</p>
        <div className="input-group">
          <figure className="login-icon">
            <img src="/images/svg/user.svg" />
          </figure>
          <input type="text" placeholder={t("Username")} ref={usernameRef} />
        </div>
        <div className="input-group">
          <figure className="login-icon">
            <img src="/images/svg/key.svg" />
          </figure>
          <input
            type="password"
            autoComplete="false"
            placeholder={t("Password")}
            ref={passwordRef}
          />
        </div>
        {/* <div className="rows"> */}
          {/* <div className="keep-login">
          <input
            type="checkbox"
            ref={keepRef}
            defaultChecked={true}
            id="check-keep"
          />
          <label htmlFor="check-keep">{t("KeepLogin")}</label>
        </div> */}
          {/* <div className="forget-password">
            <Link to="/forgetpassword">{t("ForgetPassword")}</Link>
          </div>
        </div> */}
        <button type="button" className="btn-signin" onClick={signInHandler}>
          {t("SignInBtn")}
        </button>
        <div className="register-section">
          <h3 className="register-title">{t("OrSignInWith")}</h3>
          <div className="socials">
            {/* <button type="button" className="btn-socials facebook">
          <img src="/images/svg/facebook.svg" />
        </button> */}
            <Link to="/register">
              <button type="button" className="btn-register ">
                {t("NewAccountBtn")}
              </button>
            </Link>
            {/* <button type="button" className="btn-socials google">
          <img src="/images/svg/google.svg" />
        </button> */}
          </div>
        </div>
      </div>

      {/* <div className="powerby"> COPY RIGHT @2023 MANAMI DELIVERY CO,LTD</div> */}
    </form>
  );
};

export default LoginPage;
