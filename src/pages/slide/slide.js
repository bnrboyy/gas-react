import React, { useEffect, useState } from "react";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import ButtonUI from "../../components/ui/button/button";
import SlideTab from "./slide-tab/slide-tab";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getSlides } from "../../services/slide.service";
import { appActions } from '../../store/app-slice';

import "./slide.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faImages, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SlidePage = () => {

  const dispatch = useDispatch();
  const { t } = useTranslation("slide-page");
  const pageAvailable = useSelector((state) => state.app.frontOffice.pageAvailable );
  const language = useSelector((state) => state.app.language );
  const [tabSelect, setTabSelect] = useState("0");
  const [slideData, setSlideData] = useState([])
  const [positionList, setPositionList ] = useState([]) 
  const [pageControl, setPageControl] = useState("");
  const [isRowDisplay, setIsRowDisplay ] = useState(true) 
  const [slideModalAdd, setSlideModalAdd ] = useState(false) 
  const [refreshData, setRefreshData ] = useState(0) 
 
  useEffect(() => { 
    dispatch(appActions.isSpawnActive(true)) 
    getSlides(language).then(res => {
      if(res.status){
        const slideData = res.data.map(d => {
          return {
            imageName: "", 
            id: d.id, 
            token: btoa(d.id), 
            image: d.ad_image, 
            imageTitle: d.ad_image_title, 
            imageAlt: d.ad_image_alt, 
            title: d.ad_title,
            description: d.ad_description,
            display: (d.ad_status_display === 1)?true:false, 
            pageId: (d.page_id)?parseInt(d.page_id):0,
            type: parseInt(d.ad_type),
            positionId: (d.ad_position_id)?parseInt(d.ad_position_id):0,
            priority: parseInt(d.ad_priority),
            link: d.ad_link,
            redirect: d.ad_redirect,
            h1: d.ad_h1,
            h2: d.ad_h2,
            dateDisplay: d.ad_date_display,
            dateHidden: d.ad_date_hidden,
            language: d.language,
            updatedDate: d.updated_at,
            editor: (d.editor !== undefined)?d.editor:null
          }
        })
        setSlideData(slideData)
        setPositionList(res.positionList)
      } else {
        setSlideData([])
        setPositionList([])
      }
      dispatch(appActions.isSpawnActive(false)) 
    })
  },[refreshData, language])

  return (
    <section id="slide-page">
      <HeadPageComponent
        h1={"SlidesPage"}
        icon={<FontAwesomeIcon icon={faImages} />}
        breadcrums={[{ title: "SlidesPage", link: false }]}  />
        <div className="card-control fixed-width">
          <div className="card-head">
            <div className="head-action">
              <h2 className="head-title">
                <ButtonUI 
                  onClick={() => setRefreshData(refreshData+1)}
                  on="create"
                  isLoading={false}
                  icon={<FontAwesomeIcon icon={faRedo} />} >
                  {t("Fetch")}
                </ButtonUI>
              </h2>
              <ContentFormatButton isRowDisplay={isRowDisplay} setIsRowDisplay={setIsRowDisplay} />
              <FormControl className="searchpage" variant="standard">
                <InputLabel id="select-filter-page">{t("selectPageControl")}</InputLabel>
                <Select 
                  labelId="select-filter-page"
                  autoWidth
                  id="filter-page-control"
                  label="Page Control"
                  className="input-page"
                  size="small"
                  onChange={(e) => setPageControl(e.target.value)}
                  value={pageControl} >
                  <MenuItem value="">{t("selectPageControlNone")}</MenuItem>
                  {pageAvailable && pageAvailable.map((menu) => (
                    <MenuItem key={menu.id} value={menu.id}> {menu.title} </MenuItem>
                  ))}
                </Select>
              </FormControl>  
              
              <ButtonUI 
                onClick={() => setSlideModalAdd(true)}
                style={{width: '150px'}}
                className="btn-add-slide"
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faAdd} />} >
                {t("btnAddSlide")}
              </ButtonUI>
            </div>
          </div>

          <SlideTab 
            setRefreshData={setRefreshData}
            positionList={positionList}
            slideModalAdd={slideModalAdd} 
            setSlideModalAdd={setSlideModalAdd}
            isRowDisplay={isRowDisplay}
            tabSelect={tabSelect} 
            pageControl={pageControl} 
            setTabSelect={setTabSelect} 
            slideData={slideData} />

        </div>
    </section>
  )
}

export default SlidePage;
