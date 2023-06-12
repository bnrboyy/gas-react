import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { faEdit, faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonUI from "../button/button";
import Swal from "sweetalert2";

import "./content-card-order.scss";

const ContentCardOrderUI = ({onEditClick, onDeleteClick, className, children}) => {
  const { t } = useTranslation("slide-page");

  return (
    <div className={`card-box asRow ${className}`}>
      <div className="box-left">
        <div className="box-details">{children}</div>
      </div>
      <div className="box-right">
        <div className="box-action">
          <ButtonUI
            onClick={onEditClick}
            on="show"
            className="btn-custom onShow"
            width="md"
            icon={<FontAwesomeIcon icon={faEye} />}
          >
            {t("Show")}
          </ButtonUI>
          <ButtonUI
            onClick={onDeleteClick}
            on="delete"
            className="btn-custom onDelete"
            icon={<FontAwesomeIcon icon={faTrash} />}
          >
            {t("Delete")}
          </ButtonUI>
        </div>
      </div>
    </div>
  );
};

export default ContentCardOrderUI;
