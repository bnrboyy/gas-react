import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

const modalSwal = withReactContent(Swal);

const UploadImageWebInfo = (props) => {
  const language = useSelector((state) => state.app.language);
  const { image_1, image_2, image_3, image_4, favicon } = props.uploadImages;
  /* Set preview สำหรับหน้า upload */
  useEffect(() => {
  }, [props.uploadImages]);

  const convertImagePreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const previewImage = async (e, caseName = null) => {
    let value = "";
    let image = "";
    if (e) {
      value = e.target.files[0];
      image = await convertImagePreview(value);
    }

    switch (caseName) {
      case "image_1":
        props.setUploadImages({...props.uploadImages, image_1: {
          src: image, 
          file: value
        }})
        break;
      case "image_2":
        props.setUploadImages({...props.uploadImages, image_2: {
          src: image, 
          file: value
        }})
        break;
      case "image_3":
        props.setUploadImages({...props.uploadImages, image_3: {
          src: image, 
          file: value
        }})
        break;
      case "image_4":
        props.setUploadImages({...props.uploadImages, image_4: {
          src: image, 
          file: value
        }})
        break;
      case "favicon":
        props.setUploadImages({...props.uploadImages, favicon: {
          src: image, 
          file: value
        }})
        break;
    }
  };

  const removeImageHandler = async (e, status , caseName) => {
    if (props.uploadImages[`${caseName}`].size !== undefined) {
      /* Location delete */
      e.target.closest('.group').querySelector('.inp-file').value = null;
      previewImage(status, caseName);
      
    } else {

      /* Server delete */
      const confirmed = await modalSwal.fire({
          position: "center",
          width: 450,
          icon: "warning",
          title: "Are you sure?",
          text: "You want to delete this image!",
          confirmButtonText: "Yes, delete it.",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        }).then((result) => {
          return result.isConfirmed;
        });

      if (confirmed) {
        /* Fetching */
        const result = await axios.delete(`webinfo/image/${language}/${caseName}`).then((response) => { 
          return { status: true, description: response.data.description } 
        },(error) => { 
          return { status: false, description: error.response.data.description }
        })

        /* Response */
        if(result.status) {
          modalSwal.fire({
            position: "center",
            icon: "success",
            width: 450,
            title: "Successful",
            text: result.description,
            showConfirmButton: false,
            timer: 1000,
          })
          previewImage(false, caseName);
          setImageObjectFit(e);
        } else {
          modalSwal.fire({
            position: "center",
            icon: "error",
            width: 450,
            title: "Failed",
            text: result.description,
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    }
  };

  const setImageObjectFit = (e) => {
    let width = e.target.naturalWidth;
    let height = e.target.naturalHeight;
    if (width < 150 && height < 150) {
      e.target.classList.add("small-image");
    } else {
      e.target.classList.remove("small-image");
    }
  };

  return (
    <div className="upload-image-group">
      <div className="group">
        <figure className="image-upload">
          <input
            className="inp-file"
            type="file"
            onChange={(e) => previewImage(e, "image_1")}
          />
          <img
            title={image_1}
            className="image-preview"
            onLoad={setImageObjectFit}
            onError={(e) => e.target.setAttribute("src", "/images/no-image.png") }
            src={image_1.src}
          />
        </figure>
        <div className="image-label">
          <span>Logo #1</span>
          {image_1.src !== "" && (
            <button
              onClick={(e) => removeImageHandler(e,false, "image_1")}
              className="btn-remove-image">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </div>
      <div className="group">
        <figure className="image-upload">
          <input
            className="inp-file"
            type="file"
            onChange={(e) => previewImage(e, "image_2")}
          />
          <img
            title={image_2}
            className="image-preview"
            onLoad={setImageObjectFit}
            onError={(e) =>
              e.target.setAttribute("src", "/images/no-image.png")
            }
            src={image_2.src}
          />
        </figure>
        <div className="image-label">
          <span>Image #2</span>
          {image_2.src !== "" && (
            <button
              onClick={(e) => removeImageHandler(e,false, "image_2")}
              className="btn-remove-image"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </div>
      <div className="group">
        <figure className="image-upload">
          <input
            className="inp-file"
            type="file"
            onChange={(e) => previewImage(e, "image_3")}
          />
          <img
            title={image_3}
            className="image-preview"
            onLoad={setImageObjectFit}
            onError={(e) =>
              e.target.setAttribute("src", "/images/no-image.png")
            }
            src={image_3.src}
          />
        </figure>
        <div className="image-label">
          <span>Image #3</span>
          {image_3.src !== "" && (
            <button
              onClick={(e) => removeImageHandler(e,false, "image_3")}
              className="btn-remove-image"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </div>
      <div className="group">
        <figure className="image-upload">
          <input
            className="inp-file"
            type="file"
            onChange={(e) => previewImage(e, "image_4")}
          />
          <img
            title={image_4}
            className="image-preview"
            onLoad={setImageObjectFit}
            onError={(e) =>
              e.target.setAttribute("src", "/images/no-image.png")
            }
            src={image_4.src}
          />
        </figure>
        <div className="image-label">
          <span>Image #4</span>
          {image_4.src !== "" && (
            <button
              onClick={(e) => removeImageHandler(e,false, "image_4")}
              className="btn-remove-image"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </div>
      <div className="group">
        <figure className="image-upload">
          <input
            className="inp-file"
            type="file"
            onChange={(e) => previewImage(e, "favicon")}
          />
          <img
            title={favicon}
            className="image-preview"
            onLoad={setImageObjectFit}
            onError={(e) =>
              e.target.setAttribute("src", "/images/no-image.png")
            }
            src={favicon.src}
          />
        </figure>
        <div className="image-label">
          <span>#Favicon</span>
          {favicon.src !== "" && (
            <button
              onClick={(e) => removeImageHandler(e,false, "favicon")}
              className="btn-remove-image"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImageWebInfo;
