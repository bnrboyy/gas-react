import React, { useRef, useState } from 'react'
import './post-image.scss';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const PostImageUI = (props) => {
  const img_select = useRef()
  const [image, setImage] = useState()
  const { t } = useTranslation("image")
  function handleUploadImg($event){
    img_select.current.src = URL.createObjectURL($event.target.files[0])
    setImage($event.target.files[0])
    /** use image vasriable to upload image */
  }
  const styles = {
    height: props.height||'10rem',
    width: props.width||'8rem'
  }
  return (
    <React.Fragment>
      <div className="img-components">
        <div>{t("imageTitle")}</div>
        <div className="post-image bg-red-500" style={styles}>
          <div className="preview-img">
            <figure>
              <img src={props.image} alt="" ref={img_select}/>
            </figure>
          </div>
          <div className="circle"></div>
          <FontAwesomeIcon icon={faCamera} />
          <input type="file" onChange={handleUploadImg} className="input-file"/>
        </div>
      </div>
    </React.Fragment>
  )
}

export default PostImageUI;