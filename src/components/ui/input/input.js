import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormControl, IconButton, Input, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import React, { useState } from 'react'
import './input.scss'

/**
 * 
 * @param {variant} variant outlined, standard(default)
 * @param {label} label label input
 * @param {color} color secondary, primary(default) eg.
 * @param {type} type text, password eg.
 * @param {value} value default value for input
 * @param {size} size small, medium(default) 
 * @returns 
 */

const InputUI = (props) => {
    const [value, setValue] = useState(props.value)
    const [showPassword, setShowPassword] = useState(false)
    const variant = props.variant
    const TagInput = (variant === 'outlined')?OutlinedInput:Input
    function handleClickShowPassword() {
        setShowPassword(!showPassword)
    }
    return (
    <React.Fragment>
        <FormControl variant={variant?variant:'standard'} color={props.color} size={props.size} style={{marginBottom: '1rem'}}>
            <InputLabel>{props.label}</InputLabel>
            <TagInput type={props.type==='password'?(!showPassword?'text':'password'):props.type?props.type:'text'} defaultValue={value} label={props.label} onChange={(e)=>setValue(e.target.value)}
                endAdornment = {(props.type === 'password') &&
                    <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <FontAwesomeIcon icon={faEye}/> : <FontAwesomeIcon icon={faEyeSlash}/>}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    </React.Fragment>
    )
}

export default InputUI

// <InputUI label={'title'} type={'text'} color={'warning'} variant={'outlined'} value={'darkzone'} size={'small'}/>
// <InputUI label={'title'} type={'password'} color={'secondary'} value={'darkzone'}/>

// file name
// alt
// title
// description
// 
// meta title
// meta description