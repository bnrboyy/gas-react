import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

import LoadingButton from "@mui/lab/LoadingButton";
import "./button.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowDown,
  faEdit,
  faPlus,
  faSave,
  faTrash,
  faRotateRight,
  faPowerOff,
  faRedoAlt
} from "@fortawesome/free-solid-svg-icons";

/**
 * @param on "create,add,edit,delete,save"
 * @param size "xs,sm,md,lg,xl"
 * @param text required
 * @param icon required
 */
const ButtonUI = (props) => {
  const onEvent = props.on;
  const languageSelected = useSelector((state) => state.app.language)
  const [buttonLang, setButtonLang] = useState("");
  const [buttonText, setButtonText] = useState(props.children);
  const [buttonIcon, setButtonIcon] = useState(props.icon);
  const [btnSize, setButtonSize] = useState(props.size);
  const [btnWith, setButtonWidth] = useState(props.width);
  
  useEffect(() => { 
  
    if(buttonLang !== languageSelected) {
      setLanguage()
    }
    if(buttonText !== props.children){
      setButtonText(props.children)
    }
  }, [languageSelected, props.isLoading, props.children]);

  const setLanguage = () => {
    setButtonLang(languageSelected)
    switch (onEvent) {
      case "create":
        if(props.icon === undefined) {setButtonIcon(<FontAwesomeIcon icon={faPlus} />)}
        if(props.children === undefined) setButtonText("Create");
        if(props.width === undefined) setButtonWidth('md');
        break;
      case "add":
        if(props.icon === undefined) {setButtonIcon(<FontAwesomeIcon icon={faPlus} />)}
        if(props.children === undefined) setButtonText("Add");
        if(props.width === undefined) setButtonWidth('md');
        break;
      case "fetch":
        if(props.icon === undefined) {setButtonIcon(<FontAwesomeIcon icon={faCloudArrowDown} />)}
        if(props.children === undefined) setButtonText("Fetch");
        if(props.width === undefined) setButtonWidth('md');
        break;
      case "edit":
        if(props.icon === undefined) {setButtonIcon(<FontAwesomeIcon icon={faEdit} />)}
        if(props.children === undefined) setButtonText("Edit");
        if(props.width === undefined) setButtonWidth('md');
        break;
      case "delete":
        if(props.icon === undefined) {setButtonIcon(<FontAwesomeIcon icon={faTrash} />)}
        if(props.children === undefined) setButtonText("Delete");
        if(props.width === undefined) setButtonWidth('md');
        break;
      case "save":

        if(props.icon === undefined) {setButtonIcon(<FontAwesomeIcon icon={faSave} />)}
        if(props.children === undefined) setButtonText("Save");
        if(props.width === undefined) setButtonWidth('md');
        break;
      case "cancel":
        if(props.icon === undefined) {setButtonIcon(<FontAwesomeIcon icon={faRedoAlt} />)}
        if(props.children === undefined) setButtonText("Cancel");
        if(props.width === undefined) setButtonWidth('md');
        break;
      case "redo":
        if(props.icon === undefined) {setButtonIcon(<FontAwesomeIcon icon={faRotateRight} />)}
        if(props.children === undefined) setButtonText("Clear");
        if(props.width === undefined) setButtonWidth('md');
        break;
      default:
        if(btnWith === undefined) setButtonWidth('free');
        if(btnSize === undefined) setButtonSize('medium');
        break;
    }
  }

  const OnClickHandler = () => { 
    if(!props.isLoading) {
      props.onClick()
    }
  }
 
  return (
    <LoadingButton
      style={props.style}
      onClick={OnClickHandler}
      className={`custom-btn btn${onEvent} ${props.className} ${btnWith}`}
      loading={props.isLoading}
      startIcon={buttonIcon}
      loadingPosition={buttonIcon && "start"} 
      variant="contained"
      size={btnSize} >
      {buttonText}
    </LoadingButton>
  );
};

export default ButtonUI;

/* ตัวอย่าง */
/* 
  const [buttonIsLoading, setButtonIsLoading ] = useState(false)
  const clickHandler = () => {
      setButtonIsLoading(!buttonIsLoading)
  }

  <ButtonUI 
    on="create" 
    width="free"
    loader={true}
    isLoading={buttonIsLoading}
    onClick={clickHandler} 
    > 
    Text Something
  </ButtonUI>
  <ButtonUI className='test-style' width="free"><FontAwesomeIcon icon={faImages} /></ButtonUI>
  <ButtonUI on="add"  width="md" />
*/
