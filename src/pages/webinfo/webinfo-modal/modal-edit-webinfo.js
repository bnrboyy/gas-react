import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { webinfoAdd, webinfoUpdate } from "../../../services/webinfo.service";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import ButtonUI from "../../../components/ui/button/button";

import "./modal-webinfo.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faEdit, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";

const ModalEditWebinfo = (props) => {
  const { t } = useTranslation("webinfo-page");
  const { isOpenModal, modalData, isEditMode } = props;
  const language = useSelector(state => state.app.language)
  const [priorityNumber , setPriorityNumber] = useState(null)
  const [infoDisplay , setInfoDisplay] = useState(false)
  let isFetching = false;

  const paramRef = useRef();
  const titleRef = useRef();
  const valueRef = useRef();
  const linkRef = useRef();
  const iframeRef = useRef();
  const attributeRef = useRef();

  useEffect(() => {
    if(modalData && !priorityNumber) {
      setPriorityNumber(modalData.priority) 
      setInfoDisplay(modalData.display) 
    }
  }, [props.tabId, modalData, priorityNumber]);

  if (!isOpenModal) return <></>; 

  const closeModalHandler = () => {
    props.setIsOpenEditModal(false);
  }

  const saveEditModalHandler = async () => {
    /* fetch data ตรงนี้ */
    const data = {
      title: titleRef.current.value,
      value: valueRef.current.value,
    }

    if(titleRef.current.value.length < 1) {
      titleRef.current.classList.add('inp-error')
      return false;
    } else {
      titleRef.current.classList.remove('inp-error')
    }

    if(!isFetching) {
      isFetching = true
      webinfoUpdate(modalData.id, data).then( res => {
        if(res.status) {
          props.refresh()
        }
        isFetching = false;
        props.setIsOpenEditModal(false);
        SwalUI({status: res.status, description: res.description})
      })
    }
  }
  
  return (
    <Modal
      open={isOpenModal}
      onClose={closeModalHandler}
      className={"modal-webinfo-data"}
      aria-labelledby="modal-webinfo-data"
      aria-describedby="modal-webinfo-data" >
      <Box className="modal-custom">
        <div className="modal-header">
          {!isEditMode && <h2><FontAwesomeIcon icon={faPlus} /> <span>{t("ModalEditWebinfoH2-add")}</span></h2>}
          {isEditMode && <h2><FontAwesomeIcon icon={faEdit} /> <span>{t("ModalEditWebinfoH2-edit")}</span></h2>}
          <IconButton
            className="param-generator"
            color="error"
            sx={{ p: "10px" }}
            onClick={closeModalHandler} >
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </div>
        <div className="modal-body">
          <fieldset className="modal-fieldset">
            <legend className="modal-legend">{t("ModalEditWebinfoTitle")}</legend>
            <div className="modal-content">
              <div className="input-group"> 
                <label className="title">คำอะธิบาย :</label>
                <input className="inp-text" ref={titleRef} placeholder="Description" defaultValue={modalData.description} />
              </div> 
              <div className="input-group"> 
                <label className="title">กำหนดค่า :</label>
                <textarea className="inp-textarea" ref={valueRef} placeholder="Value" defaultValue={modalData.value}></textarea>
              </div> 
            </div>
          </fieldset>
        </div>
        <div className="modal-footer">
          {isEditMode && (
            <ButtonUI
              className="btn-save"
              on="save"
              width="md"
              onClick={saveEditModalHandler}>{t("btnSave")}</ButtonUI>
          )}
        </div>
      </Box>
    </Modal>
  );
}
export default ModalEditWebinfo;
