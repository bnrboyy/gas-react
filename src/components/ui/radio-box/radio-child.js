import { FormControlLabel, Radio } from '@mui/material';
import React, { Fragment, useEffect } from 'react'

const RadioBoxChild = ({data, disabledId}) => {
    return (
        <Fragment>  
            {data.map((c, index) => (
                <Fragment key={index}>
                    {(c.hasChildren > 0)?( 
                        <>
                        <FormControlLabel
                            key={c.id}
                            data-level={c.cateLevel}
                            title={`Level ${c.cateLevel} | Parent ${c.parentId} | id ${c.id}`}
                            style={{"--level": c.cateLevel}}
                            className="box-item"
                            value={c.id}
                            control={<Radio  disabled={c.id === disabledId} />} 
                            label={c.title} />
                        <RadioBoxChild data={c.childrenData} disabledId={disabledId}/> 
                        </>
                    ):(
                        <FormControlLabel
                            key={c.id}
                            data-level={c.cateLevel}
                            title={`Level ${c.cateLevel} | Parent ${c.parentId} | id ${c.id}`}
                            style={{"--level": c.cateLevel}}
                            className="box-item"
                            value={c.id}
                            control={<Radio  disabled={c.id === disabledId} />} 
                            label={c.title} />
                    )}
                </Fragment>
            ))} 
        </Fragment>
  )
}

export default RadioBoxChild;