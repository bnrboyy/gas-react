import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import validator from "validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./register.scss";

const modalSwal = withReactContent(Swal);

const RegisterPage = () => {
  const { t } = useTranslation("login");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    displayName: "",
  });
  const [username, setUsername] = useState(true);
  const [password, setPassword] = useState({
    valid: true,
    minLength: false,
    upperCase: false,
    lowerCase: false,
    numberCase: false,
  });
  const [confirm, setConfirm] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const passwordRef = useRef();
  const usernameRef = useRef();
  const displayRef = useRef();
  const confirmRef = useRef();

  useEffect(() => {}, [isLoggedIn]);

  const filterUsername = (e) => {
    let el = e.target;
    if (!validator.isEmail(el.value)) {
      setUsername(false);
    } else {
      setRegisterData((prev) => {
        return { ...prev, username: el.value };
      });
      setUsername(true);
    }
  };

  const filterPassword = (e) => {
    let el = e.target;
    setPassword((prev) => {
      return { ...prev, valid: true };
    });
    setRegisterData((prev) => {
      return { ...prev, password: el.value };
    });
    if (el.value.length < 8) {
      setPassword((prev) => {
        return { ...prev, minLength: false, valid: false };
      });
    } else {
      setPassword((prev) => {
        return { ...prev, minLength: true };
      });
    }
    if (
      validator.isStrongPassword(el.value, {
        minUppercase: 1,
        minLowercase: 0,
        minLength: 0,
        minSymbols: 0,
        minNumbers: 0,
      })
    ) {
      setPassword((prev) => {
        return { ...prev, upperCase: true };
      });
    } else {
      setPassword((prev) => {
        return { ...prev, upperCase: false, valid: false };
      });
    }
    if (
      validator.isStrongPassword(el.value, {
        minUppercase: 0,
        minLowercase: 1,
        minLength: 0,
        minSymbols: 0,
        minNumbers: 0,
      })
    ) {
      setPassword((prev) => {
        return { ...prev, lowerCase: true };
      });
    } else {
      setPassword((prev) => {
        return { ...prev, lowerCase: false, valid: false };
      });
    }
    if (
      validator.isStrongPassword(el.value, {
        minUppercase: 0,
        minLowercase: 0,
        minLength: 0,
        minSymbols: 0,
        minNumbers: 1,
      })
    ) {
      setPassword((prev) => {
        return { ...prev, numberCase: true };
      });
    } else {
      setPassword((prev) => {
        return { ...prev, numberCase: false, valid: false };
      });
    }
  };
  const filterConfirmPassword = (e) => {
    let el = e.target;
    if (!validator.equals(el.value, passwordRef.current.value)) {
      el.classList.add("inp-error");
      setConfirm(false);
    } else {
      el.classList.remove("inp-error");
      setConfirm(true);
    }
  };

  const signUpHandler = (e) => {
    if (
      !username ||
      usernameRef.current === undefined ||
      usernameRef.current.value.length === 0
    ) {
      usernameRef.current.focus();
      return false;
    }
    if (
      !password ||
      passwordRef.current === undefined ||
      passwordRef.current.value.length === 0
    ) {
      passwordRef.current.focus();
      return false;
    }
    if (
      displayRef.current === undefined ||
      displayRef.current.value.length === 0
    ) {
      displayRef.current.focus();
      return false;
    }
    if (password.valid && confirm && username) {
      axios({
        url: `register`,
        method: "post",
        data: {
          email: registerData.username,
          password: registerData.password,
          c_password: passwordRef.current.value,
          display_name: displayRef.current.value,
        },
      }).then(
        (response) => {
          modalSwal
            .fire({
              position: "center",
              icon: "success",
              title: t("Sign-up Successful"),
              text: t(response.data.description),
              confirmButtonColor: "#a5dc86",
              confirmButtonText: t("OK"),
            })
            .then(() => {
              setIsRegistered(true);
            });
        },
        (error) => {
          let messages = error.response.data.errorMessage;
          if (error.response.status === 422) {
            const errorDesc = messages.email.reduce(
              (previous, current) => (previous += `<p>${t(current)}</p>`),
              ""
            );
            modalSwal.fire({
              position: "center",
              icon: "error",
              title: t("Sign-up failed"),
              html: t(errorDesc),
              confirmButtonColor: "#f27474",
              confirmButtonText: t("OK"),
            });
          } else {
            modalSwal.fire({
              position: "center",
              icon: "error",
              title: t("Sign-up failed"),
              text: t(error.response.data.description),
              confirmButtonColor: "#f27474",
              confirmButtonText: t("OK"),
            });
          }
        }
      );
    }
  };

  if (isRegistered) {
    return <Navigate to="/login" />;
  }
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <form id="register-page" className="guest-form">
      <figure className="fig-logo">
        <img
          src="https://manami-delivery.com/img/home/mainlogogroup.png"
          className="logo"
        />
      </figure>
      <h1 className="login-title">Login To Your Account</h1>
      <p className="login-desc">Welcome Back To Manami-delivery Manager</p>

      <div className="input-group">
        <figure className="login-icon">
          <img src="/images/svg/user.svg" />
        </figure>
        <input
          type="text"
          placeholder={t("Username")}
          className={`${!username ? "inp-error" : ""}`}
          onChange={filterUsername}
          ref={usernameRef}
        />
      </div>
      <div className="input-group">
        <figure className="login-icon">
          <img src="/images/svg/key.svg" />
        </figure>
        <input
          type="password"
          placeholder={t("Password")}
          className={`${!password.valid ? "inp-error" : ""}`}
          onChange={filterPassword}
          ref={passwordRef}
        />
        {!password.valid && (
          <>
            <p className="password-required">
              <FontAwesomeIcon
                icon={password.minLength ? faCheckCircle : faTimes}
              />{" "}
              Password must be atleast 8 characters *
            </p>
            <p className="password-required">
              <FontAwesomeIcon
                icon={password.upperCase ? faCheckCircle : faTimes}
              />{" "}
              Password must be 1 Upper Character *
            </p>
            <p className="password-required">
              <FontAwesomeIcon
                icon={password.lowerCase ? faCheckCircle : faTimes}
              />{" "}
              Password must be 1 Lower Character *
            </p>
            <p className="password-required">
              <FontAwesomeIcon
                icon={password.numberCase ? faCheckCircle : faTimes}
              />{" "}
              Password must be 1 Number Character *
            </p>
          </>
        )}
      </div>
      <div className="input-group">
        <figure className="login-icon">
          <img src="/images/svg/shieldkey.svg" />
        </figure>
        <input
          type="password"
          placeholder={t("ConfirmPassword")}
          className={`${!confirm ? "inp-error" : ""}`}
          onChange={filterConfirmPassword}
          ref={confirmRef}
        />
        <p className="password-required">
          * Password and confirm password must be match.
        </p>
      </div>
      <div className="input-group">
        <figure className="login-icon">
          <img src="/images/svg/signature.svg" />
        </figure>
        <input type="text" placeholder={t("DisplayName")} ref={displayRef} />
      </div>
      <div className="rows">
        <div />
        <div className="forget-password">
          <Link className="link" to="/login">
            {t("AlreadyHaveAnAccount")}
          </Link>
        </div>
      </div>
      <button type="button" className="btn-signin" onClick={signUpHandler}>
        {t("SignUpButton")}
      </button>
      {/* <div className="register-section">
        <h3 className="register-title">{t("OrSignInWithSocial")}</h3>
        <div className="socials">
          <button type="button" className="btn-socials facebook">
            <img src="/images/svg/facebook.svg" />
          </button>
          <button type="button" className="btn-socials google">
            <img src="/images/svg/google.svg" />
          </button>
        </div>
      </div> */}
      <div className="powerby"> COPY RIGHT @2023 MANAMI DELIVERY CO,LTD</div>
    </form>
  );
};

export default RegisterPage;
