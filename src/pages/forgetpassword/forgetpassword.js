import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { forgetPasswordService } from "../../services/forgetpassword.service";
import SwalUI from '../../components/ui/swal-ui/swal-ui';
import validator from 'validator';

import "./forget.scss";
import { appActions } from "../../store/app-slice";

const ForgetPasswordPage = () => {
  const { t } = useTranslation("login");
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const emailRef = useRef()

  const requestChangePassword = () => {
    if(!validator.isEmail(emailRef.current.value.trim())){
      emailRef.current.focus()
      emailRef.current.classList.add('inp-error')
      return false
    } else {
      emailRef.current.classList.remove('inp-error')
    }

    setIsFetching(true)
    dispatch(appActions.isSpawnActive(true))
    const formData = new FormData();
    formData.append('email', emailRef.current.value)
    forgetPasswordService(formData).then(res => {
      emailRef.current.value = "";
      dispatch(appActions.isSpawnActive(false))
      setIsFetching(false)
      SwalUI({status: res.status, description: res.description})
    })
  }
  
  return (
    <form id="forgetpassword-page" className="guest-form">
      <figure className="fig-logo">
        <img
          src="https://manami-delivery.com/img/home/mainlogogroup.png"
          className="logo" />
      </figure>
      <h1 className="login-title">Login To Your Account</h1>
      <p className="login-desc">Welcome Back To Manami-delivery Manager</p>

      <div className="input-group">
        <figure className="login-icon">
          <img src="/images/svg/envelope.svg" />
        </figure>
        <input type="text" placeholder={t("Email")} ref={emailRef} />
      </div>
   
      <div className="rows">
        <div></div>
        <div className="forget-password"> 
          <Link  className="link" to="/login">{t("backToLogin")}</Link>
        </div>
      </div>
      <button type="button" className="btn-signin" onClick={requestChangePassword} disabled={isFetching}>{t("Reset")}</button>
      <div className="register-section">
        <h3 className="register-title">{t("OrSignInWith")}</h3>
        <div className="socials">
          <Link to="/register">
            <button type="button" className="btn-register ">{t("NewAccountBtn")}</button>
          </Link> 
        </div>
      </div>
      <div className="powerby"> COPY RIGHT @2023 MANAMI DELIVERY CO,LTD</div>
    </form>
  );
};

export default ForgetPasswordPage;
