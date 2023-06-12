import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { CKEditor  } from "ckeditor4-react";

import './ckeditor.scss';

const CKeditorComponent = (props) => {
  const {ckNameId , value , urlPath = "ckeditor/upload/image" } = props
  const apiPath = useSelector((state) => state.app.apiPath) 
  const CKBUILDER_CONFIG = {
    toolbar: [
      { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] }, 
      { name: 'document', items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
      { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
      { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
      { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
      '/',
      { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
      { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
      { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' , 'PageBreak' ] },
      { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'Iframe' ] },
      '/',
      { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
      { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
      { name: 'about', items: [ 'About' ] },

    ],
    extraPlugins: "",
    removePlugins: "removeButtons",
    filebrowserUploadUrl : apiPath + urlPath, 
    fileTools_requestHeaders : { 
      Authorization: `Bearer ${localStorage.authToken}`
    }
  }

  const onNamespaceLoaded = (CKEDITOR) => {
    CKEDITOR.plugins.addExternal( 'pastefromword', '/plugins/ckeditor/plugins/pastefromword/plugin.js', 'plugin.js' );
    CKBUILDER_CONFIG.extraPlugins = 'font,justify,pastefromword,colordialog,templates,print,exportpdf,colorbutton,pagebreak,iframe'; 
  }

  const onBeforeLoad = (CKEDITOR) => {

  } 
  const onFileUploadRequest = (event) => {  
    const data = event.data.requestData.upload; 
  }

  const onChangeCkeditor = (editor) => {
    props.onUpdate(editor.getData())
  }
  return (
    <div className={`ckeditor-component ${props.className}`} style={{ "--bgColor": "blue", "--bgColor2": "red" }}>
       <CKEditor  
          debug={false}
          config={CKBUILDER_CONFIG}
          name={ckNameId}
          initData={value}
          onNamespaceLoaded={ CKEDITOR => onNamespaceLoaded(CKEDITOR) }
          onChange={ ({ editor }) => onChangeCkeditor(editor) }
        />
    </div>
  );
};

export default CKeditorComponent;


/* ExampleComponent()
  const [ckeditorComponent, setCkValue ] = useState("test!")
  return (
    <Fragment>

      <div dangerouslySetInnerHTML={{ __html: ckeditorComponent }} /> 
      <CKeditorComponent 
        url={`/api/upload/path`}   
        ckNameId={`customEditor`} 
        value={ckValue} 
        onUpdate={setCkValue} />
    </Fragment>
  )

*/