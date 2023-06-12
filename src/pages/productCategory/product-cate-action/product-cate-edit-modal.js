import React, { useState } from "react";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import ButtonUI from "../../../components/ui/button/button";
import "./product-cate-edit.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRedo } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Modal, Switch } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { svUpdateProductCate } from "../../../services/product-category.service";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { svUpdateproduct } from "../../../services/product.service";
const modalSwal = withReactContent(Swal);

const displayLabel = { inputProps: { "aria-label": "display switch" } };

const ProductCateModalEdit = (props) => {
  const { isOpen, isEdit, editProduct } = props;
  const { t } = useTranslation("product-cate-page");
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const language = useSelector((state) => state.app.language);
  const [previews, setPreviews] = useState({
    src: uploadPath + editProduct.thumbnail_link,
    file: null,
    name: null
  });
  const [editData, setEditData] = useState(editProduct);
  const [isError, setIsError] = useState({
    thumbnail: false,
    title: false
  });

  const setPreviewHandler = (data) => {
    setPreviews(data);
  };

  const editValidators = () => {
    let isValid = true;
    if (
      (previews.file === undefined || previews.file === null) &&
      editData.image === ""
    ) {
      setIsError({ ...isError, thumbnail: true });
      isValid = false;
    }
    if (editData.title.length < 1 || editData.title.file === null) {
      setIsError({ ...isError, title: true });
      isValid = false;
    }
    if (isValid) {
      saveHandler();
    }
  };

  const saveHandler = () => {
    const formData = new FormData();
    if (previews.file) {
      formData.append("image", previews.file);
      formData.append("imageName", previews.name);
    } else {
      formData.append("thumbnail_link", editData.thumbnail_link);
    }

    formData.append("id", editData.id);
    formData.append("imageTitle", editData.thumbnail_title);
    formData.append("imageAlt", editData.thumbnail_alt);
    formData.append("title", editData.title);
    formData.append("details", editData.details);
    formData.append("display", editData.display ? 1 : 0);
    formData.append("is_food", editData.is_food ? 1 : 0);
    formData.append("language", editData.language);

    svUpdateProductCate(editData.id, formData).then((res) => {
      props.setClose({ isEdit, isOpen: false });
      if (res.status) {
        props.setRefreshData((prev) => prev + 1);
        modalSwal.fire({
          position: "center",
          width: 450,
          icon: "success",
          title: "Successful",
          text: res.description,
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        modalSwal.fire({
          position: "center",
          width: 450,
          icon: "error",
          title: "Failed.",
          text: res.description,
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={(e) => props.setClose({ isEdit, isOpen: false })}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="product-edit-modal">
          <section id="product-edit-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faEdit} /> {t("productCateEdit")}
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
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              thumbnail_title: e.target.value
                            };
                          })
                        }
                        value={editData.thumbnail_title}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="image-title"
                        label="Image title"
                        size="small"
                      />
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              thumbnail_alt: e.target.value
                            };
                          })
                        }
                        value={editData.thumbnail_alt}
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
                          setEditData((prevState) => {
                            return { ...prevState, title: e.target.value };
                          })
                        }
                        value={editData.title}
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
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              details: e.target.value
                            };
                          })
                        }
                        value={editData.details}
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
                          checked={editData.display}
                          onChange={(e) =>
                            setEditData((prevState) => {
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
                          checked={editData.is_food}
                          onChange={(e) =>
                            setEditData((prevState) => {
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
                    onClick={editValidators}
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

export default ProductCateModalEdit;
