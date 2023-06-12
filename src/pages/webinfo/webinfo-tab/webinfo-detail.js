import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { webinfoDetailUpdate } from '../../../services/webinfo.service';
import { useSelector } from 'react-redux';
import ButtonUI from '../../../components/ui/button/button';
import SwalUI from '../../../components/ui/swal-ui/swal-ui';
import UploadImageWebInfo from './upload-image';

const WebInfoDetail = (props) => {
  const { data  } = props
  const { t } = useTranslation(["webinfo-page"]);
  const activateLanguage = useSelector(state => state.auth.activateLanguage)
  const language = useSelector(state => state.app.language)

  const uploadPath = useSelector(state => state.app.uploadPath) 
  const [uploadImages, setUploadImages] = useState(null) 
  const [webName, setWebName] = useState({token: data.webname.token, value: data.webname.value, error: false})
  const [extraName, setExtraname] = useState({token: data.extraname.token, value: data.extraname.value})
  const [companyName, setCompanyName] = useState({token: data.companyname.token, value: data.companyname.value})
  const [isFetching, setIsFetching] = useState(false)

  useEffect(()=> {
    setWebName({token: data.webname.token, value: data.webname.value, error: false})
    setExtraname({token: data.extraname.token, value: data.extraname.value})
    setCompanyName({token: data.companyname.token, value: data.companyname.value})
    clearImages()
  },[data])
 
  /* Set Images ที่มาจาก API */
  const clearImages = () => { 
    setUploadImages({
      image_1: {
        src: (data.image_1.link!=="")?uploadPath + data.image_1.link:"",
        file: null,
      }, 
      image_2: {
        src: (data.image_2.link!=="")?uploadPath + data.image_2.link:"",
        file: null,
      }, 
      image_3: {
        src: (data.image_3.link!=="")?uploadPath + data.image_3.link:"",
        file: null,
      }, 
      image_4: {
        src: (data.image_4.link!=="")?uploadPath + data.image_4.link:"",
        file: null,
      }, 
      favicon: {
        src: (data.favicon.link!=="")?uploadPath + data.favicon.link:"",
        file: null,
      }
    })
  }
 
  const OnWebDetailHandler = async () => {
    if(webName.value.length === 0) {
      setWebName({...webName, error: true} )
      return false;
    }

    setIsFetching(true)
    const formData = new FormData()
    if(uploadImages.image_1.file !== null) {
      formData.append('image_1', uploadImages.image_1.file)
    }
    if(uploadImages.image_2.file !== null) {
      formData.append('image_2', uploadImages.image_2.file)
    }
    if(uploadImages.image_3.file !== null) {
      formData.append('image_3', uploadImages.image_3.file)
    }
    if(uploadImages.image_4.file !== null) {
      formData.append('image_4', uploadImages.image_4.file)
    }
    if(uploadImages.favicon.file !== null) {
      formData.append('favicon', uploadImages.favicon.file)
    } 
    
    formData.append('webNameToken', webName.token )
    formData.append('webNameValue', webName.value )
    formData.append('extraNameToken', extraName.token )
    formData.append('extraNameValue', extraName.value )
    formData.append('companyNameToken', companyName.token )
    formData.append('companyNameValue', companyName.value )
    formData.append('language', language)
    
    webinfoDetailUpdate(formData).then(res => {
      setIsFetching(false)
      SwalUI({status: res.status, description: res.description})
      if(res.status) {
        clearImages()
        props.refresh()
        props.setWebInfoData(null)
      }
 
    })
  }

  return (
    <div className='web-info-detail'>
      <div className='blog-control upload-images'>
        <label>{t("UploadImageLabel")}</label>
        {uploadImages && 
          <UploadImageWebInfo 
            data={data} 
            uploadImages={uploadImages} 
            setUploadImages={setUploadImages} 
          />
        }
      </div>
      <div className='blog-control website-name'>
        <label>{t("WebsiteNameLabel")}</label>
        <div className='input-group'>
          <input className={`inp half ${(webName.error)?'inp-error':''}`} placeholder={t("WebsiteInp")} 
                onChange={(e) => setWebName({...webName, value: e.target.value, error: false})} 
                value={webName.value} />
          <input className='inp half' placeholder={t("ExtraInp")} 
                onChange={(e) => setExtraname({...extraName, value: e.target.value})} 
                value={extraName.value} />
          <input className='inp half' placeholder={t("CompanyInp")} 
                onChange={(e) => setCompanyName({...companyName, value: e.target.value})} 
                value={companyName.value} />
        </div>
      </div>
  
      <div className='blog-control website-name'>
        <label>{t("LanguageAvailableLabel")}</label>
        <div className='input-group'>
          <input className='inp half' disabled placeholder={activateLanguage.reduce((oldString, value) => `${oldString.toUpperCase()} / ${value.toUpperCase()}`)} />
        </div>
      </div>
      <div className='blog-control'>
        <label />
        <div className='input-group'>
          <ButtonUI 
            loader={true}
            isLoading={isFetching}
            on={'save'} 
            onClick={OnWebDetailHandler} >{t("btnSave")}</ButtonUI>
        </div>
      </div>
    </div>
  )
}

export default WebInfoDetail;


