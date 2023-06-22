import React, { useEffect, useState } from "react";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import ButtonUI from "../../../components/ui/button/button";
import "./product-edit.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faMinus,
  faRedo
} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Modal, Switch } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { svUpdateProduct } from "../../../services/product.service";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const modalSwal = withReactContent(Swal);

const displayLabel = { inputProps: { "aria-label": "display switch" } };

const ProductModalEdit = (props) => {
  const {
    isOpen,
    isEdit,
    editProduct,
    productCate,
    cateForProduct,
    setRefreshData,
    setClose
  } = props;
  const { t } = useTranslation("product-page");
  const uploadPath = useSelector((state) => state.app.uploadPath);
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
  const language = useSelector((state) => state.app.language);
  const [productCateShow, setProductCateShow] = useState(productCate);

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

    formData.append("imageTitle", editData.thumbnail_title);
    formData.append("imageAlt", editData.thumbnail_alt);
    formData.append("id", editData.id);
    formData.append("title", editData.title);
    formData.append("description", editData.description);
    formData.append("display", editData.display ? 1 : 0);
    formData.append("page_id", parseInt(editData.page_id));
    formData.append("cate_id", parseInt(editData.cate_id));
    formData.append("details", editData.details);
    formData.append("price", editData.price);
    formData.append("language", language);
    svUpdateProduct(editData.id, formData).then((res) => {
      setClose({ isEdit, isOpen: false });
      if (res.status) {
        setRefreshData((prev) => prev + 1);
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

  useEffect(() => {
    onSelectPage();
  }, [editData.page_id]);

  const onSelectPage = () => {
    if (editData.page_id === 15) {
      setProductCateShow(productCate.filter((e) => !!e.is_food));
    } else {
      setProductCateShow(productCate.filter((e) => !!!e.is_food));
      setEditData({ ...editData, can_sweet: false, can_wave: false });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={(e) => setClose({ isEdit, isOpen: false })}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="product-edit-modal">
          <section id="product-edit-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faEdit} /> {t("productEdit")}
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
                      setPreviews={setPreviews}
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
                              description: e.target.value
                            };
                          })
                        }
                        value={editData.description}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-description"
                        label="description"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              price: !isNaN(parseInt(e.target.value))?parseInt(e.target.value):0
                            };
                          })
                        }
                        value={editData.price}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-price"
                        label="price"
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
                    <div className="input-half">
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="label-edit-product-type">
                          {t("ModalSlcCategory")}
                        </InputLabel>
                        <Select
                          labelId="edit-product-type"
                          id="edit-product-type"
                          value={editData.cate_id}
                          label={t("ModalSlcCategory")}
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return { ...prevState, cate_id: e.target.value };
                            })
                          }
                        >
                          <MenuItem value={0} disabled>
                            {t("None")}
                          </MenuItem>
                          {productCateShow &&
                            productCateShow.map((p) => (
                              <MenuItem key={p.id} value={p.id}>
                                {p.title}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <div className="group">
                        <span>{"การแสดงผล"}</span>
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
                    </div>
                    <div className="input-sm-half">
                    </div>
                    <div className="input-sm-half">
                      {editData.page_id === 15 && (
                        <>
                          <div className="group">
                            <span>{t("ModalCanWaveStatus")}</span>
                            <Switch
                              checked={editData.can_wave}
                              onChange={(e) =>
                                setEditData((prevState) => {
                                  return {
                                    ...prevState,
                                    can_wave: e.target.checked
                                  };
                                })
                              }
                            />
                          </div>
                          <div className="group">
                            <span>{t("ModalCanSweetStatus")}</span>
                            <Switch
                              checked={editData.can_sweet}
                              onChange={(e) =>
                                setEditData((prevState) => {
                                  return {
                                    ...prevState,
                                    can_sweet: e.target.checked
                                  };
                                })
                              }
                            />
                          </div>
                        </>
                      )}
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
                    onClick={() => setClose({ isEdit, isOpen: false })}
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

export default ProductModalEdit;
