import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../store/app-slice";
import { getWebinfo } from "../../services/webinfo.service";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import WebinfoTab from "./webinfo-tab/webinfo-tab";
import ButtonUI from "../../components/ui/button/button";
import ModalAddWebinfo from "./webinfo-modal/modal-add-webinfo"; 
import ModalEditWebinfo from "./webinfo-modal/modal-edit-webinfo";

import './webinfo.scss'; 
import { faAdd,  faInfoCircle,  faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WebInfoPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation(["webinfo-page"]);
  const language = useSelector(state => state.app.language)
  const [tabSelected, setTabSelected] = useState(0);
  const [webInfoData, setWebInfoData] = useState(null);
  const [tabLists , setTabLists] = useState([]);
  const [detail, setDetail] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false)
  const [isOpenEditModal, setIsOpenEditModal] = useState(false)
  const [isEditMode,setIsEditMode] = useState(null)
  const [modalData , setModalData] = useState(null)
  const [needFilter, setNeedFilter] = useState(0);
  const [refreshData, setRefreshData] = useState(0);

  let isFetching = false;

  useEffect(() => { 
    filterWebInfoData() 

  }, [needFilter])

  useEffect(() => {
    OnInIt() 
  },[refreshData, language]);
  
  const tabListFilter = (data) => { 
    data.map(rows => setTabLists((prev) => [...prev, {id: rows.id, title: rows.title, type: rows.typeName}]) )
  }

  const OnInIt = async () => { 
    if(!isFetching) {
      isFetching = true;
      dispatch(appActions.isSpawnActive(true))
      getWebinfo(language).then( res => {
        isFetching = false; 
        if(res.data) {
          setTabLists([{id: 1, title: 'Web Detail', type: 'detail'}]) 
          setDetail(res.data.details)
          setWebInfoData(res.data.info)
          tabListFilter(res.data.infoType);
          switchTabHandler(tabSelected)
        }
        dispatch(appActions.isSpawnActive(false))
      })
    }
  }

  const filterWebInfoData = () => {
    if(webInfoData) {
      const filtered =  webInfoData.filter(webInfo => {
        if((tabSelected || tabSelected === 0)  && tabSelected !== webInfo.infoTypeId){
          return false;
        }
        return webInfo;
      })
      setFilteredData(filtered)
    }
  }
  
  const switchTabHandler = (tabValue) => {
    setTabSelected(tabValue)
    setNeedFilter(needFilter + 1)
  }
   
  return (
    <section id="webinfo-page">
      <HeadPageComponent
        h1={t("ConfigTitle")}
        icon={<FontAwesomeIcon icon={faInfoCircle} />}
        breadcrums={[{ title: t("ConfigTitle"), link: false }]} />
        
      <div className="card-control">
        <div className="card-head">
          <h2 className="head-title">
            <ButtonUI
              onClick={(e)=> setRefreshData(refreshData + 1)}
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faRedo} />} >
              {t("Fetch")}
            </ButtonUI>
          </h2>
          <div className="head-action">
            {tabSelected > 1 && (
              <ButtonUI
                onClick={(e)=> setIsOpenAddModal(true)}
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faAdd} />} >
                {t("New")}
              </ButtonUI>
            )}
          </div>
        </div>
        <div className="card-body">
          {tabLists.length > 0 && (
            <WebinfoTab  
              refresh={() => setRefreshData(refreshData + 1)}
              tabLists={tabLists}
              webInfoData={filteredData} 
              detail={detail} 
              tabSelected={tabSelected} 
              setWebInfoData={setWebInfoData}
              switchTabHandler={switchTabHandler}  
              setModalData={setModalData}
              setEditModal={setIsOpenEditModal} 
              setIsEditMode={setIsEditMode} />
          )}
        </div>
      </div>

      <ModalAddWebinfo 
        refresh={() => setRefreshData(refreshData + 1)}
        tabId={tabSelected} 
        isOpenModal={isOpenAddModal} 
        setIsOpenAddModal={setIsOpenAddModal} 
        modalData={modalData} />

      <ModalEditWebinfo 
        refresh={() => setRefreshData(refreshData + 1)}
        setIsOpenEditModal={setIsOpenEditModal} 
        isOpenModal={isOpenEditModal} 
        isEditMode={isEditMode}
        tabId={tabSelected} 
        modalData={modalData} />

    </section>
  )
}

export default WebInfoPage;
