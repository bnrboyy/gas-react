import React, { useEffect,  useState } from "react";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import ButtonUI from "../../../components/ui/button/button";
import "./slide-edit.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faMinus,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Modal, Switch } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useSelector } from "react-redux";
import { svUpdateSlide } from "../../../services/slide.service";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useTranslation } from "react-i18next";

const modalSwal = withReactContent(Swal);
const displayLabel = { inputProps: { "aria-label": "display switch" } }
const editDataDefault = {
  id: null,
  imageName: "",
  token: "",
  image: "",
  imageTitle: "",
  imageAlt: "",
  title: "",
  description: "",
  display: true,
  pageId: 0,
  type: 1,
  positionId: 1,
  priority: 1,
  link: "",
  redirect: "",
  h1: "",
  h2: "",
  dateDisplay: "",
  dateHidden: "",
  language: "",
  editor: ""
}

const SlideModalEdit = (props) => { 
  const {positionList, isOpen, isEdit} = props
  const { t } = useTranslation("slide-page");
  const uploadPath = useSelector((state) => state.app.uploadPath)
  const language = useSelector((state) => state.app.language)
  const appEditData = useSelector((state) => state.app.editData);
  const pageAvailable = useSelector( (state) => state.app.frontOffice.pageAvailable ); 
  const [previews, setPreviews] = useState({ src: "", file: null, name: null });
  const [displayDate, setDisplayDate] = useState(null);
  const [hiddenDate, setHiddenDate] = useState(null);
  const [editData, setEditData] = useState(editDataDefault);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState({
    thumbnail: false,
    title: false
  });

  useEffect(() => {
 
    if (appEditData !== null) { 
      let newData = {}
      for (let key in appEditData) {
        newData[`${key}`] = (appEditData[key] !== null) ? appEditData[key] : "";
      }
      setEditData(newData);
      setPreviews({file: null, src: uploadPath + newData.image})
      setDisplayDate(newData.dateDisplay !== "" ? newData.dateDisplay : null);
      setHiddenDate(newData.dateHidden !== "" ? newData.dateHidden : null);

    }
  }, [appEditData]);
  
  const setPreviewHandler = (data) => {
    setEditData({...editData, imageName: data.file.name})
    setPreviews(data)
  }
  const displayHandleChange = (newValue) => {
    setDisplayDate(newValue);
  }
  const hiddenHandleChange = (newValue) => {
    setHiddenDate(newValue);
  }


  const editValidators = () => {
    let isValid = true;

    console.log(editData.image)
    if((previews.file === undefined || previews.file === null) && editData.image === "" ) {
      setIsError({...isError, thumbnail: true})
      isValid = false;
    }  
    
    if(editData.title.length < 1 || editData.title.file === null) {
      setIsError({...isError, title: true})
      isValid = false;
    } 

    if(isValid) {
      saveHandler();
    }
  }

  const saveHandler = () => {
    setIsFetching(true)
    const formData = new FormData();
    if(previews.file) {
      formData.append('image', previews.file)
      formData.append('imageName', editData.imageName)
    } else {
      formData.append('imageSrc', editData.image)
    }

    if(appEditData.priority !== editData.priority) {
      formData.append('priorityNew', editData.priority)
    }
 
    formData.append('id', editData.id)
    formData.append('imageTitle', editData.imageTitle)
    formData.append('imageAlt', editData.imageAlt)
    formData.append('title', editData.title)
    formData.append('description', editData.description)
    formData.append('display', (editData.display)?1:0)
    formData.append('pageId', editData.pageId)
    formData.append('type', editData.type)
    formData.append('positionId', editData.positionId)
    formData.append('link', editData.link)
    formData.append('redirect', editData.redirect)
    formData.append('h1', editData.h1)
    formData.append('h2', editData.h2)
    formData.append('dateDisplay', (displayDate)?displayDate:"")
    formData.append('dateHidden', (hiddenDate)?hiddenDate:"")
    formData.append('language', language)
    formData.append('priority', appEditData.priority)
    formData.append('isEdit', (isEdit)?1:0)

    svUpdateSlide(editData.id, formData).then(res => {
      props.setClose({isEdit,isOpen: false})
      setEditData(editDataDefault)
      if(res.status) {
        setIsFetching(false)
        props.setRefreshData((prev) => prev + 1)
        modalSwal.fire({
          position: "center",
          width: 450,
          icon: "success",
          title: "Successful",
          text: res.description,
          showConfirmButton: false,
          timer: 1500,
        })
      } else {
        modalSwal.fire({
          position: "center",
          width: 450,
          icon: "error",
          title: "Failed.",
          text: res.description,
          showConfirmButton: false,
          timer: 1500,
        })
      }
    })
  }

  const priorityHandler = (isAdding) => {
    if (isAdding) {
      setEditData((prevState) => {
        return { ...prevState, priority: editData.priority + 1 }
      })
    } else if (editData.priority > 1) {
      setEditData((prevState) => {
        return { ...prevState, priority: editData.priority - 1 }
      })
    }
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={(e) => props.setClose({isEdit,isOpen: false})}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"  >
        <Box id="slide-edit-modal">
          <section id="slide-edit-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faEdit} /> {t("slideEdit")}
                  </h2>
                </div>
              </div>
              <div className="card-body">
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}  >
                  <FieldsetUI className={`image-setting ${(isError.thumbnail)?"error":""}`} label={t("ModalInfoImage")}>
                    <PreviewImageUI
                      className="edit-image"
                      previews={previews}
                      setPreviews={setPreviewHandler}
                    />
                    <div className="image-detail">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return { ...prevState, imageName: e.target.value }
                          })
                        }
                        value={editData.imageName}
                        className={`text-field-custom ${(!previews.file)?"inp-hidden":""}`} 
                        fullWidth={true}
                        error={false}
                        id="image-name"
                        label="Image name"
                        size="small"
                      />
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return { ...prevState, imageTitle: e.target.value }
                          })
                        }
                        value={editData.imageTitle}
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
                            return { ...prevState, imageAlt: e.target.value }
                          })
                        }
                        value={editData.imageAlt}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="image-tag"
                        label="Alt description"
                        size="small"
                      />
                    </div>
                  </FieldsetUI>

                  <div className="slide-details">
                    <h3 className="slide-detail-title">{t("ModalDetail")}</h3>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return { ...prevState, title: e.target.value }
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
                              description: e.target.value,
                            }
                          })
                        }
                        value={editData.description}
                        title={editData.description}
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
                              h1: e.target.value,
                            }
                          })
                        }
                        value={editData.h1}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-h1"
                        label="H1"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              h2: e.target.value,
                            }
                          })
                        }
                        value={editData.h2}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-h2"
                        label="H2"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              link: e.target.value,
                            }
                          })
                        }
                        value={editData.link}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-link"
                        label="Link URL / Embeded / Iframe"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              redirect: e.target.value,
                            }
                          })
                        }
                        value={editData.redirect}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-redirect"
                        label="Redirect URL"
                        size="small"
                      />
                    </div>

                    <div className="input-half">
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="label-edit-slide-type">{t("ModalSlcTypeTitle")}</InputLabel>
                        <Select
                          labelId="edit-slide-type"
                          id="edit-slide-type"
                          value={editData.type}
                          label="Age"
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return { ...prevState, type: e.target.value }
                            })
                          }
                        >
                            <MenuItem value={1}>{t("ModalSlcTypeMain")}</MenuItem>
                            <MenuItem value={2}>{t("ModalSlcTypeAds")}</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-half">
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="label-edit-slide-position">{t("ModalSlcPositionTitle")}</InputLabel>
                        <Select
                          labelId="edit-slide-position"
                          id="edit-slide-position"
                          value={editData.positionId}
                          label="Age"
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return {
                                ...prevState,
                                positionId: e.target.value,
                              }
                            })
                          } >
                          <MenuItem value={0}>{t("None")}</MenuItem>
                          {positionList &&
                            positionList.map((p) => (
                              <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
                            ))
                          }
                       
                        </Select>
                      </FormControl>
                    </div>

                    <div className="input-half">
                      <DateTimePicker
                        className="date-input"
                        size="small"
                        label={t("ModalDateDisplay")}
                        value={displayDate}
                        onChange={displayHandleChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                    <div className="input-half">
                      <DateTimePicker
                        className="date-input"
                        sx={{ width: 250 }}
                        label={t("ModalDateHidden")}
                        value={hiddenDate}
                        onChange={hiddenHandleChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                    <div className="input-sm-half">
                      <FormControl className="form-control">
                        <InputLabel id="edit-page-control">{t("ModalSlcCtronrolPage")}</InputLabel>
                        <Select
                          labelId="slide-page"
                          autoWidth
                          id="edit-page-control"
                          label="Page Control"
                          className="input-page"
                          size="small"
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return { ...prevState, pageId: e.target.value }
                            })
                          }
                          value={editData.pageId} >
                          <MenuItem value={0}>{t("None")}</MenuItem>
                          {pageAvailable &&
                            pageAvailable.map((menu) => (
                              <MenuItem key={menu.id} value={menu.id}>
                                {menu.title}
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-sm-half center">
                      <div className="input-group">
                        <ButtonUI
                          color="error"
                          onClick={(e) => priorityHandler(false)}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </ButtonUI>
                        <span className="title">
                        {t("ModalPriority")} {editData.priority}
                        </span>
                        <ButtonUI onClick={(e) => priorityHandler(true)}>
                          <FontAwesomeIcon icon={faAdd} />
                        </ButtonUI>
                      </div>
                      <div className="group">
                        <span>{t("ModalDisplayStatus")}</span>
                        <Switch
                          {...displayLabel}
                          checked={editData.display}
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return {
                                ...prevState,
                                display: e.target.checked,
                              }
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
                    isLoading={isFetching}
                    onClick={editValidators}
                    className="btn-save"
                    on="save"
                    width="md"
                  />
                  <ButtonUI
                    onClick={() => props.setClose({isEdit,isOpen: false})}
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
}

export default SlideModalEdit;
