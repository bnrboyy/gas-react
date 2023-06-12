import React, { useEffect, useRef, useState } from "react";
import "./modal-webinfo.scss";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faEdit, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";

import ButtonUI from "../../../components/ui/button/button";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Switch } from "@mui/material";
import { useSelector } from "react-redux";
import { webinfoCreate } from "../../../services/webinfo.service";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
const modalSwal = withReactContent(Swal);

const ModalAddWebinfo = (props) => {
  const { t } = useTranslation("webinfo-page");
  const { isOpenModal, modalData } = props;
  const language = useSelector(state => state.app.language)

  const [priorityNumber , setPriorityNumber] = useState(1)
  const [display , setDisplay] = useState(true)
  let isFetching = false;
  const paramRef = useRef();
  const titleRef = useRef();
  const valueRef = useRef();
  const linkRef = useRef();
  const iframeRef = useRef();
  const attributeRef = useRef();

  useEffect(() => {
 
  }, [props.tabId, priorityNumber]);

  if (!isOpenModal) return <></>;

  const closeModalHandler = () => {
    props.setIsOpenAddModal(false);
  }

  const saveModalHandler = () => {
    let valid = {
      param: (paramRef.current.value.length < 3),
      title: (titleRef.current.value.length < 1)
    }
    if(valid.param) {
      paramRef.current.classList.add('inp-error')
    } else {
      paramRef.current.classList.remove('inp-error')
    }
    
    if(valid.title) {
      titleRef.current.classList.add('inp-error')
    } else {
      titleRef.current.classList.remove('inp-error')
    }

    if(valid.param || valid.title) {
      return false
    }

    /* fetch data ตรงนี้ */
    modalFetchHandler();
    props.setIsOpenAddModal(false);
  }

  const modalFetchHandler = async () => {
    const data = {
      language: language,
      infoType: props.tabId,
      param_name: paramRef.current.value,
      title: titleRef.current.value,
      value: valueRef.current.value,
      link: linkRef.current.value,
      iframe: iframeRef.current.value,
      attribute: attributeRef.current.value,
      priority: priorityNumber,
      display: (display)?1:0,
    }
  
    if(!isFetching) {
      isFetching = true
      webinfoCreate(data).then( res => {
        isFetching = false
        if(res.status){ 
          props.refresh()
        }
        SwalUI({status: res.status, description: res.description})
      })
    }
  }

  const priorityHandler = (isAdding) => {
    if(isAdding) {
      setPriorityNumber(priorityNumber + 1)
    } else {
      if(priorityNumber > 1) {
        setPriorityNumber(priorityNumber - 1)
      }
    }
  }

  return (
    <Modal
      open={isOpenModal}
      onClose={closeModalHandler}
      className={"modal-webinfo-data"}
      aria-labelledby="modal-webinfo-data"
      aria-describedby="modal-webinfo-data"
    >
      <Box className="modal-custom">
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faEdit} />
            <span>{t("ModalAddWebinfoH2")}</span>
          </h2>
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
            <legend className="modal-legend">
              {t("ModalAddWebinfoTitle")}
            </legend>

            <div className="modal-content">
              <div className="input-group">
                <label className="title">Param : ( ใช้สำหรับ developer )</label>
                <input className={`inp-text `} ref={paramRef} placeholder="Param" />
              </div>
              <div className="input-group">
                <label className="title">Description :</label>
                <input className={`inp-text`} ref={titleRef}  placeholder="Title" />
              </div>
              <div className="input-group">
                <label className="title">Value :</label>
                <textarea className="inp-textarea"  ref={valueRef}  placeholder="Value" ></textarea>
              </div>
              <div className="input-group">
                <label className="title">Link :</label>
                <textarea className="inp-textarea"  ref={linkRef}  placeholder="Link" ></textarea>
              </div>
              <div className="input-group">
                <label className="title">iframe/embed :</label>
                <textarea className="inp-textarea"  ref={iframeRef}  placeholder="iframe/embed"></textarea>
              </div>
              <div className="input-group">
                <label className="title">Attribute :</label>
                <input className="inp-text"  ref={attributeRef}  placeholder="Attribute" />
              </div>
              <div className="input-group-action">
                <ButtonUI color="error" onClick={(e) => priorityHandler(false)}>
                  <FontAwesomeIcon icon={faMinus} />
                </ButtonUI>
                <span className="title">Priority {priorityNumber}</span>
                <ButtonUI onClick={(e) => priorityHandler(true)}>
                  <FontAwesomeIcon icon={faAdd} />
                </ButtonUI>
              </div>
              <div className="input-group-action">
                <label>Display</label>
                <Switch defaultChecked onChange={(e) => setDisplay(!display)}/>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="modal-footer">
          <ButtonUI
            className="btn-save"
            on="save"
            width="md"
            onClick={saveModalHandler}
          />
        </div>
      </Box>
    </Modal>
  );
};
export default ModalAddWebinfo;
