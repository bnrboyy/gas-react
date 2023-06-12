import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import "./profile.scss";
import { faClipboardUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HeadPageComponent from "../../../components/layout/headpage/headpage";

const MOCKUP_ADMINDATA = [
  {id: 1, token: "editsomething", email: "admin@gmail.com", name: "admin Name 1" , image: "/images/user.jpg" , status: 1, roleName: "Superadmin", roleId: 1},
]

const ProfileAdminPage = () => {
  const { t } = useTranslation(["profile-page"]);
  const dispatch = useDispatch();

  return (
    <section id="admin-page">
      <HeadPageComponent
        h1={"ProfilePage"}
        icon={<FontAwesomeIcon icon={faClipboardUser} />}
        breadcrums={[{ title: "ProfilePage", link: false }]} />
        <div className="card-control">
        </div>
    </section>
  );
};

export default ProfileAdminPage;
