import React, { useState } from 'react'
import CKeditorComponent from '../../components/ui/ckeditor/ckeditor';

import './showui.scss';

const ShowUIComponentPage = () => {
  const [ckeditorComponent, setCkValue ] = useState("This is data at begin!")

  return (
    <section className='showUi'>
      <div className='ckeditor-component'>
        <h2>CKEDITOR COMPONENT</h2>
        <div dangerouslySetInnerHTML={{ __html: ckeditorComponent }} /> 
        <CKeditorComponent
          url={`/api/upload/path`}   
          ckName={`customEditor`} 
          value={ckeditorComponent} 
          onUpdate={setCkValue} />
      </div>
      <hr />
      

    </section>
  )
}

export default ShowUIComponentPage;