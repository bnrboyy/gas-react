import React, { useEffect, useRef, useState } from "react";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import ButtonUI from "../../../components/ui/button/button";
import { useTranslation } from "react-i18next";
import { svCreateSlide } from "../../../services/slide.service";
import { useSelector } from "react-redux";

import "./slide-add.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus, faRedo } from "@fortawesome/free-solid-svg-icons";
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

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
const modalSwal = withReactContent(Swal);
const displayLabel = { inputProps: { "aria-label": "display switch" } }
const addDataDefault = {
  image: "",
  imageName: "",
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
}

const SlideModalAdd = (props) => {
  const { t } = useTranslation("slide-page");
  const {positionList, isOpen, totalData} = props;
  const language = useSelector(state => state.app.language)
  const pageAvailable = useSelector((state) => state.app.frontOffice.pageAvailable)
  const [previews, setPreviews] = useState({ src: "", file: null, name: null });
  const [displayDate, setDisplayDate] = useState(null);
  const [hiddenDate, setHiddenDate] = useState(null); 
  const [isFetching, setIsFetching] = useState(false);
  const [addData, setAddData] = useState(addDataDefault);
  const [isError, setIsError] = useState({
    thumbnail: false,
    title: false
  });

  useEffect(() => {
    setAddData({...addData, priority: totalData + 1})
  }, []);

  useEffect(() => { 
  
  }, [addData]);

  const setPreviewHandler = (data) => {
    if(data.file) {
      setAddData({...addData, imageName: data.file.name})
    }
    setIsError({...isError, thumbnail: false})
    setPreviews(data)
  }

  const displayHandleChange = (newValue) => {
    setDisplayDate(newValue);
  }
  
  const hiddenHandleChange = (newValue) => {
    setHiddenDate(newValue);
  }

  const createValidators = () => {
    let isValid = true
    if(previews.file === undefined || previews.file === null) {
      setIsError({...isError, thumbnail: true})
      isValid = false;
    }  
    
    if(addData.title.length < 1 || addData.title.file === null) {
      setIsError({...isError, title: true})
      isValid = false;
    }  
    if(isValid) {
      createSlideHandler();
    }
  }

  const createSlideHandler = () => {
    setIsFetching(true)
    const formData = new FormData();
    if(previews.file) {
      formData.append('image', previews.file)
      formData.append('imageName', addData.imageName)
    }

    formData.append('imageTitle', addData.imageTitle)
    formData.append('imageAlt', addData.imageAlt)
    formData.append('title', addData.title)
    formData.append('description', addData.description)
    formData.append('display', (addData.display)?1:0)
    formData.append('pageId', addData.pageId)
    formData.append('type', addData.type)
    formData.append('positionId', addData.positionId)
    formData.append('priority', addData.priority)
    formData.append('link', addData.link)
    formData.append('redirect', addData.redirect)
    formData.append('h1', addData.h1)
    formData.append('h2', addData.h2)
    formData.append('dateDisplay', (displayDate)?displayDate:"")
    formData.append('dateHidden', (hiddenDate)?hiddenDate:"")
    formData.append('language', language)

    svCreateSlide(formData).then(res => {
      setIsFetching(false)
      props.setClose(false)
      setAddData(addDataDefault)
      SwalUI({status: res.status, description: res.description})
      if(res.status) {
        props.setRefreshData((prev) => prev + 1)
      } 
    })
  } 

  const priorityHandler = (isAdding) => {
    if (isAdding) {
      setAddData((prevState) => {
        return { ...prevState, priority: addData.priority + 1 }
      });
    } else if (addData.priority > 1) {
      setAddData((prevState) => {
        return { ...prevState, priority: addData.priority - 1 }
      });
    }
  }
 
  if(!addData) return <></>;
 
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={(e) => props.setClose(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="slide-add-modal">
          <section id="slide-add-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faAdd} /> {t("slideAdd")}
                  </h2>
                </div>
              </div>
              <div className="card-body">
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }} >
                  <FieldsetUI className={`image-setting ${(isError.thumbnail)?"error":""}`} label={t("ModalInfoImage")}>
                    <PreviewImageUI
                      className="add-image" 
                      previews={previews}
                      setPreviews={setPreviewHandler} />
                    <div className="image-detail">
                      <TextField
                        onChange={(e) => setAddData({...addData, imageName: e.target.value }) }
                        value={addData.imageName}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="image-name"
                        label="Image name"
                        size="small"
                      />
                      <TextField
                        onChange={(e) => setAddData({...addData, imageTitle: e.target.value }) }
                        value={addData.imageTitle}
                        className="text-field-custom "
                        fullWidth={true}
                        error={false}
                        id="image-title"
                        label="Image title"
                        size="small"
                      />
                      <TextField
                        onChange={(e) => setAddData({...addData, imageAlt: e.target.value }) }
                        value={addData.imageAlt}
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
                        onChange={(e) => setAddData({...addData, title: e.target.value }) }
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
                        onChange={(e) => setAddData({...addData, description: e.target.value }) }
                        value={addData.description}
                        title={addData.description}
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
                        onChange={(e) => setAddData({...addData, h1: e.target.value }) }
                        value={addData.h1}
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
                        onChange={(e) => setAddData({...addData, h2: e.target.value }) }
                        value={addData.h2}
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
                        onChange={(e) => setAddData({...addData, link: e.target.value }) }
                        value={addData.link}
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
                        onChange={(e) => setAddData({...addData, redirect: e.target.value }) }
                        value={addData.redirect}
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
                        className="form-control"     >
                        <InputLabel id="label-add-slide-type">{t("ModalSlcTypeTitle")}</InputLabel>
                        <Select
                          labelId="add-slide-type"
                          id="add-slide-type"
                          value={addData.type}
                          onChange={(e) => setAddData({...addData, type: e.target.value }) }
                          label="Age"
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
                        <InputLabel id="label-add-slide-position">{t("ModalSlcPositionTitle")}</InputLabel>
                        <Select
                          labelId="add-slide-position"
                          id="add-slide-position"
                          value={addData.positionId}
                          label="Age"
                          onChange={(e) => setAddData({...addData, positionId: e.target.value }) }
                        >
                          <MenuItem value={0}>{t("None")}</MenuItem>
                          {positionList &&  positionList.map((p) => <MenuItem  key={p.id} value={p.id}>{p.title}</MenuItem> )}
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
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="label-add-slide-pageid">{t("ModalSlcCtronrolPage")}</InputLabel>
                        <Select
                          labelId="add-slide-pageid"
                          id="add-slide-pageid"
                          value={addData.pageId}
                          label="pageid"
                          onChange={(e) => setAddData({...addData, pageId: e.target.value }) }
                        >
                          <MenuItem value={0}>{t("None")}</MenuItem>
                          {pageAvailable &&
                            pageAvailable.map((menu) => (
                              <MenuItem key={menu.id} value={menu.id}>{menu.title}</MenuItem>
                            ))}
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
                          {t("ModalPriority")} {addData.priority}
                        </span>
                        <ButtonUI onClick={(e) => priorityHandler(true)}>
                          <FontAwesomeIcon icon={faAdd} />
                        </ButtonUI>
                      </div>
                      <div className="group">
                        <span>{t("ModalDisplayStatus")}</span>
                        <Switch {...displayLabel} 
                          checked={addData.display} 
                          onChange={(e) => setAddData({...addData, display: e.target.value }) }
                        />
                      </div>
                    </div>
                  </div>
                </Box>

                <div className="btn-action">
                  <ButtonUI
                    loader={true}
                    isLoading={isFetching}
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
}

export default SlideModalAdd;
