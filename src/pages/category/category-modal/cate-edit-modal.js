import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ButtonUI from "../../../components/ui/button/button";
import { useTranslation } from "react-i18next";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import { svUpdateCategory } from "../../../services/category.service";
import RadioBoxUI from "../../../components/ui/radio-box/radio-box";

import "./category-add-modal.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import { FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";


const editDataDefault = {
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

const editDataValidDefault = {
  cate_title: false,
  cate_url: false,
  // cate_thumbnail_title: false,
  // cate_thumbnail_alt: false,
  // cate_keyword: false,
  // cate_description: false,
  // cate_redirect: false,
  // cate_position: false,
  // cate_priority: false,
  // is_menu: false,
  // is_main_page: false,
}

const ModalEditCategory = (props) => {
  const { isOpen, menuList, categoryData } = props
  const { t } = useTranslation("category-page");
  const {language, uploadPath} = useSelector(state => state.app)
  const appEditData = useSelector((state) => state.app.editData);
  const [ editData , setEditData ] = useState(editDataDefault)
  const [ editDataValid , setEditDataValid ] = useState(editDataValidDefault)
  const [ cateId , setCateId ] = useState(0)
  const [ isFetching , setIsFetching ] = useState(false)
  const [previews, setPreviews] = useState({ src: "", file: null, name: null });
  const url =  window.location.origin + "/";

  
  useEffect(() => {
    if(!isOpen) {  
      setCateId(0)
      setPreviews({ src: "", file: null, name: null })
      setEditDataValid(editDataValidDefault)
      setEditData(editDataDefault)
    }  
  }, [isOpen])
  
  useEffect(() => {
    if (appEditData !== null ) {
      let newData = {}
      for (let key in appEditData) {
        if(key === "is_main_page" || key === "is_menu"){
          newData[`${key}`] = (appEditData[key] === 1) ? true:false;
        }else {
          newData[`${key}`] = (appEditData[key] !== null) ? appEditData[key] : "";
        }
      }

      setCateId(newData.cate_parent_id)
      setEditData({...newData, imageName: ""});
      if(newData.cate_thumbnail !== "") {
        setPreviews({file: null, src: uploadPath + newData.cate_thumbnail})
      }
    }
  }, [appEditData])
  
  const setPreviewHandler = (data) => {
    if(data.file) {
      setEditData({...editData, imageName: data.file.name})
      setPreviews(data)
    }
  }
 
  const saveModalHandler = () => {
    setEditDataValid({
      ...editDataValid, 
      cate_title: (editData.cate_title === "")
    })

    
    if(editData.cate_title === "" || isFetching){
      return false;
    }

    setIsFetching(true)
    const formData = new FormData();
    if(previews.file) {
      formData.append('Image', previews.file)
      formData.append('ImageName', editData.imageName)
    }
   
    let c = categoryData.filter(d => parseInt(d.id) === parseInt(cateId))
    formData.append('id', editData.id)
    formData.append('cate_parent_id', cateId)
    formData.append('cate_level', (cateId>0)?c[0].cate_level + 1:0)
    formData.append('cate_root_id', (cateId>0)?c[0].cate_root_id:editData.id)
    formData.append('cate_thumbnail_title', editData.cate_thumbnail_title)
    formData.append('cate_thumbnail_alt', editData.cate_thumbnail_alt)
    formData.append('cate_title', editData.cate_title)
    formData.append('cate_keyword', editData.cate_keyword)
    formData.append('cate_description', editData.cate_description)
    formData.append('cate_url', editData.cate_url)
    formData.append('cate_redirect', editData.cate_redirect)
    formData.append('cate_position', editData.cate_position)
    formData.append('cate_priority', editData.cate_priority)
    formData.append('is_menu', (editData.is_menu)?1:0)
    formData.append('is_menu_bottom', (editData.is_menu_bottom)?1:0)
    formData.append('is_main_page', (editData.is_main_page)?1:0)
    formData.append('language', language)
    
    svUpdateCategory(editData.id, formData).then(res => {
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
            <span>{t("ModalEditCategoryh2")}</span>
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
            <legend className="modal-legend">{t("ModalEditCategoryTitle")}</legend>
            
            <RadioBoxUI className="cate-menu-list" disabledId={editData.id} data={menuList} value={cateId} onChange={setCateId}/>
            <div className="form-details">
   
              <FieldsetUI className="image-setting" label={t("ModalInfoImage")}>
                <PreviewImageUI
                  className="add-image" 
                  previews={previews}
                  setPreviews={setPreviewHandler} />

                <div className="image-detail">
                  {previews.file && (
                    <TextField
                      onChange={(e) => setEditData({...editData, imageName: e.target.value})}
                      value={editData.imageName}
                      className="text-field-custom"
                      fullWidth={true}
                      error={false}
                      id="image-name"
                      label="Image name"
                      size="small"
                    />    
                  )}
                  <TextField
                    onChange={(e) => setEditData({...editData, cate_thumbnail_title: e.target.value})}
                    value={editData.cate_thumbnail_title}
                    className="text-field-custom"
                    fullWidth={true}
                    error={false}
                    id="image-title"
                    label="Image title"
                    size="small"
                  />
                  <TextField
                    onChange={(e) => setEditData({...editData, cate_thumbnail_alt: e.target.value})}
                    value={editData.cate_thumbnail_alt}
                    className="text-field-custom"
                    fullWidth={true}
                    error={false}
                    id="image-tag"
                    label="Alt description"
                    size="small"
                  />
                </div>
              </FieldsetUI>
              <h3 className="category-detail-title">{t("ModalDetail")}</h3>
              <TextField
                onChange={(e) => setEditData({...editData, cate_title: e.target.value})}
                value={editData.cate_title}
                className="text-field-custom"
                fullWidth={true}
                error={editDataValid.cate_title}
                id="cate-title"
                label="Title"
                size="small"
              />
              <TextField
                onChange={(e) => setEditData({...editData, cate_keyword: e.target.value})}
                value={editData.cate_keyword}
                className="text-field-custom"
                fullWidth={true}
                error={false}
                id="cate-keyword"
                label="Keyword"
                size="small"
              />
              <TextField
                onChange={(e) => setEditData({...editData, cate_description: e.target.value})}
                value={editData.cate_description}
                className="text-field-custom"
                fullWidth={true}
                error={false}
                id="cate-description"
                label="Description"
                size="small"
              />
              <TextField
                onChange={(e) => setEditData({...editData, cate_url: e.target.value})}
                placeholder="slug/example"
                value={editData.cate_url}
                className="text-field-custom"
                fullWidth={true}
                error={editDataValid.cate_url}
                id="cate-url"
                label={url}
                size="small"
              />
              <TextField
                onChange={(e) => setEditData({...editData, cate_redirect: e.target.value})}
                placeholder="Link Url"
                value={editData.cate_redirect}
                className="text-field-custom"
                fullWidth={true}
                error={false}
                id="cate-redirect"
                label="Redirect"
                size="small"
              />

              <h3 className="category-detail-title">{t("ModalSetting")}</h3>
              <div className="setting-controls">
                <div className="switch-form">
                  <FormGroup>
                    <FormControlLabel  control={<Switch onChange={(e)=> setEditData({...editData, is_menu: e.target.checked})} checked={editData.is_menu} />} label="Menu"  labelPlacement="start" />
                  </FormGroup>
                </div>
                <div className="switch-form">
                  <FormGroup>
                    <FormControlLabel  control={<Switch onChange={(e)=> setEditData({...editData, is_menu_bottom: e.target.checked})} checked={editData.is_menu_bottom} />} label="Footer Menu"  labelPlacement="start" />
                  </FormGroup>
                </div>
                <div className="switch-form">
                  <FormGroup>
                    <FormControlLabel  control={<Switch onChange={(e)=> setEditData({...editData, is_main_page: e.target.checked})} checked={editData.is_main_page} />} label="Website Display"  labelPlacement="start" />
                  </FormGroup>
                </div>
                <div className="input-group">
                  <div className="inp"> 
                    <ButtonUI
                      color="error"
                      onClick={(e) => (editData.cate_position > 1)?setEditData({...editData, cate_position: editData.cate_position - 1}):null} >
                      <FontAwesomeIcon icon={faMinus} />
                    </ButtonUI>
                    <span className="title">
                      {t("ModalPosition")} {editData.cate_position}
                    </span>
                    <ButtonUI onClick={(e) => setEditData({...editData, cate_position: editData.cate_position + 1}) }>
                      <FontAwesomeIcon icon={faAdd} />
                    </ButtonUI>
                  </div>
                </div>
                <div className="input-group">
                  <div className="inp"> 
                    <ButtonUI
                      color="error"
                      onClick={(e) => (editData.cate_priority > 1)?setEditData({...editData, cate_priority: editData.cate_priority - 1}):null} >
                      <FontAwesomeIcon icon={faMinus} />
                    </ButtonUI>
                    <span className="title">
                      {t("ModalPriority")} {editData.cate_priority}
                    </span>
                    <ButtonUI onClick={(e) => setEditData({...editData, cate_priority: editData.cate_priority + 1}) }>
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

export default ModalEditCategory;
