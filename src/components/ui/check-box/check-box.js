import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react'
import CheckBoxChild from './check-child';
import './check-box.scss';  
import { useTranslation } from 'react-i18next';

const CheckBoxUI = (props) => {
  const { t, data, menuList, disabled = null , error = false} = props  
  const changeHandler = (level, rootId, cateId, isChecked) => {
    const result = data.map((d)=> {
      if(d.level <= level && d.rootId === rootId){
        if(cateId !== d.id ){
          if(isChecked && rootId > 0) {
            d.checked = true
          }
        } else {
          d.checked = !d.checked;
        }
      }
      return d;
    })
    props.setData(result)
  }
  
  return (
    <div className={`box-checkbox-container ${props.className} ${(error)?'error':''}`}>
        <div className="brc-body overflow-scroll-custom">
            <FormControl className='brc-form-control'>
                <FormLabel id="box-checkbox">{t("Category")}</FormLabel>
                <RadioGroup
                  aria-labelledby="box-checkbox"
                  name="controlled-checkbox-buttons-group" >  
                  {menuList && 
                    <CheckBoxChild 
                      onChange={changeHandler} 
                      value={data}
                      data={menuList} 
                      disabled={disabled} 
                    /> 
                  }
                </RadioGroup>
            </FormControl>
        </div>
    </div>
  )
}

export default CheckBoxUI  