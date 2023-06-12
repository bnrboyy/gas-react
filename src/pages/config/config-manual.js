
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { faBook, faCloudUploadAlt, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonUI from "../../components/ui/button/button";
import { manualUploadService } from "../../services/config.service";

const ManualSection = (props) => {
  const { t } = useTranslation("config-page");
  const inpFile = useRef()
  const titleFile = useRef()
  const [isFetching, setIsFetching] = useState()
  const [file, setFile] = useState(null)
 
  const uploadPreview = (e) => {
    const file = e.target.files[0]
    e.value = null
    setFile(file)    
    let fileSize = parseFloat(file.size / (1024 * 1024)).toFixed(2)
    titleFile.current.textContent = `${file.name} (${fileSize}mb)`
  }

  const uploadManualHandler = (e) => {
    setIsFetching(true)
    if(file) {
      const formData = new FormData();
      formData.append('upload', file)
      formData.append('uploadPath', "upload/manual")
      formData.append('fileName', "manual.pdf")
      manualUploadService(formData).then(res => {
        setFile(null)
        setIsFetching(false)
      })
    }
  }

  return (
    <section className="manual-control small-blog">
      <div className="card-control">
        <div className="card-head">
          <div className="head-action">
            <h2 className="head-title"><FontAwesomeIcon icon={faBook} /> {t("ManualUpload")}</h2>
          </div>
        </div>
        <div className="card-body manual-upload">
         <div className="fileName" ref={titleFile}>PDF type only (5 MB)</div> 
         <input type="file" className="inp-file" ref={inpFile} accept="application/pdf" onChange={uploadPreview}/>
          { file && (
            <ButtonUI 
              onClick={uploadManualHandler}
              loader={true}
              isLoading={isFetching}
              icon={<FontAwesomeIcon icon={faCloudUploadAlt} /> } 
              className="btn-manual-upload"
              width="free"
              on="edit" >
              {t("Upload To Server")}
            </ButtonUI>
          )}
          <ButtonUI 
              onClick={() => inpFile.current.click()} 
              icon={<FontAwesomeIcon icon={faFilePdf} /> } 
              className="btn-manual-upload"
              on="add" >
              {t("Select File")}
            </ButtonUI>
        
         
        </div>
      </div>
    </section>
  );
};

export default ManualSection;
