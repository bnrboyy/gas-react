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
 
  const typeRef = useRef()
  const titleRef = useRef()
  const dimensionRef = useRef()
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
      type:typeRef.current.value,
      title:titleRef.current.value,
      dimension: (dimension)?dimensionRef.current.value:"",
      upload: (upload && uploadRef.current )?uploadRef.current.files:"",
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
            <legend className="modal-legend"> {t("modalAddConfig")}</legend>

            <div className="modal-config-content">
              <div className="input-group">
                <label className="group-label">type</label>
                <input className="inp-text" placeholder={placeholder.type} ref={typeRef} />
              </div>
              <div className="input-group">
                <label className="group-label">title</label>
                <input className="inp-text" placeholder={placeholder.title} ref={titleRef} />
              </div>
              {dimension && (
                <div className="input-group">
                  <label className="group-label">Dimension</label>
                  <input className="inp-text" placeholder={placeholder.dimension} ref={dimensionRef} />
                </div>
              )}
              {upload && (
                <div className="upload-image">
                  <ButtonUI 
                    onClick={(e) => uploadRef.current.click()} 
                    className={'uploadImageBtn'} 
                    icon={<FontAwesomeIcon icon={faCloudUploadAlt} /> } 
                    on="add" >{t("BtnUploadImage")}</ButtonUI>
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
