import { faCamera, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import './more-image.scss';
 
const MoreImageUI = (props) => {
  const [moreImageFile, setMoreImageFile] = useState([])
  const [moreImage, setMoreImage] = useState([])
  function handleUploadImg($event) {
    setMoreImage([...moreImage, URL.createObjectURL($event.target.files[0])])
    setMoreImageFile([...moreImageFile, $event.target.files[0]])
  }
  return (
    <React.Fragment>
      <div className="more-image">
        <div className="preview-img">
          {moreImage.map((data, index) => {
            return (
              <div className="set-details" key={index}>
                <figure style={{height: '15rem'}}>
                  <img src={data} alt=""/>
                </figure>
              </div>
            )
          })}
          <div className="upload-more" style={{height: '15rem'}}>
            <div className="circle"></div>
            <FontAwesomeIcon icon={faCamera} className="camera"/>
            <FontAwesomeIcon icon={faPlus} className="plus"/>
            <input type="file" onChange={handleUploadImg} className="input-file"/>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default MoreImageUI;