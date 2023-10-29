import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import ButtonUI from "../../../components/ui/button/button";
import { useSelector } from "react-redux";

import "./product-add.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus, faRedo } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Modal, Switch } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { svCreateProduct } from "../../../services/product.service";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";

const displayLabel = { inputProps: { "aria-label": "display switch" } };

const ProductModalAdd = (props) => {
  const addDataDefault = {
    id: null,
    cate_id: 0,
    description: "",
    details: "",
    display: false,
    more_details: "",
    page_id: 0,
    pin: false,
    price: 0,
    thumbnail_alt: "",
    thumbnail_link: "",
    thumbnail_title: "",
    title: "",
  };

  const previewImage = {
    src: "",
    file: null,
    name: null,
  };

  const { t } = useTranslation("product-page");
  const {
    isOpen,
    totalData,
    productCate,
    cateForProduct,
    setClose,
    setRefreshData,
  } = props;
  const [previews, setPreviews] = useState(previewImage);
  const [addData, setAddData] = useState(addDataDefault);
  const [btnLoading, setBtnLoding] = useState(false);
  const [isError, setIsError] = useState({
    thumbnail: false,
    title: false,
    price: false,
    cate: false,
  });

  function closeModal() {
    setIsError({
      thumbnail: false,
      title: false,
      price: false,
      cate: false,
    });
    setPreviews(previewImage);
    setAddData(addDataDefault);
    setClose(false);
  }

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
      setIsError((prev) => {
        return { ...prev, thumbnail: true };
      });
      isValid = false;
    } else {
      setIsError((prev) => {
        return { ...prev, thumbnail: false };
      });
    }
    if (addData.title.trim().length < 1 || addData.title.file === null) {
      setIsError((prev) => {
        return { ...prev, title: true };
      });
      isValid = false;
    } else {
      setIsError((prev) => {
        return { ...prev, title: false };
      });
    }
    if (addData.price === 0 || addData.price === "") {
      setIsError((prev) => {
        return { ...prev, price: true };
      });
      isValid = false;
    } else {
      setIsError((prev) => {
        return { ...prev, price: false };
      });
    }
    if (addData.cate_id === 0) {
      setIsError((prev) => {
        return { ...prev, cate: true };
      });
      isValid = false;
    } else {
      setIsError((prev) => {
        return { ...prev, cate: false };
      });
    }

    if (isValid) {
      setBtnLoding(true);
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
    formData.append("id", addData.id);
    formData.append("title", addData.title);
    formData.append("description", "");
    formData.append("display", addData.display ? 1 : 0);
    formData.append("cate_id", parseInt(addData.cate_id));
    formData.append("details", addData.details);
    formData.append("price", addData.price);
    svCreateProduct(formData).then((res) => {
      closeModal();
      setAddData(addDataDefault);
      setPreviews(previewImage);
      SwalUI({ status: res.status, description: res.description });
      if (res.status) {
        setRefreshData((prev) => prev + 1);
      }
    });
  };

  if (!addData) return <></>;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={(e) => closeModal()}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="product-add-modal">
          <section id="product-add-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faAdd} /> {t("ProductAdd")}
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
                      setIsError={setIsError}
                    />
                    <div className="image-detail">
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              thumbnail_title: e.target.value,
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
                              thumbnail_alt: e.target.value,
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
                              price: !isNaN(parseInt(e.target.value))
                                ? parseInt(e.target.value)
                                : 0,
                            };
                          })
                        }
                        value={addData.price}
                        className="text-field-custom"
                        fullWidth={true}
                        error={isError.price}
                        id="ad-price"
                        label="price"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              details: e.target.value,
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
                    <div className="input-half">
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="label-add-product-type">
                          {t("ModalSlcCategory")}
                        </InputLabel>
                        <Select
                          labelId="add-product-type"
                          id="add-product-type"
                          value={addData.cate_id}
                          error={isError.cate}
                          label={t("ModalSlcCategory")}
                          onChange={(e) =>
                            setAddData((prevState) => {
                              return { ...prevState, cate_id: e.target.value };
                            })
                          }
                        >
                          <MenuItem value={0} disabled>
                            {t("None")}
                          </MenuItem>
                          {productCate &&
                            productCate.map((p) => (
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
                          checked={addData.display}
                          onChange={(e) =>
                            setAddData((prevState) => {
                              return {
                                ...prevState,
                                display: e.target.checked,
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
                    isLoading={btnLoading}
                    onClick={createValidators}
                    className="btn-save"
                    on="save"
                    width="md"
                  />
                  <ButtonUI
                    onClick={() => closeModal()}
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

export default ProductModalAdd;
