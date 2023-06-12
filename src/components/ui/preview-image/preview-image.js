import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
// import { useSelector } from "react-redux";
import './preview-image.scss'; 

/*  Example 
    const [previews, setPreviews] = useState({src:"" ,file: null })
    <PreviewImageUI previews={previews} setPreviews={setPreviews} />
*/

const PreviewImageUI = (props) => { 
    let {previews, setPreviews, srcError = "/images/no-image.png"} = props;
    let { image, value } = "";

    const convertImagePreview = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        })
    }
    
    const previewImageHandler = async(e) => {
        value = e.target.files[0];
        image = await convertImagePreview(value);
        setPreviews({
            index: previews.index,
            src: image, 
            file: value,
            remove: true
        })
        e.target.value = null
    } 
    const imageError = (e) => {
        if(previews.file !== "" || previews.src !== "" ){
            setPreviews({
                ...previews,
                remove: false
            })
        }
       
        return e.target.setAttribute("src", srcError);
    }

    const removeImageHandler = (e) => {
        let _removeId =  (previews.removeId)?previews.removeId:null;

        setPreviews({
            index: previews.index,
            removeId: _removeId,
            file: undefined,
            src: undefined
        })
    }

    return (
        <div className={`upload-image-preview ${props.className}`} style={props.style} >
            <div className="group">
                <button type="button" 
                    className={`remove-image-btn ${(previews.remove)?"show":"hide"}`}
                    onClick={removeImageHandler}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <figure className="image-upload">
                    <input
                        className="inp-file"
                        type="file"
                        onChange={(e) => previewImageHandler(e)} />
                    <img title={previews.adImageTitle}
                        className="image-preview"
                        src={previews.src}
                        onError={imageError}
                        alt={""}
                    />
                </figure>
            </div>
        </div>
    )
}

export default PreviewImageUI;
