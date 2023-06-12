import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./modal.scss";
import { appActions } from "../../../store/app-slice";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faEdit, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import ButtonUI from "../../../components/ui/button/button";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";

const EditConfigModal = (props) => {
  const { t } = useTranslation("config-page");
  const { isOpenModal, modalData, dimension } = props;

  const typeRef = useRef()
  const titleRef = useRef()
  const dimensionRef = useRef()

  useEffect(() => {
  
  }, [modalData]);

  if (!isOpenModal) {
    return <Fragment></Fragment>;
  }
  const closeModalHandler = () => {
    props.setModal(false);
  }

  const saveModalHandler = (token) => {
    let data = {
      type: typeRef.current.value,
      title: titleRef.current.value,
      dimension: dimensionRef.current.value
    }

    if(data.title.length < 1) {
      titleRef.current.classList.add('inp-error')
      titleRef.current.focus()
    } else {
      titleRef.current.classList.remove('inp-error')
    }
    
    if(data.type.length < 1) {
      typeRef.current.classList.add('inp-error')
      typeRef.current.focus()
    } else {
      typeRef.current.classList.remove('inp-error')
    }

    if(data.type.length < 1 || data.title.length < 2 ) {
      return false;
    }

    /* fetch data ตรงนี้ */
    props.setModal(false);
    props.onFetch(data);
  }

  return (
    <Modal
      open={isOpenModal}
      onClose={closeModalHandler}
      className={"modal-add-Config"}
      aria-labelledby="modal-add-Config"
      aria-describedby="" >
      <Box className="modal-custom">
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faEdit} />
            <span>{t("modalEdit")}</span>
          </h2>
          <IconButton
            className="param-generator"
            color="error"
            sx={{ p: "10px" }}
            onClick={closeModalHandler}
          >
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </div>
        <div className="modal-body">
          <fieldset className="modal-fieldset">
            <legend className="modal-legend"> {t("modalEditConfig")}</legend>

            <div className="modal-config-content">
              <div className="input-group">
                <label className="group-label">Type</label>
                <input className="inp-text" ref={typeRef} defaultValue={modalData.type}  />
              </div>
              <div className="input-group">
                <label className="group-label">Title</label>
                <input className="inp-text" ref={titleRef} defaultValue={modalData.title}   />
              </div>
              <div className="input-group">
                <label className="group-label">Dimension</label>
                <input className="inp-text" ref={dimensionRef} defaultValue={modalData.dimension}  />
              </div>
          
            </div>
          </fieldset>
        </div>
        <div className="modal-footer">
          <ButtonUI
            className="btn-create"
            on="save"
            width="lg"
            onClick={saveModalHandler} >
            {t("modalSave")}
          </ButtonUI>
        </div>
      </Box>
    </Modal>
  );
};

export default EditConfigModal;
