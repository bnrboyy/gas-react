import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import axios from 'axios';

import './modal.scss';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';

import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { IconButton, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import ButtonUI from '../../../components/ui/button/button'; 
import { useTranslation } from 'react-i18next';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const modalSwal = withReactContent(Swal);

const EditLanguageConfig = (props) => {
    const { t } = useTranslation("langconfig");
    const { isOpenModal, modalData, activateLanguage } = props 
    const pageAvailable = useSelector((state) => state.app.frontOffice.pageAvailable)
    const defaultLanguage = useSelector((state) => state.app.defaultLanguage)
    const [buttonIsLoading, setButtonIsLoading] = useState(false);

    useEffect(()=> {
     
    },[modalData])
 
    if(!isOpenModal) {
        return <Fragment></Fragment>
    }

    const saveModalHandler = async () => {
        setButtonIsLoading(true);
        const jsonData = {
            param:modalData.param,
            page: modalData.pageId
        }
        activateLanguage.map(ln => {
            jsonData[`${ln}`] = modalData[`${ln}`];
        })
        
        const result = await axios.patch(`language/edit`, jsonData ).then( response => {
            return {status: true, description: response.data.description}
        }, error => {
            return {status: false, description: error.response.data.description}
        })
        
        props.setModal(false);
        if(result.status){
            props.updatedDate(new Date().toISOString())
            props.setRefreshData(true);
            modalSwal.fire({
                position: "center",
                width: 450,
                icon: "success",
                title: "Successful",
                text: result.description,
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                setButtonIsLoading(false);
            })
        } else {
            modalSwal.fire({
                position: "center",
                width: 450,
                icon: "error",
                title: "Failed",
                text: result.description,
                showConfirmButton: false,
                timer: 1500,
            }).then( () => {
                setButtonIsLoading(false);
            })
        }
    }

    const closeModalHandler = () => {
        props.setModal(false);
    }

    const inputPatchData = (e, arg) => {
        const prevData = modalData;
        prevData[arg] = e.target.value
        props.setModalData(prevData);
    }

    return (
        <div>
            <Modal 
                open={isOpenModal}
                onClose={closeModalHandler}
                className={'modal-add-langconfig'}
                aria-labelledby="modal-add-langconfig"
                aria-describedby="">
                <Box className="modal-custom" >
                    <div className='modal-header'>
                        <h2>
                            <FontAwesomeIcon icon={faPencil} />
                            <span>{t("modalEdit")}</span>
                        </h2>
                        <IconButton className="param-generator" color="error"  sx={{ p: '10px' }}  onClick={closeModalHandler}>
                            <FontAwesomeIcon icon={faXmark} />
                        </IconButton>
                    </div>
                    <div className='modal-body'>
                        <fieldset className='modal-fieldset'> 
                            <legend className='modal-legend'>{t("modalEditLangConfig")}</legend>
                            <div className='input-group half'>
                                <FormControl className="inp " variant="standard" >
                                    <InputLabel htmlFor="add-param">Parameter Set</InputLabel>
                                    <Input disabled size="small" id="add-param" defaultValue={modalData.param} onKeyUp={(e) => inputPatchData(e, 'param') } /> 
                                </FormControl>
                            </div>
                            <div className='input-group half'> 
                                <FormControl className="inp " variant="standard" >
                                    <InputLabel id="add-page-label">Page Control</InputLabel> 
                                    <Select labelId="add-page-label" autoWidth id="add-page" label="Page Control"  size="small" 
                                        onChange={(e) => inputPatchData(e, 'pageId') } 
                                        defaultValue={modalData.pageId} >
                                        <MenuItem value={0}>None</MenuItem>
                                        {pageAvailable && pageAvailable.map((menu) => (
                                            <MenuItem key={menu.id} value={menu.id}>{menu.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            {activateLanguage && activateLanguage.map((lang)=> (
                                <div className='input-group' key={`loop-${lang}`}>
                                    <FormControl className="inp" variant="standard">
                                        <InputLabel htmlFor={`add-${lang}`}>{lang.toUpperCase()} title {(lang === defaultLanguage) && "( Default )"}</InputLabel>
                                        <Input size="small" id={`add-${lang}`} defaultValue={modalData[lang]} onKeyUp={(e) => inputPatchData(e, lang) } />
                                    </FormControl>
                                </div>
                            ))}
                        </fieldset>
                        
                    </div>
                    <div className='modal-footer'>
                        <ButtonUI className="btn-edit" on="save" width="md" 
                            loader={true}
                            isLoading={buttonIsLoading}
                            onClick={saveModalHandler}>{t("modalSave")}</ButtonUI>
                    </div>
                </Box>
            </Modal>
        </div>
    )
    }

export default EditLanguageConfig;
