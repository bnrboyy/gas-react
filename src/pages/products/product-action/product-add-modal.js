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
    can_sweet: false,
    can_wave: false,
    cate_id: 0,
    content: "",
    description: "",
    details: "",
    display: false,
    language: "",
    more_details: "",
    page_id: 0,
    pin: false,
    price: 0,
    priority: 0,
    thumbnail_alt: "",
    thumbnail_link: "",
    thumbnail_title: "",
    price_per_minutes: 0,
    round_minutes: 0,
    default_minutes	: 0,
    title: ""
  };

  const { t } = useTranslation("product-page");
  const {
    isOpen,
    totalData,
    productCate,
    cateForProduct,
    setClose,
    setRefreshData
  } = props;
  const language = useSelector((state) => state.app.language);
  const [previews, setPreviews] = useState({ src: "", file: null, name: null });
  const [addData, setAddData] = useState(addDataDefault);
  const [isError, setIsError] = useState({
    thumbnail: false,
    title: false
  });
  const [productCateShow, setProductCateShow] = useState(productCate);

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
    formData.append("id", addData.id);
    formData.append("title", addData.title);
    formData.append("description", addData.description);
    formData.append("display", addData.display ? 1 : 0);
    formData.append("page_id", parseInt(addData.page_id));
    formData.append("priority", addData.priority);
    formData.append("cate_id", parseInt(addData.cate_id));
    formData.append("can_sweet", addData.can_sweet ? 1 : 0);
    formData.append("can_wave", addData.can_wave ? 1 : 0);
    formData.append("details", addData.details);
    formData.append("price", addData.price);
    formData.append("language", language);
    formData.append("price_per_minutes", addData.price_per_minutes);
    formData.append("round_minutes", addData.round_minutes);
    formData.append("default_minutes", addData.default_minutes);
    svCreateProduct(formData).then((res) => {
      setClose(false);
      setAddData(addDataDefault);
      setPreviews({ src: "", file: null, name: null });
      SwalUI({ status: res.status, description: res.description });
      if (res.status) {
        setRefreshData((prev) => prev + 1);
      }
    });
  };

  const priorityHandler = (isAdding) => {
    if (isAdding) {
      setAddData((prevState) => {
        return { ...prevState, priority: addData.priority + 1 };
      });
    } else if (addData.priority > 1) {
      setAddData((prevState) => {
        return { ...prevState, priority: addData.priority - 1 };
      });
    }
  };

  useEffect(() => {
    onSelectPage();
  }, [addData.page_id]);

  const onSelectPage = () => {
    if (addData.page_id === 15) {
      setProductCateShow(productCate.filter((e) => !!e.is_food));
    } else {
      setProductCateShow(productCate.filter((e) => !!!e.is_food));
      setAddData({ ...addData, can_sweet: false, can_wave: false });
    }
  };

  if (!addData) return <></>;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={(e) => setClose(false)}
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
                              description: e.target.value
                            };
                          })
                        }
                        value={addData.description}
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
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              price: !isNaN(parseInt(e.target.value))?parseInt(e.target.value):0
                            };
                          })
                        }
                        value={addData.price}
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
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              price_per_minutes: !isNaN(parseInt(e.target.value))?parseInt(e.target.value):0
                            };
                          })
                        }
                        value={addData.price_per_minutes}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-details"
                        label="price per minutes"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              round_minutes: !isNaN(parseInt(e.target.value))?parseInt(e.target.value):0
                            };
                          })
                        }
                        value={addData.round_minutes}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-details"
                        label="round minutes"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setAddData((prevState) => {
                            return {
                              ...prevState,
                              default_minutes: !isNaN(parseInt(e.target.value))?parseInt(e.target.value):0
                            };
                          })
                        }
                        value={addData.default_minutes}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-details"
                        label="default minutes"
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
                          {productCateShow &&
                            productCateShow.map((p) => (
                              <MenuItem key={p.id} value={p.id}>
                                {p.title}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-half">
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="add-page-control">
                          {t("ModalSlcCtronrolPage")}
                        </InputLabel>
                        <Select
                          labelId="product-page"
                          id="add-page-control"
                          label={t("ModalSlcCtronrolPage")}
                          className="input-page"
                          size="small"
                          onChange={(e) =>
                            setAddData((prevState) => {
                              return { ...prevState, page_id: e.target.value };
                            })
                          }
                          value={addData.page_id}
                        >
                          <MenuItem value={0} disabled>
                            {t("None")}
                          </MenuItem>
                          {cateForProduct &&
                            cateForProduct.map((menu) => (
                              <MenuItem key={menu.id} value={menu.id}>
                                {menu.cate_title}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-sm-half">
                      <div className="input-group">
                        <ButtonUI
                          color="error"
                          onClick={(e) => priorityHandler(false)}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </ButtonUI>
                        <span className="title">
                          {t("ModalPriority")} {addData.priority}
                        </span>
                        <ButtonUI onClick={(e) => priorityHandler(true)}>
                          <FontAwesomeIcon icon={faAdd} />
                        </ButtonUI>
                      </div>
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
                    </div>
                    <div className="input-sm-half">
                      {addData.page_id === 15 && (
                        <>
                          <div className="group">
                            <span>{t("ModalCanWaveStatus")}</span>
                            <Switch
                              checked={addData.can_wave}
                              onChange={(e) =>
                                setAddData((prevState) => {
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
                              checked={addData.can_sweet}
                              onChange={(e) =>
                                setAddData((prevState) => {
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
                    onClick={createValidators}
                    className="btn-save"
                    on="save"
                    width="md"
                  />
                  <ButtonUI
                    onClick={() => setClose(false)}
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
