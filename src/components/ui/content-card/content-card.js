import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonUI from "../button/button";
import Swal from "sweetalert2";

import "./content-card.scss";

const ContentCardUI = (props) => {
  const {
    data,
    isRowDisplay,
    onAddClick,
    onEditClick,
    onDeleteClick,
    mainContent = false
  } = props;
  const { t } = useTranslation("slide-page");
  const { uploadPath, language } = useSelector((state) => state.app);
  const userPermission = useSelector((state) => state.auth.userPermission);

  const previewImageHandler = (e, image) => {
    if (image !== "" && !e.target.classList.contains("src-error")) {
      Swal.fire({
        customClass: {
          popup: "card-ui-preview-image-container",
          image: "preview-image"
        },
        showCloseButton: true,
        imageUrl: uploadPath + image,
        showConfirmButton: false
      });
    }
  };
  
  const imageErrorHandler = (e) => {
    e.target.setAttribute("src", "/images/no-image.png");
    e.target.classList.add("src-error");
  };
  return (
    <div
      className={`card-box ${isRowDisplay ? "asRow" : "asColumn"} ${
        props.className
      }`}
    >
      <div className="box-left">
        <figure className="fig-thumbnail">
          <img
            className="image"
            title={data.alt}
            src={uploadPath + data.image}
            onError={imageErrorHandler}
            onClick={(e) => previewImageHandler(e, data.image)}
          />
        </figure>
        <div className="box-details">{props.children}</div>
      </div>
      <div className="box-right">
        {data.language === language ? (
          <div className="box-action">
            <ButtonUI
              onClick={onEditClick}
              on="edit"
              className="btn-custom onEdit"
              icon={<FontAwesomeIcon icon={faEdit} />}
            >
              {t("Edit")}
            </ButtonUI>
            {!mainContent ? (
              <ButtonUI
                onClick={onDeleteClick}
                on="delete"
                className="btn-custom onDelete"
                icon={<FontAwesomeIcon icon={faTrash} />}
              >
                {t("Delete")}
              </ButtonUI>
            ) : (
              userPermission.superAdmin && (
                <ButtonUI
                  onClick={onDeleteClick}
                  on="delete"
                  className="btn-custom onDelete"
                  icon={<FontAwesomeIcon icon={faTrash} />}
                >
                  {t("Delete")}
                </ButtonUI>
              )
            )}
          </div>
        ) : (
          <ButtonUI
            onClick={onAddClick}
            on="add"
            className="btn-custom onAdd"
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            {t("Add")}
          </ButtonUI>
        )}
      </div>
    </div>
  );
};

export default ContentCardUI;
