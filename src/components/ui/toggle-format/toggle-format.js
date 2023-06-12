import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'

import './toggle-format.scss';
import { faCube, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContentFormatButton = (props) => {
    const {isRowDisplay, setIsRowDisplay } = props;
    const toggleHandler = (status) => {
        setIsRowDisplay( status )
    }
    return (
        <div className='content-format-button'>
            <button className={`btn-display-row ${(isRowDisplay)?"active":""}`} onClick={() => toggleHandler(true)} title="row list" >
                <FontAwesomeIcon icon={faList} />
            </button>
            <button className={`btn-display-col ${(!isRowDisplay)?"active":""}`} onClick={() => toggleHandler(false)} title="column list">
                <FontAwesomeIcon icon={faCube} />
            </button>
        </div>
    )
}

export default ContentFormatButton