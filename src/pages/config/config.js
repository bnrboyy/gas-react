import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import SystemSection from "./config-system";
import axios from 'axios'; 

import "./config.scss";
import { faTools, faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LanguageSection from "./config-language";
import BannerSection from "./config-banner";
import DataTypeSection from "./config-datatype"; 
import ManualSection from "./config-manual";
import { appActions } from "../../store/app-slice";
import { getConfigData, getBankData } from "../../services/config.service";
 
const ConfigPage = () => {
  const { t } = useTranslation("config-page")
  const dispatch = useDispatch()
  const [buttonIsLoading, setButtonIsLoading] = useState(false)
  const userPermission = useSelector(state => state.auth.userPermission)
  const language = useSelector(state => state.app.language)
  const [refreshData, setRefreshData] = useState(0)
  const [isFetching, setIsFetching] = useState(false)

  const [languageArr, setLanguageArr] = useState([])
  const [bankData, setBankData] = useState([])
  const [bannerTypeArr, setBannerTypeArr] = useState([])
  const [infoTypeArr, setInfoTypeArr] = useState([])

  useEffect(() => {
    OnRefreshData()
  }, [refreshData, language])
  
  const OnRefreshData = async () => {
    if(!isFetching) {
      setIsFetching(true) 
      dispatch(appActions.isSpawnActive(true));
      
      getConfigData(language).then(res => { 
        setIsFetching(false)
        if(res.status) {
          setLanguageArr(res.data.languages )
          setBannerTypeArr(res.data.bannerTypes)
          setInfoTypeArr(res.data.infoTypes)
        }
        dispatch(appActions.isSpawnActive(false));
      })

      getBankData().then(res => setBankData(res.data))
    }
  }


  if(!userPermission.superAdmin) {
    return <h1>You have no permission to access!</h1>
  }
 
  const clickHandler = () => {
    setButtonIsLoading(!buttonIsLoading);
  }

  return (
    <Fragment>
      <HeadPageComponent
        h1={"จัดการบัญชีธนาคาร"}
        icon={<FontAwesomeIcon icon={faBuildingColumns} />}
        breadcrums={[{ title: "จัดการบัญชีธนาคาร", link: false }]} />
      <div className="config-page">
        <div className="center-pos" >
          <LanguageSection refresh={() => setRefreshData( refreshData + 1)} data={languageArr} bank={bankData}  />
        </div>
      </div>
    </Fragment>
  )
}


export default ConfigPage;
