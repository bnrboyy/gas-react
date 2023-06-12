import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ButtonUI from "../../../components/ui/button/button";
import { useTranslation } from "react-i18next";
import RadioBoxUI from "../../../components/ui/radio-box/radio-box";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import { svCreateCategory } from "../../../services/category.service";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";

import "./category-add-modal.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import { FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";


const addDataDefault = {
  id: null,
  imageName: "",
  cate_thumbnail: "",
  cate_thumbnail_title: "",
  cate_thumbnail_alt: "",
  cate_title: "",
  cate_keyword: "",
  cate_description: "",
  cate_url: "",
  cate_redirect: "",
  cate_position: 1,
  cate_priority: 1,
  is_menu: false,
  is_menu_bottom: false,
  is_main_page: false,
  language: ""
}

const addDataValidDefault = {
  formValid: false,
  cate_thumbnail_title: false,
  cate_thumbnail_alt: false,
  cate_title: false,
  cate_keyword: false,
  cate_description: false,
  cate_url: false,
  cate_redirect: false,
}

const ModalAddCategory = (props) => {
  const { isOpen, menuList, categoryData, totalData } = props
  const { t } = useTranslation("category-page");
  const language = useSelector(state => state.app.language)
  const [ addData , setAddData ] = useState(addDataDefault)
  const [ addDataValid , setAddDataValid ] = useState(addDataValidDefault)
  const [ cateId , setCateId ] = useState(0)
  const [previews, setPreviews] = useState({ src: "", file: null, name: null });
  const [ isFetching , setIsFetching ] = useState(false)

  const url =  window.location.origin + "/";

  useEffect(() => {
    if(isOpen) { 
      setCateId(0)
      setPreviews({ src: "", file: null, name: null })
      setAddDataValid(addDataValidDefault)
      setAddData({...addDataDefault, cate_priority: totalData + 1 , cate_position: totalData + 1 })
    }  
  }, [isOpen])

  
  const setPreviewHandler = (data) => {
    if(data.file) {
      setAddData({...addData, imageName: data.file.name})
    }
    setPreviews(data)
  }
 
  const saveModalHandler = () => {
    setAddDataValid({
      ...addDataValid, 
      cate_title: (addData.cate_title === ""),
      cate_url: (addData.cate_url === "")
    })

    if((addData.cate_title === "") || (addData.cate_url === "") || isFetching){
      return false;
    }
  
    setIsFetching(true)
    const formData = new FormData();
    if(previews.file) {
      formData.append('Image', previews.file)
      formData.append('ImageName', addData.imageName)
    }
   
    let c = categoryData.filter(d => parseInt(d.id) === parseInt(cateId))

    formData.append('cate_parent_id', cateId)
    formData.append('cate_level', (cateId>0)?c[0].cate_level + 1:0)
    formData.append('cate_root_id', (cateId>0)?c[0].cate_root_id:0)
    formData.append('cate_thumbnail_title', addData.cate_thumbnail_title)
    formData.append('cate_thumbnail_alt', addData.cate_thumbnail_alt)
    formData.append('cate_title', addData.cate_title)
    formData.append('cate_keyword', addData.cate_keyword)
    formData.append('cate_description', addData.cate_description)
    formData.append('cate_url', addData.cate_url)
    formData.append('cate_redirect', addData.cate_redirect)
    formData.append('cate_position', addData.cate_position)
    formData.append('cate_priority', addData.cate_priority)
    formData.append('is_menu', (addData.is_menu)?1:0)
    formData.append('is_menu_bottom', (addData.is_menu_bottom)?1:0)
    formData.append('is_main_page', (addData.is_main_page)?1:0)
    formData.append('language', language)
    
    svCreateCategory(formData).then(res => {
      setIsFetching(false)
      if(res.status) {
        props.setClose(false)
        props.setRefreshData(prev => prev + 1)
      }
      SwalUI({status: res.status, description: res.description})
    })
  } 

  return (
    <Modal
      open={isOpen}
      onClose={() => props.setClose(false)}
      className={"modal-add-category"}
      aria-labelledby="modal-add-category"
      aria-describedby="modal-add-category" >
      <Box className="modal-custom">
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faAdd} />
            <span>{t("ModalAddCategoryh2")}</span>
          </h2>
          <IconButton
            className="param-generator"
            color="error"
            sx={{ p: "10px" }}
            onClick={() => props.setClose(false)} >
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </div>
        <div className="modal-body overflow-scroll-custom">
          <fieldset className="modal-fieldset">
            <legend className="modal-legend">{t("ModalAddCategoryTitle")}</legend>
            <RadioBoxUI className="cate-menu-list" data={menuList} value={cateId} onChange={setCateId}/>
            <div className="form-details">
   
              <FieldsetUI className="image-setting" label={t("ModalInfoImage")}>
                <PreviewImageUI
                  className="add-image" 
                  previews={previews}
                  setPreviews={setPreviewHandler} />
                <div className="image-detail">
                  <TextField
                    onChange={(e) =>
                      setAddData((prevState) => {
                        return { ...prevState, imageName: e.target.value }
                      })
                    }
                    value={addData.imageName}
                    className="text-field-custom"
                    fullWidth={true}
                    error={addDataValid.imageName}
                    id="image-name"
                    label="Image name"
                    size="small"
                  />
                  <TextField
                    onChange={(e) =>
                      setAddData((prevState) => {
                        return { ...prevState, cate_thumbnail_title: e.target.value }
                      })
                    }
                    value={addData.cate_thumbnail_title}
                    className="text-field-custom"
                    fullWidth={true}
                    error={addDataValid.cate_thumbnail_title} 
                    id="image-title"
                    label="Image title"
                    size="small"
                  />
                  <TextField
                    onChange={(e) =>
                      setAddData((prevState) => {
                        return { ...prevState, cate_thumbnail_alt: e.target.value }
                      })
                    }
                    value={addData.cate_thumbnail_alt}
                    className="text-field-custom"
                    fullWidth={true}
                    error={addDataValid.cate_thumbnail_alt}
                    id="image-tag"
                    label="Alt description"
                    size="small"
                  />
                </div>
              </FieldsetUI>
              <h3 className="category-detail-title">{t("ModalDetail")}</h3>
              <TextField
                onChange={(e) =>
                  setAddData((prevState) => {
                    return { ...prevState, cate_title: e.target.value }
                  })
                }
                value={addData.cate_title}
                className="text-field-custom"
                fullWidth={true}
                error={addDataValid.cate_title}
                id="cate-title"
                label="Title"
                size="small"
              />
              <TextField
                onChange={(e) =>
                  setAddData((prevState) => {
                    return { ...prevState, cate_keyword: e.target.value }
                  })
                }
                value={addData.cate_keyword}
                className="text-field-custom"
                fullWidth={true}
                error={addDataValid.cate_keyword}
                id="cate-keyword"
                label="Keyword"
                size="small"
              />
              <TextField
                onChange={(e) =>
                  setAddData((prevState) => {
                    return { ...prevState, cate_description: e.target.value }
                  })
                }
                value={addData.cate_description}
                className="text-field-custom"
                fullWidth={true}
                error={addDataValid.cate_description}
                id="cate-description"
                label="Description"
                size="small"
              />
              <TextField
                onChange={(e) =>
                  setAddData((prevState) => {
                    return { ...prevState, cate_url: e.target.value }
                  })
                }
                placeholder="slug/example"
                value={addData.cate_url}
                className="text-field-custom"
                fullWidth={true}
                error={addDataValid.cate_url}
                id="cate-url"
                label={url}
                size="small"
              />
              <TextField
                onChange={(e) =>
                  setAddData((prevState) => {
                    return { ...prevState, cate_redirect: e.target.value }
                  })
                }
                placeholder="Link Url"
                value={addData.cate_redirect}
                className="text-field-custom"
                fullWidth={true}
                error={addDataValid.cate_redirect}
                id="cate-redirect"
                label="Redirect"
                size="small"
              />

              <h3 className="category-detail-title">{t("ModalSetting")}</h3>
              <div className="setting-controls">
                <div className="switch-form">
                  <FormGroup>
                    <FormControlLabel  control={<Switch onChange={(e) => setAddData({...addData, is_menu: e.target.checked})} checked={addData.is_menu} />} label="Menu" labelPlacement="start" />
                  </FormGroup>
                </div>
                <div className="switch-form">
                  <FormGroup>
                    <FormControlLabel  control={<Switch onChange={(e) => setAddData({...addData, is_menu_bottom: e.target.checked})} checked={addData.is_menu_bottom} />} label="Footer Menu" labelPlacement="start" />
                  </FormGroup>
                </div>
                <div className="switch-form">
                  <FormGroup>
                    <FormControlLabel  control={<Switch onChange={(e) => setAddData({...addData, is_main_page: e.target.checked})} />}  label="Website Display" labelPlacement="start" />
                  </FormGroup>
                </div>
                <div className="input-group">
                  <div className="inp"> 
                    <ButtonUI
                      color="error"
                      onClick={(e) => (addData.cate_position > 1)?setAddData({...addData, cate_position: addData.cate_position - 1}):""} >
                      <FontAwesomeIcon icon={faMinus} />
                    </ButtonUI>
                    <span className="title">
                      {t("ModalPosition")} {addData.cate_position}
                    </span>
                    <ButtonUI onClick={(e) => setAddData({...addData, cate_position: addData.cate_position + 1}) }>
                      <FontAwesomeIcon icon={faAdd} />
                    </ButtonUI>
                  </div>
                </div>
                <div className="input-group">
                  <div className="inp"> 
                    <ButtonUI
                      color="error"
                      onClick={(e) => (addData.cate_priority > 1)?setAddData({...addData, cate_priority: addData.cate_priority - 1}):""} >
                      <FontAwesomeIcon icon={faMinus} />
                    </ButtonUI>
                    <span className="title">
                      {t("ModalPriority")} {addData.cate_priority}
                    </span>
                    <ButtonUI onClick={(e) => setAddData({...addData, cate_priority: addData.cate_priority + 1}) }>
                      <FontAwesomeIcon icon={faAdd} />
                    </ButtonUI>
                  </div>
                </div>
              </div> 
            </div>
          </fieldset>
        </div>
        <div className="modal-footer">
          <ButtonUI
            loader={true}
            isLoading={isFetching}
            className="btn-save"
            on="save"
            width="md"
            onClick={saveModalHandler} >
            {t("Save")}
          </ButtonUI>
          <ButtonUI
            className="btn-cancel"
            on="cancel"
            width="md" 
            onClick={()=>props.setClose(false)}>
            {t("Cancel")}
          </ButtonUI>
        </div>
      </Box>
    </Modal>
  )
}

export default ModalAddCategory;
