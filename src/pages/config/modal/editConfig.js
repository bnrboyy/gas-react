import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./modal.scss";
import { appActions } from "../../../store/app-slice";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faMinus,
  faPlus,
  faXmark,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";

import ButtonUI from "../../../components/ui/button/button";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";

const EditConfigModal = (props) => {
  const { t } = useTranslation("config-page");
  const { isOpenModal, modalData, bankData } = props;
  const uploadPath = useSelector((state) => state.app.uploadPath);

  const [uploadImage, setUploadImage] = useState("");

  const bankNameRef = useRef();
  const bankIdRef = useRef();
  const accountName = useRef();
  const uploadRef = useRef();
  const currentImg = bankData.bank_image;

  useEffect(() => {}, [modalData]);

  if (!isOpenModal) {
    return <Fragment></Fragment>;
  }
  const closeModalHandler = () => {
    props.setModal(false);
    setUploadImage("")
  };

  const saveModalHandler = (_id) => {
    let data = {
      id: bankData.id,
      bankName: bankNameRef.current.value,
      accountName: accountName.current.value,
      bankId: bankIdRef.current.value,
      upload: props.upload && uploadRef.current ? uploadRef.current.files : "",
    };

    if (data.bankName.length < 1) {
      bankNameRef.current.classList.add("inp-error");
      bankNameRef.current.focus();
      return false;
    } else {
      bankNameRef.current.classList.remove("inp-error");
    }

    if (data.accountName.length < 1) {
      accountName.current.classList.add("inp-error");
      accountName.current.focus();
      return false;
    } else {
      accountName.current.classList.remove("inp-error");
    }

    if (data.bankId.length < 1) {
      bankIdRef.current.classList.add("inp-error");
      bankIdRef.current.focus();
      return false;
    } else {
      bankIdRef.current.classList.remove("inp-error");
    }

    if (data.bankName.length < 1 || data.accountName.length < 2) {
      return false;
    }

    setUploadImage("");
    props.setModal(false);
    props.onUpdate(data);
  };

  const convertImagePreview = async (file) => {
    const image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    setUploadImage(image);
  };

  return (
    <Modal
      open={isOpenModal}
      onClose={closeModalHandler}
      className={"modal-add-Config"}
      aria-labelledby="modal-add-Config"
      aria-describedby=""
    >
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
            <legend className="modal-legend"> {"รายละเอียดธนาคาร"}</legend>
            <div className="modal-config-content">
              <div className="input-group">
                <label className="group-label">ชื่อธนาคาร</label>
                <input
                  defaultValue={bankData.bank_name}
                  className="inp-text"
                  placeholder={"กรอกชื่อธนาคาร"}
                  ref={bankNameRef}
                />
              </div>
              <div className="input-group">
                <label className="group-label">ชื่อบัญชี</label>
                <input
                  defaultValue={bankData.bank_account}
                  className="inp-text"
                  placeholder={"กรอกชื่อบัญชี"}
                  ref={accountName}
                />
              </div>
              <div className="input-group">
                <label className="group-label">เลขที่บัญชี</label>
                <input
                  defaultValue={bankData.bank_number}
                  className="inp-text"
                  placeholder={"กรอกเลขบัญชี"}
                  ref={bankIdRef}
                />
              </div>
              <div className="upload-image">
                <ButtonUI
                  onClick={(e) => uploadRef.current.click()}
                  className={"uploadImageBtn"}
                  icon={<FontAwesomeIcon icon={faCloudUploadAlt} />}
                  on="add"
                >
                  {"เปลี่ยนรูปภาพ"}
                </ButtonUI>
                <figure className="figure-upload">
                  <img
                    title="image"
                    src={
                      uploadImage !== "" ? uploadImage : uploadPath + currentImg
                    }
                    className="image-preview"
                  />
                </figure>
                <input
                  type="file"
                  accept="image/*"
                  className="inp-upload-file"
                  ref={uploadRef}
                  onChange={(e) => convertImagePreview(e.target.files[0])}
                />
              </div>
            </div>
          </fieldset>
        </div>
        <div className="modal-footer">
          <ButtonUI
            className="btn-create"
            on="save"
            width="lg"
            onClick={() => saveModalHandler(bankData.id)}
          >
            {t("modalSave")}
          </ButtonUI>
        </div>
      </Box>
    </Modal>
  );
};

export default EditConfigModal;
