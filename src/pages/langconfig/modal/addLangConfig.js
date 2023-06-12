import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { appActions } from "../../../store/app-slice";
import axios from "axios";

import "./modal.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faShuffle,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";

import { CopyToClipboard } from "react-copy-to-clipboard";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import { MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import ButtonUI from "../../../components/ui/button/button";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const modalSwal = withReactContent(Swal);

const AddLanguageConfig = (props) => {
  const { t } = useTranslation("langconfig");
  const dispatch = useDispatch();
  const { isOpenModal, modalData, activateLanguage } = props;
  const defaultLanguage = useSelector((state) => state.app.defaultLanguage);
  const pageAvailable = useSelector(
    (state) => state.app.frontOffice.pageAvailable
  );
  const randomString = useSelector((state) => state.app.randomString);
  const [langParam, setLangParam] = useState("");
  const [pageId, setPageId] = useState(0);
  const [buttonIsLoading, setButtonIsLoading] = useState(false);

  useEffect(() => {
    if (!langParam && modalData) {
      setLangParam(modalData.param);
    }
    if (!pageId && modalData) {
      setPageId(modalData.pageId);
      dispatch(appActions.randomString({ text: "", length: 15 }));
    }
  }, [modalData, langParam]);

  if (!isOpenModal) {
    return <Fragment></Fragment>;
  }
  const closeModalHandler = () => {
    props.setModal(false);
  };

  const saveModalHandler = async () => {
    setButtonIsLoading(true);
    const formData = new FormData();
    formData.append("param", modalData.param);
    formData.append("page", modalData.pageId);
    activateLanguage.map((ln) => {
      formData.append(ln, modalData[`${ln}`]);
    });
    const result = await axios.post(`language/create`, formData)
      .then(
        (response) => {
          return { status: true, description: response.data.description };
        },
        (error) => {
          return {
            status: false,
            description: error.response.data.description,
          };
        }
      );

    props.setModal(false);
    if (result.status) {
      props.updatedDate(new Date().toISOString());
      props.setRefreshData(true);

      modalSwal.fire({
          position: "center",
          width: 450,
          icon: "success",
          title: "Successful",
          text: result.description,
          showConfirmButton: false,
          timer: 1500,
        })
        .then(() => {
            setButtonIsLoading(false);
        });
    } else {
      modalSwal.fire({
        position: "center",
        width: 450,
        icon: "error",
        title: "Failed",
        text: result.description,
        showConfirmButton: false,
        timer: 1500,
      }).then(()=> {
        setButtonIsLoading(false);
      })
    }
  };

  const randomParameter = () => {
    const prevData = modalData;
    let customText = "";
    if (prevData.pageId > 0) {
      const filtered = pageAvailable.filter(
        (data) => data.id === prevData.pageId
      );
      customText = filtered.length > 0 ? filtered[0].title : "";
    }
    dispatch(appActions.randomString({ text: customText, length: 15 }));
    prevData.param = randomString;
    setLangParam(randomString);
    props.setModalData(prevData);
  };

  const inputPatchData = (e, arg) => {
    const prevData = modalData;
    prevData[arg] = e.target.value;
    props.setModalData(prevData);
  };

  return (
    <div>
      <Modal
        open={isOpenModal}
        onClose={closeModalHandler}
        className={"modal-add-langconfig"}
        aria-labelledby="modal-add-langconfig"
        aria-describedby=""
      >
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
              <legend className="modal-legend">
                
                {t("modalAddLangConfig")}
              </legend>
              <div className="input-group half">
                <FormControl className="inp " variant="standard">
                  {langParam !== "" && (
                    <CopyToClipboard text={langParam}>
                      <IconButton
                        className="param-copy"
                        color="primary"
                        sx={{ p: "10px" }}
                        title="click to copy"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </IconButton>
                    </CopyToClipboard>
                  )}

                  <InputLabel htmlFor="add-param">Parameter Name</InputLabel>
                  <Input
                    size="small"
                    id="add-param"
                    onChange={(e) => {
                      inputPatchData(e, "param");
                      setLangParam(e.target.value);
                    }} //
                    value={langParam}
                  />
                  <IconButton
                    className="param-generator"
                    color="primary"
                    sx={{ p: "10px" }}
                    title="random parameter"
                    onClick={randomParameter}
                  >
                    <FontAwesomeIcon icon={faShuffle} />
                  </IconButton>
                </FormControl>
              </div>
              <div className="input-group half">
                <FormControl className="inp " variant="standard">
                  <InputLabel id="add-page-label">Page Control</InputLabel>
                  <Select
                    labelId="add-page-label"
                    autoWidth
                    id="add-page"
                    label="Page Control"
                    size="small"
                    onChange={(e) => {
                      setPageId(e.target.value);
                      inputPatchData(e, "pageId");
                    }}
                    value={pageId}
                  >
                    <MenuItem value="0">None</MenuItem>
                    {pageAvailable &&
                      pageAvailable.map((menu) => (
                        <MenuItem key={menu.id} value={menu.id}>
                          {menu.title}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              {activateLanguage &&
                activateLanguage.map((lang) => (
                  <div className="input-group" key={`loop-${lang}`}>
                    <FormControl className="inp" variant="standard">
                      <InputLabel htmlFor={`add-${lang}`}>
                        
                        {lang.toUpperCase()}
                        {lang === defaultLanguage && "( Default )"}
                      </InputLabel>
                      <Input
                        size="small"
                        id={`add-${lang}`}
                        defaultValue={modalData[lang]}
                        onKeyUp={(e) => inputPatchData(e, lang)}
                      />
                    </FormControl>
                  </div>
                ))}
            </fieldset>
          </div>
          <div className="modal-footer">
            <ButtonUI
              loader={true}
              isLoading={buttonIsLoading}
              className="btn-create"
              on="create"
              width="md"
              onClick={saveModalHandler}
            >
              {t("modalCreate")}
            </ButtonUI>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AddLanguageConfig;
