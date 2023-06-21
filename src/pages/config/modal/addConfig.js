import React, { Fragment, useRef, useState } from "react";
import "./modal.scss";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

import ButtonUI from "../../../components/ui/button/button";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";

const AddConfigModal = (props) => {
  const { t } = useTranslation("config-page");
  const { isOpenModal, dimension, upload, placeholder } = props;
 
  const bankNameRef = useRef()
  const bankIdRef = useRef()
  const accountName = useRef()
  const uploadRef = useRef()
  const [uploadImage, setUploadImage] = useState("")

  if (!isOpenModal) {
    return <Fragment></Fragment>;
  }

  const closeModalHandler = () => {
    props.setOpenAddModal(false);
  }

  const saveModalHandler = () => {
    let data = {
      bankName:bankNameRef.current.value,
      accountName:accountName.current.value,
      bankId: bankIdRef.current.value,
      upload: (upload && uploadRef.current )?uploadRef.current.files:"",
    }

    if(data.bankName.length < 1) {
      bankNameRef.current.classList.add('inp-error')
      bankNameRef.current.focus()
      return false;
    } else {
      bankNameRef.current.classList.remove('inp-error')
    }
   
    if(data.accountName.length < 1) {
      accountName.current.classList.add('inp-error')
      accountName.current.focus()
      return false;
    } else {
      accountName.current.classList.remove('inp-error')
    }
    

    if(data.bankId.length < 1) {
      bankIdRef.current.classList.add('inp-error')
      bankIdRef.current.focus()
      return false;
    } else {
      bankIdRef.current.classList.remove('inp-error')
    }

    if(data.bankName.length < 1 || data.accountName.length < 2 ) {
      return false;
    }

    setUploadImage("");
    props.setOpenAddModal(false);
    props.onFetch(data);
  }

  const convertImagePreview = async (file) => {
    const image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
    setUploadImage(image)
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
            <FontAwesomeIcon icon={faPlus} />
            <span>{t("modalAdd")}</span>
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
            <legend className="modal-legend"> {"รายละเอียดธนาคาร"}</legend>

            <div className="modal-config-content">
              <div className="input-group">
                <label className="group-label">ชื่อธนาคาร</label>
                <input className="inp-text" placeholder={"กรอกชื่อธนาคาร"} ref={bankNameRef} />
              </div>
              <div className="input-group">
                <label className="group-label">ชื่อบัญชี</label>
                <input className="inp-text" placeholder={"กรอกชื่อบัญชี"} ref={accountName} />
              </div>
              <div className="input-group">
                <label className="group-label">เลขที่บัญชี</label>
                <input className="inp-text" placeholder={"กรอกเลขบัญชี"} ref={bankIdRef} />
              </div>
              {upload && (
                <div className="upload-image">
                  <ButtonUI 
                    onClick={(e) => uploadRef.current.click()} 
                    className={'uploadImageBtn'} 
                    icon={<FontAwesomeIcon icon={faCloudUploadAlt} /> } 
                    on="add" >{"เพิ่มรูปภาพ"}</ButtonUI>
                    {uploadImage !== "" &&  (
                      <figure className="figure-upload">
                        <img title='image' src={uploadImage} className="image-preview" />
                      </figure>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="inp-upload-file" 
                      ref={uploadRef} 
                      onChange={(e) => convertImagePreview(e.target.files[0])} />
                </div>
              )}
            </div>
          </fieldset>
        </div>
        <div className="modal-footer">
          <ButtonUI
            className="btn-create"
            on="create"
            width="md"
            onClick={saveModalHandler}    >
            {t("modalCreate")}
          </ButtonUI>
        </div>
      </Box>
    </Modal>
  );
};

export default AddConfigModal;
