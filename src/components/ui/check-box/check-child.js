import { Checkbox, FormControlLabel } from '@mui/material';
import React, { Fragment, useEffect } from 'react'


const CheckBoxChild = (props) =>  {
    const { data, value } = props
    
    const onChangeHandler = (e, level, rootId, cateId) => {
        let isChecked = e.target.checked
        props.onChange(level, rootId, cateId, isChecked)
    }

    if(!value || value.length === 0){
        return <></>
    }
 
    return (
        <Fragment>  
            {data.map((c, index) => (
                <Fragment key={index}>
                    {(c.hasChildren > 0)?( 
                        <>
                        <FormControlLabel
                            key={c.id}
                            checked={value[`${c.id}`].checked}
                            onChange={(e) => onChangeHandler(e, c.cateLevel, c.rootId, c.id)}
                            data-level={c.cateLevel}
                            title={`Level ${c.cateLevel} | Parent ${c.parentId} | id ${c.id}`}
                            style={{"--level": c.cateLevel}}
                            className="box-item"
                            value={c.id}
                            control={<Checkbox  />} 
                            label={c.title} />
                        <CheckBoxChild {...props} data={c.childrenData} value={value} /> 
                        </>
                    ):(
                        <FormControlLabel
                            key={c.id}
                            checked={value[`${c.id}`].checked}
                            onChange={(e) => onChangeHandler(e, c.cateLevel, c.rootId, c.id)}
                            data-level={c.cateLevel}
                            title={`Level ${c.cateLevel} | Parent ${c.parentId} | id ${c.id}`}
                            style={{"--level": c.cateLevel}}
                            className="box-item"
                            value={c.id}
                            control={<Checkbox />} 
                            label={c.title} />
                    )}
                </Fragment>
            ))} 
        </Fragment>
  )
}

export default CheckBoxChild  