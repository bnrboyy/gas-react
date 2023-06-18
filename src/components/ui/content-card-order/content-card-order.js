import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
  faEdit,
  faEye,
  faPlus,
  faTrash,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonUI from "../button/button";
import Swal from "sweetalert2";

import "./content-card-order.scss";

const ContentCardOrderUI = ({
  onEditClick,
  onCancelClick,
  className,
  children,
  statusId,
}) => {
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
            {"แสดง"}
          </ButtonUI>
          { statusId !== 4 && statusId !== 5 &&
            <ButtonUI
              onClick={onCancelClick}
              on="edit"
              className="btn-custom onDelete"
              icon={<FontAwesomeIcon icon={faBan} />}
            >
              {"ยกเลิก"}
            </ButtonUI>
          }
        </div>
      </div>
    </div>
  );
};

export default ContentCardOrderUI;
