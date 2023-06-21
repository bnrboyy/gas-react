import React from "react";
import { useTranslation } from "react-i18next";

import './headpage.scss';
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const HeadPageComponent = ({ h1, icon, breadcrums }) => { 
    const language = useSelector((state) => state.app.language)
    const { t } = useTranslation("sidebar")

    return (
        <div className="head-page">
            <h1 className="title-page">{icon} {t(h1)}</h1>
            <div className="breadcrumbs">
            <Breadcrumbs aria-label="breadcrumb">
                <Link to="/" > <FontAwesomeIcon icon={faHome} /> {t("Home")} </Link>
                {breadcrums && breadcrums.map(nav => (nav.link)?<Link key={nav.title} to={nav.link} >{t(nav.title)}</Link>: <span key={nav.title} >{t(nav.title)}</span>)}
            </Breadcrumbs>    
            </div>
        </div>
    )
}

export default HeadPageComponent;
