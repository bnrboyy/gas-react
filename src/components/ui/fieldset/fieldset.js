import React from 'react'
import './fieldset.scss';

const FieldsetUI = (props) => {
  return (
    <fieldset id={props.id} className={`fieldsetUI ${props.className}`} style={props.style}>
        <legend className="legendUI" >{props.label}</legend>
        {props.children}
    </fieldset>
  )
}

export default FieldsetUI