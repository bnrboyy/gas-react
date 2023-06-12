import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSelector } from "react-redux";
import ButtonUI from "../../../components/ui/button/button";
import "./modal-admin.scss";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const modalSwal = withReactContent(Swal);

const ModalEditAdmin = (props) => {
  const { modalData, setIsOpenModal } = props
  const { t } = useTranslation("admin-page");
  const uPermission = useSelector((state) => state.auth.userPermission);
  const [data, setData] = useState(modalData);
  const languageRef = useRef([]);

  const closeModalHandler = () => {
    setIsOpenModal(false);
  }

  const languageChangeHandler = () => {
    languageRef.current.map(el => {
      el.closest('.language-body').classList.remove('error')
    })
  }
  const saveModalHandler = () => {
    /* fetch post data ตรงนี้ */
    const formData = new FormData();
    if(languageRef.current.length > 0) {
      const language = languageRef.current.reduce((oldData, newData) => {
        if(newData.checked) {
          return (oldData !== "")?`${oldData},${newData.value}`:newData.value;
        } else {
          return oldData;
        }
      }, "")
      formData.append("language", language)
      if(language === ""){
        document.querySelector('.language-body').classList.add('error')
        return false
      }
    } 
    formData.append("display_name", data.displayName)
    formData.append("email", data.email)
    formData.append("image", data.image)
    formData.append("registered", data.registered)
    formData.append("role_id", data.roleId)
    formData.append("role_name", data.roleName)
    formData.append("status", data.status)
    formData.append("token", data.token)
    formData.append("updated_at", data.updated_at)
    formData.append("username", data.username)
      
    modalFetchHandler(formData)
  }

  const modalFetchHandler = async (formData) => {
    await axios.post(`admin/edit`, formData, {
      headers: {
        "Content-Type" :"multipart/form-data",
      }
    }).then( response => {
      props.refreshData()
      setIsOpenModal(false)
      modalSwal.fire({
        position: "center",
        width: 450,
        icon: "success",
        title: "Successful",
        text: "The admin data have been updated.",
        showConfirmButton: false,
        timer: 1500,
      })
   
    }, error => {
      
      setIsOpenModal(false)
      modalSwal.fire({
        position: "center",
        width: 450,
        icon: "error",
        title: "Can't update data.",
        text: "Error Something went wrong.",
        showConfirmButton: false,
        timer: 1500,
      })
    })
  }

  if (!data) return <></>;

  return (
    <Modal
      open={true}
      onClose={closeModalHandler}
      className={"modal-edit-admin-data"}
      aria-labelledby="modal-edit-admin-data"
      aria-describedby="modal-edit-admin-data" >
      <Box className="modal-custom">
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faEdit} />
            <span>{t("modalEditAdminh2")}</span>
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
            <legend className="modal-legend">{t("modalEditAdminTitle")}</legend>

            <div className="input-group-list">
              <div className="input-group">
                <label className="group-label">{t("modal-name")}</label>
                <input
                  className="inp-text"
                  placeholder="DisplayName"
                  value={data.displayName}
                  onChange={(e) =>
                    setData((prev) => {
                      return { ...prev, displayName: e.target.value };
                    })
                  }
                />
              </div>
              <div className="input-group">
                <label className="group-label">{t("modal-email")}</label>
                <input
                  className="inp-text"
                  placeholder="example@email.com"
                  value={data.email}
                  disabled={true}
                />
              </div>
              <div className="input-group">
                <label className="group-label">{t("modal-role")}</label>
                <select
                  id="admin-role"
                  className="inp-slc"
                  value={data.roleId}
                  onChange={(e) =>
                    setData((prev) => {
                      return { ...prev, roleId: e.target.value };
                    })
                  }
                >
                  {uPermission.superAdmin && (
                    <option value="1">{t("modal-superadmin")}</option>
                  )}
                  {uPermission.admin && (
                    <option value="2">{t("modal-admin")}</option>
                  )}
                  {uPermission.officer && (
                    <option value="3">{t("modal-officer")}</option>
                  )}
                  {uPermission.user && (
                    <option value="4">{t("modal-user")}</option>
                  )}
                </select>
              </div>
              <div className="input-group">
                <label className="group-label">{t("modal-status")}</label>
                <select
                  id="admin-status"
                  className="inp-slc"
                  value={data.status}
                  onChange={(e) =>
                    setData((prev) => {
                      return { ...prev, status: e.target.value };
                    })
                  }
                >
                  <option value={1}>{t("modal-active")}</option>
                  <option value={2}>{t("modal-pending")}</option>
                  <option value={3}>{t("modal-banned")}</option>
                  <option value={4}>{t("modal-inactive")}</option>
                </select>
              </div>
              <div className="input-group">
                <label className="group-label">{t("modal-language")}</label>
                <div className="language-body">
                  {data.languageActive.length > 0 &&
                    data.languageActive.map((lang, index) => (
                      <div className="language-group" key={lang.name}>
                        <div className="checkbox-title">
                          <input
                            onChange={languageChangeHandler}
                            className="inp-chk"
                            type="checkbox"
                            id={`inp-chk-${lang.name}`}
                            value={lang.name}
                            defaultChecked={lang.value}
                            ref={(el)=> (languageRef.current[index] = el)}
                          />
                        </div>
                        <label
                          htmlFor={`inp-chk-${lang.name}`}
                          disabled
                          className="title" >
                          {t(`${lang.name}-lang`)}
                        </label>
                        <div className="abbv">{lang.name.toUpperCase()}</div>
                      </div>
                  ))}
                  <p className="language-error">* Atleast one language must be choosen.</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="modal-footer">
          <ButtonUI
            className="btn-save"
            on="save"
            width="md"
            onClick={saveModalHandler} >
            {t("Save")}
          </ButtonUI>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalEditAdmin;
