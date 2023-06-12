import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from 'axios';

import "./langconfig.scss";
import { faFilePen, faLanguage, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonUI from "../../components/ui/button/button";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import LangConfigTable from "./table/langTable";
import { useDispatch, useSelector } from "react-redux";
import AddLanguageConfig from "./modal/addLangConfig";
import EditLanguageConfig from "./modal/editLangConfig";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import DateMoment from "../../components/ui/date-moment/date-moment";
import { appActions } from "../../store/app-slice";

const LangConfigPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation("langconfig");
  const activateLanguage = useSelector((state) => state.auth.activateLanguage);
  const pageAvailable = useSelector((state) => state.app.frontOffice.pageAvailable )
  const uPermission = useSelector((state) => state.auth.userPermission);
  const [refreshData, setRefreshData] = useState(true)

  /* Tables */
  const [langConfigList, setLangConfigList] = useState([]);
  const [filterSearch, setFilterSearch] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageControl, setPageControl] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const [pagi, setPagi] = useState({
    pageIndex: 0,
    pageLimit: 10,
    pageStart: 0,
    pageEnd: 0,
    total: 0,
  });

  /* Modal */
  const [openAddModel, setOpenAddModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [updatedDate, setUpdatedDate] = useState(new Date().toISOString());
 

  useEffect(() => {
    if ( langConfigList.length > 0 && filterSearch.length === 0 && pageControl === "" && textSearch === "" ) {
      OnSearchChangeHandler(textSearch, pageControl);
    }
  }, [langConfigList, filteredData]);

  useEffect(() => {
    if(refreshData) {
      initData()
    }
  }, [refreshData]);

  useEffect(() => {

  }, [modalData]);
  
  const initData = async () => {
    setRefreshData(false)
    dispatch(appActions.isSpawnActive(true));

    await axios.get(`language/data`).then( response => {
      setLangConfigList(response.data.data);
      setFilterSearch([])
      return {status:true, description: response.data.description};
    }, error => {
      return {status:false, description: error.response.data.description};
    })

    dispatch(appActions.isSpawnActive(false));
  }
 
  const OnChangePageControlHandler = (e) => {
    setPageControl(e.target.value);
    OnSearchChangeHandler(textSearch, e.target.value);
  };

  const OnChangeTextSearchHandler = (e) => {
    setTextSearch(e.target.value);
    OnSearchChangeHandler(e.target.value, pageControl);
  };

  const OnSearchChangeHandler = (search, page) => {
    console.log(langConfigList)
    const checkValue = new RegExp(search, "gi");
    const checkPage = page;
    const filteredSearch = langConfigList.filter((data) => {
      /* ถ้าไม่ตรงกับ Page ที่ต้องการให้ปัดข้อมูลทิ้ง */
      if (checkPage !== "" && checkPage !== data.pageId) return false;

      if (search !== "") {
        /* ถ้ามีคำค้นหาแต่เข้าเงื่อนไข จะนำไปแสดง */
        const found = activateLanguage.filter((lang) => {
          if(data[lang]){
            let matched = data[lang].match(checkValue);
            if (matched) return lang;
          }
        })
        let matchValue = data.param.match(checkValue);
        if (matchValue || found.length > 0) return data;
      } else {
        /* ไม่มีการจำกัดการค้นหา */
        return data;
      }
    })
    filterDataWithPagination(
      {
        pageIndex: 0,
        pageLimit: pagi.pageLimit,
        pageStart: 0,
        pageEnd: pagi.pageLimit,
        total: pagi.total,
      },
      filteredSearch
    );
  };

  const filterDataWithPagination = (paginations, data = filterSearch) => {
    let pagiData = {
      pageIndex: parseInt(paginations.pageIndex),
      pageLimit: parseInt(paginations.pageLimit),
      pageStart: parseInt(paginations.pageIndex * paginations.pageLimit),
      pageEnd: parseInt(
        paginations.pageIndex * paginations.pageLimit + paginations.pageLimit
      ),
      total: data.length,
    };

    const pagiControlData = data.filter(
      (lang, index) => index >= pagiData.pageStart && index < pagiData.pageEnd
    );
    setPagi(pagiData);
    setFilterSearch(data);
    setFilteredData(pagiControlData);
  };

  const onResetModalData = () => {
    const mockData = {
      pageId: "",
      param: "",
      no: false,
      token: false,
      updated_at: false,
    }
    for (let lang of activateLanguage) {
      mockData[lang] = "";
    }
    setModalData(mockData);
  };

  const addLangConfigHandler = (data = null) => { 
    if (!data) {
      onResetModalData();
    } else {
      setModalData(data);
    }
    setOpenAddModel(true);
  };

  const editLangConfigHandler = (data) => {
    setModalData(data);
    setOpenEditModel(true); 
  }
 
  return (
    <section id="lang-page">
      <HeadPageComponent
        h1={t("LanguagePage")}
        icon={<FontAwesomeIcon icon={faLanguage} />}
        breadcrums={[{ title: t("LanguagePage"), link: false }]}
      />
      <div className="card-control">
        <div className="card-head">
          <div className="head-action">
            <ButtonUI
              onClick={(e)=> setRefreshData(true)}
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faRedo} />} >
              {t("Fetch")}
            </ButtonUI>
            {/* {(uPermission.admin) && (
              <ButtonUI
                on="delete"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faFilePen} />} >
                {t("WriteFile")}
              </ButtonUI>
            )} */}

            <FormControl className="searchpage"  variant="standard"  >
              <InputLabel id="filter-pgae">{t("selectPageControl")}</InputLabel>
              <Select
                labelId="filter-pgae"
                autoWidth
                id="filter-page"
                label="Page Control"
                className="input-page"
                size="small"
                onChange={OnChangePageControlHandler}
                value={pageControl} >
                <MenuItem value="">{t("selectPageControlNone")}</MenuItem>
                {pageAvailable &&
                  pageAvailable.map((menu) => (
                    <MenuItem key={menu.id} value={menu.id}>
                      {menu.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor={`text-search`}>{t("inputSearch")}</InputLabel>
              <Input
                size="small"
                id={`text-search`}
                value={textSearch}
                onChange={(e) => OnChangeTextSearchHandler(e)}
              />
            </FormControl>
            <ButtonUI on="create" onClick={addLangConfigHandler}>
              {t("AddLanguage")}
            </ButtonUI>
          </div>
        </div>
        <div className="card-body">
          <LangConfigTable
            setRefreshData={setRefreshData}
            langConfigList={filteredData}
            pagi={pagi}
            filterData={filterDataWithPagination}
            editData={editLangConfigHandler}
          />
        </div>
        <div className="card-footer"> 
          <div style={{ color: "gray", fontSize: ".65rem" }}>
            <span className="title">{t("LastUpdated")} : </span>
            <DateMoment format={"LLL"} date={updatedDate} />
          </div> 
        </div>
      </div>
      <AddLanguageConfig
        isOpenModal={openAddModel}
        modalData={modalData}
        activateLanguage={activateLanguage}
        setRefreshData={setRefreshData}
        setModalData={setModalData}
        setModal={setOpenAddModel}
        updatedDate={setUpdatedDate}
      />
      <EditLanguageConfig
        setRefreshData={setRefreshData}
        isOpenModal={openEditModel}
        modalData={modalData}
        activateLanguage={activateLanguage}
        setModalData={setModalData}
        setModal={setOpenEditModel}
        updatedDate={setUpdatedDate}
      />
    </section>
  );
};

export default LangConfigPage;
