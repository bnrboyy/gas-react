import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import SwalUI from "../../components/ui/swal-ui/swal-ui";
import { resetPasswordService } from "../../services/forgetpassword.service";
import { appActions } from "../../store/app-slice";
import validator from "validator";
import {
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import "./resetpassword.scss";

const ResetPasswordPage = () => {
  const { token } = useParams()
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const passwordRef = useRef()
  const confirmRef = useRef()

  const [validPassword, setValidPassword] = useState({
    valid: true,
    minLength: false,
    upperCase: false,
    lowerCase: false,
    numberCase: false,
  });

  const filterPasswordHandler = (e) => {
    let validate = validPassword; 
    if (passwordRef.current.value.length < 8) {
      validate = {...validate, minLength: false, valid: false }
    } else {
      validate = {...validate, minLength: true }
    }
    if (
      validator.isStrongPassword(passwordRef.current.value, {
        minUppercase: 1,
        minLowercase: 0,
        minLength: 0,
        minSymbols: 0,
        minNumbers: 0,
      })
    ) {
      validate = {...validate, upperCase: true }
    } else {
      validate = {...validate, upperCase: false, valid: false }
    }
    if (
      validator.isStrongPassword(passwordRef.current.value, {
        minUppercase: 0,
        minLowercase: 1,
        minLength: 0,
        minSymbols: 0,
        minNumbers: 0,
      })
    ) {
      validate = {...validate, lowerCase: true }
    } else {
      validate = {...validate, lowerCase: false, valid: false }
    }
    if (
      validator.isStrongPassword(passwordRef.current.value, {
        minUppercase: 0,
        minLowercase: 0,
        minLength: 0,
        minSymbols: 0,
        minNumbers: 1,
      })
    ) {
      validate = {...validate, numberCase: true } 
    } else {
      validate = {...validate, numberCase: false, valid: false }
    }
    if( validate.minLength && validate.upperCase && validate.lowerCase && validate.numberCase ){
      validate.valid = true
    }
    setValidPassword(validate)
  }
 
 
  const resetPasswordHandler = () => {

    if(passwordRef.current.value.trim().length < 8) {
      passwordRef.current.focus()
      return false
    }

    setIsFetching(true)
    dispatch(appActions.isSpawnActive(true))
    const formData = new FormData();
    formData.append('password', passwordRef.current.value)
    formData.append('c_password', confirmRef.current.value)
    formData.append('token', token)

    resetPasswordService(formData).then(res => {
      dispatch(appActions.isSpawnActive(false))
      setIsFetching(false)
      SwalUI({status: res.status, description: res.description})
      if(res.status) {
        setTimeout(() => {
          navigate("/login");
        }, 1500)
      }
  
  
    })

  }
  
  return (
    <form id="forgetpassword-page" className="guest-form">
      <figure className="fig-logo">
        <img
          src="https://manami-delivery.com/img/home/mainlogogroup.png"
          className="logo" />
      </figure>
      <h1 className="login-title">Reset your password</h1>
      <p className="login-desc">Welcome Back To Manami-delivery Manager</p>

      <div className="input-group">
        <figure className="login-icon">
            <img src="/images/svg/key.svg" />
        </figure>
        <input
          type="password"
          placeholder={t("Password")}
          className={`${!validPassword.valid ? "inp-error" : ""}`}
          onChange={filterPasswordHandler}
          ref={passwordRef}
        />
        <p className="password-required">
          <FontAwesomeIcon
            icon={validPassword.minLength ? faCheckCircle : faTimes}
          />
          Password must be atleast 8 characters *
        </p>
        <p className="password-required">
          <FontAwesomeIcon
            icon={validPassword.upperCase ? faCheckCircle : faTimes}
          />
          Password must be 1 Upper Character *
        </p>
        <p className="password-required">
          <FontAwesomeIcon
            icon={validPassword.lowerCase ? faCheckCircle : faTimes}
          />
          Password must be 1 Lower Character *
        </p>
        <p className="password-required">
          <FontAwesomeIcon
            icon={validPassword.numberCase ? faCheckCircle : faTimes}
          />
          Password must be 1 Number Character *
        </p>
      </div>
      <div className="input-group">
        <figure className="login-icon">
          <img src="/images/svg/shieldkey.svg" />
        </figure>
        <input type="password" placeholder={t("Confirm Password")} ref={confirmRef} />
      </div>
   
      <div className="rows">
        <div></div>
        <div className="forget-password">
          <Link  className="link" to="/login">{t("backToLogin")}</Link>
        </div>
      </div>
      <button type="button" className="btn-signin" onClick={resetPasswordHandler} disabled={isFetching}>{t("Reset")}</button>
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

export default ResetPasswordPage;
