import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import ButtonUI from "../../../components/ui/button/button";
import { useSelector } from "react-redux";

import "./product-cate-add.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faRedo } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Modal, Switch } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { svCreateProductCate } from "../../../services/product-category.service";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";

const displayLabel = { inputProps: { "aria-label": "display switch" } };

const ProductCateModalAdd = (props) => {
  const addDataDefault = {
    id: null,
    title: "",
    details: "",
    display: false,
    language: "",
    thumbnail_alt: "",
    thumbnail_link: "",
    thumbnail_title: "",
    is_food: false
  };

  const { t } = useTranslation("product-cate-page");
  const { isOpen, totalData } = props;
  const language = useSelector((state) => state.app.language);
  const [previews, setPreviews] = useState({ src: "", file: null, name: null });
  const [addData, setAddData] = useState(addDataDefault);
  const [isError, setIsError] = useState({
    thumbnail: false,
    title: false
  });

  useEffect(() => {
    setAddData({ ...addData, priority: totalData + 1 });
  }, []);

  const setPreviewHandler = (data) => {
    if (data.file) {
      setAddData({ ...addData, imageName: data.file.name });
    }
    setIsError({ ...isError, thumbnail: false });
    setPreviews(data);
  };

  const createValidators = () => {
    let isValid = true;
    if (previews.file === undefined || previews.file === null) {
      setIsError({ ...isError, thumbnail: true });
      isValid = false;
    }
    if (addData.title.length < 1 || addData.title.file === null) {
      setIsError({ ...isError, title: true });
      isValid = false;
    }
    if (isValid) {
      createSlideHandler();
    }
  };

  const createSlideHandler = () => {
    const formData = new FormData();
    if (previews.file) {
      formData.append("image", previews.file);
      formData.append("imageName", addData.imageName);
    }

    formData.append("imageTitle", addData.thumbnail_title);
    formData.append("imageAlt", addData.thumbnail_alt);
    formData.append("title", addData.title);
    formData.append("details", addData.details);
    formData.append("display", addData.display ? 1 : 0);
    formData.append("is_food", addData.is_food ? 1 : 0);
    formData.append("language", language);
    svCreateProductCate(formData).then((res) => {
      props.setClose(false);
      setAddData(addDataDefault);
      setPreviews({ src: "", file: null, name: null });
      SwalUI({ status: res.status, description: res.description });
      console.log(res);
      if (res.status) {
        props.setRefreshData((prev) => prev + 1);
      }
    });
  };

  if (!addData) return <></>;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={(e) => props.setClose(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="product-add-modal">
          <section id="product-add-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faAdd} /> {t("ProductCateAdd")}
                  </h2>
                </div>
              </div>
              <div className="card-body">
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
                >
                  <FieldsetUI
                    className={`image-setting ${
                      isError.thumbnail ? "error" : ""
                    }`}
                    label={t("ModalInfoImage")}
                  >
                    <PreviewImageUI
                      className="edit-image"
                      previews={previews}
                      setPreviews={setPreviewHandler}
                    />
                    <div className="image-detail">
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              thumbnail_title: e.target.value
                            };
                          })
                        }
                        value={addData.thumbnail_title}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="image-title"
                        label="Image title"
                        size="small"
                      />
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              thumbnail_alt: e.target.value
                            };
                          })
                        }
                        value={addData.thumbnail_alt}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="image-tag"
                        label="Alt description"
                        size="small"
                      />
                    </div>
                  </FieldsetUI>

                  <div className="product-details">
                    <h3 className="product-detail-title">{t("ModalDetail")}</h3>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return { ...prevState, title: e.target.value };
                          })
                        }
                        value={addData.title}
                        className="text-field-custom"
                        fullWidth={true}
                        error={isError.title}
                        id="ad-title"
                        label="title"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              details: e.target.value
                            };
                          })
                        }
                        value={addData.details}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-details"
                        label="details"
                        size="small"
                      />
                    </div>
                    <div className="input-sm-half">
                      <div className="group">
                        <span>{t("ModalDisplayStatus")}</span>
                        <Switch
                          {...displayLabel}
                          checked={addData.display}
                          onChange={(e) =>
                            setAddData((prevState) => {
                              return {
                                ...prevState,
                                display: e.target.checked
                              };
                            })
                          }
                        />
                      </div>
                      <div className="group">
                        <span>{t("ModalFoodStatus")}</span>
                        <Switch
                          checked={addData.is_food}
                          onChange={(e) =>
                            setAddData((prevState) => {
                              return {
                                ...prevState,
                                is_food: e.target.checked
                              };
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Box>

                <div className="btn-action">
                  <ButtonUI
                    loader={true}
                    onClick={createValidators}
                    className="btn-save"
                    on="save"
                    width="md"
                  />
                  <ButtonUI
                    onClick={() => props.setClose(false)}
                    icon={<FontAwesomeIcon icon={faRedo} />}
                    className="btn-cancel"
                    on="cancel"
                    width="md"
                  />
                </div>
              </div>
            </div>
          </section>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default ProductCateModalAdd;
