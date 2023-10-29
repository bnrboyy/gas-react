import React, { useState, Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../../store/app-slice";
import { authActions } from "../../../store/auth-slice";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./sidebar.scss";
import {
  faCaretDown,
  faFolderOpen,
  faListOl,
  faSignsPost,
  faSitemap,
  faNewspaper,
  faGamepad,
  faBoxOpen,
  faImages,
  faTools,
  faLanguage,
  faUserShield,
  faCircleInfo,
  faStreetView,
  faInbox,
  faComments,
  faFileCsv,
  faHome,
  faIcons,
  faEnvelope,
  faBook,
  faFileLines,
  faTruckFast,
  faHomeUser,
  faBox,
  faBoxesStacked,
  faBuildingColumns,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { Badge, Button } from "@mui/material";
import NavLink from "./navlink";
import { Link } from "react-router-dom";

const SidebarComponent = (props) => {
  const { t, i18n } = useTranslation("sidebar");

  const dispatch = useDispatch();
  const uPermission = useSelector((state) => state.auth.userPermission);
  const pagesAllow = useSelector((state) => state.app.pages);
  const newOrders = useSelector((state) => state.app.newOrders);

  const languageSelectHandler = (lang) => {
    i18n.changeLanguage('th');
    dispatch(appActions.changeLanguage('th'));
  };

  const toggleSubMenu = (event) => {
    const subMenu = event.target.closest(".has-child");
    subMenu.classList.toggle("opened");
  };

  const closeSidebarhandler = (e) => {
    /* ย่อแถบทำงานเฉพาะ width < 768 */
    let elRoot = document.querySelector("#root");
    if (elRoot && elRoot.offsetWidth <= 900) {
      props.collapseHandler(true);
    }
  };

  return (
    <aside className="aside">
      <nav>
        <Link className="sidenav-header" to="/">
          <figure className="figure-image max-w-[50px]">
            <img
              src="images/icons/gas-logo.png"
              className="website-logo"
            />
          </figure>
          <div className="website-powerby">
            <p>JuppGas Delivery</p>
            <p className="sub-website">{t("Managements")}</p>
          </div>
        </Link>
        {/* <hr className="line-section" />
        <div className="title-section">{t("Languages")}</div>
        <div className="language-selection">
          {activateLanguage.map((lang) => (
            <Button
              variant="outlined"
              key={lang}
              onClick={(e) => languageSelectHandler(lang)}
              className={`btn-lang ${
                lang.toLowerCase() === selectedLanguage.toLowerCase() ? "selected" : ""
              }`}
            >
              {lang}
            </Button>
          ))}
        </div> */}
        <div className="sidenav-main">
          {pagesAllow.groups.notify && (uPermission.superAdmin || uPermission.rider) && (
            <Fragment>
              <hr className="line-section gap " />
              <div className="title-section">{t("NotificationTitle")}</div>
              <ul className="nav-menu">
                {pagesAllow.dashboard && uPermission.superAdmin && (
                  <li>
                    <NavLink
                      onClick={closeSidebarhandler}
                      to="/dashboard"
                      className="navlink"
                      title={t("dashboardPage")}
                      liClass="menu-link"
                    >
                      <figure className="faIcon">
                        <FontAwesomeIcon icon={faGamepad} />
                      </figure>
                      <div className="menu-title">{t("dashboardPage")}</div>
                    </NavLink>
                  </li>
                )}
                {pagesAllow.orders && (
                  <NavLink
                    onClick={closeSidebarhandler}
                    to="/orders"
                    className={`navlink `}
                    title={t("OrdersPage")}
                    liClass="menu-link"
                    style={{ alignItems: "center" }}
                  >
                    <figure className="faIcon">
                      <FontAwesomeIcon icon={faTruckFast} />
                    </figure>
                    <div className="menu-title">{t("OrdersPage")}</div>
                    <Badge
                      style={{ marginLeft: "1rem" }}
                      badgeContent={newOrders ? newOrders : "0"}
                      color="error"
                    />
                  </NavLink>
                )}
                {pagesAllow.messages && (
                  <li>
                    <NavLink
                      onClick={closeSidebarhandler}
                      to="/messages"
                      className={`navlink `}
                      title={t("MessagesPage")}
                      liClass="menu-link"
                    >
                      <figure className="faIcon">
                        <FontAwesomeIcon icon={faComments} />
                      </figure>
                      <div className="menu-title">{t("MessagesPage")}</div>
                    </NavLink>
                  </li>
                )}
                {pagesAllow.inbox && (
                  <li>
                    <NavLink
                      onClick={closeSidebarhandler}
                      to="/inbox"
                      className={`navlink `}
                      title={t("InboxPage")}
                      liClass="menu-link"
                    >
                      <figure className="faIcon">
                        <FontAwesomeIcon icon={faInbox} />
                      </figure>
                      <div className="menu-title">{t("InboxPage")}</div>
                    </NavLink>
                  </li>
                )}
                {pagesAllow.subscribe && (
                  <li>
                    <NavLink
                      onClick={closeSidebarhandler}
                      to="/subscribe"
                      className={`navlink `}
                      title={t("SubscribePage")}
                      liClass="menu-link"
                    >
                      <figure className="faIcon">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </figure>
                      <div className="menu-title">{t("SubscribePage")}</div>
                    </NavLink>
                  </li>
                )}
              </ul>
            </Fragment>
          )}

          {pagesAllow.groups.product && (uPermission.superAdmin || uPermission.admin) && (
            <Fragment>
              <hr className="line-section gap" />
              <ul className="nav-menu">
                <div className="title-section">{t("ProductsTitleMenu")}</div>
               
                {pagesAllow.employee &&
                  (
                    <NavLink
                      onClick={closeSidebarhandler}
                      to="/productcate"
                      className={`navlink `}
                      title={t("EmployeePage")}
                      liClass="menu-link"
                    >
                      <figure className="faIcon">
                      <FontAwesomeIcon icon={faBox} />
                      </figure>
                      <div className="menu-title">{t("ProductCategory")}</div>
                    </NavLink>
                  )}
                {pagesAllow.employee &&
                  (uPermission.superAdmin || uPermission.admin) && (
                    <NavLink
                      onClick={closeSidebarhandler}
                      to="/products"
                      className={`navlink `}
                      title={t("EmployeePage")}
                      liClass="menu-link"
                    >
                      <figure className="faIcon">
                        <FontAwesomeIcon icon={faBoxesStacked} />
                      </figure>
                      <div className="menu-title">{t("ProductsPage")}</div>
                    </NavLink>
                  )}
              </ul>
            </Fragment>
          )}
          {pagesAllow.groups.report && (uPermission.superAdmin || uPermission.admin) && (
            <Fragment>
              <hr className="line-section gap" />
              <div className="title-section">{t("ReportTitle")}</div>
              <ul className="nav-menu">
                {pagesAllow.reports && (
                  <NavLink
                    onClick={closeSidebarhandler}
                    to="/reports"
                    className={`navlink `}
                    title={t("ReportPage")}
                    liClass="menu-link"
                  >
                    <figure className="faIcon">
                      <FontAwesomeIcon icon={faFileCsv} />
                    </figure>
                    <div className="menu-title">{t("ReportPage")}</div>
                  </NavLink>
                )}
              </ul>
            </Fragment>
          )}

          {pagesAllow.groups.system && (uPermission.superAdmin || uPermission.admin) && (
            <Fragment>
              <hr className="line-section gap" />
              <div className="title-section">{t("SettingsTitle")}</div>
              <ul className="nav-menu">
                {pagesAllow.webinfo && (
                  <NavLink
                    onClick={closeSidebarhandler}
                    to="/webinfo"
                    className={`navlink `}
                    title={t("WebInfoPage")}
                    liClass="menu-link"
                  >
                    <figure className="faIcon">
                    <FontAwesomeIcon icon={faScrewdriverWrench} />
                    </figure>
                    <div className="menu-title">ตั้งค่าเว็บไซต์</div>
                  </NavLink>
                )}
                {pagesAllow.configs && uPermission.superAdmin && (
                  <NavLink
                    onClick={closeSidebarhandler}
                    to="/configs"
                    className={`navlink `}
                    title={t("ConfigPage")}
                    liClass="menu-link"
                  >
                    <figure className="faIcon">
                    <FontAwesomeIcon icon={faBuildingColumns} />
                    </figure>
                    <div className="menu-title">จัดการบัญชีธนาคาร</div>
                  </NavLink>
                )}
                {pagesAllow.admins &&
                  (uPermission.superAdmin || uPermission.admin || uPermission.officer) && (
                    <NavLink
                      onClick={closeSidebarhandler}
                      to="/admins"
                      className={`navlink `}
                      title={t("AdminPage")}
                      liClass="menu-link"
                    >
                      <figure className="faIcon">
                        <FontAwesomeIcon icon={faUserShield} />
                      </figure>
                      <div className="menu-title">{t("AdminPage")}</div>
                    </NavLink>
                  )}
              </ul>
            </Fragment>
          )}
        </div>
        {/* <hr className="line-section gap" /> */}
      </nav>
      {/* <ul className="nav-menu mini-bar" style={{ marginTop: "auto", paddingRight: ".5rem" }}>
        <li className="menu-link footerLink">
          <a href={webPath} target="_blank" className="navlink pink-btn " title={t("GoToWebSite")}>
            <figure className="faIcon">
              <FontAwesomeIcon icon={faHome} />
            </figure>
            <span className="menu-title">{t("GoToWebSite")}</span>
          </a>
        </li>
      </ul>
      <p className="powerBy">Backoffice v. 1 </p> */}
    </aside>
  );
};

export default SidebarComponent;
