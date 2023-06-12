import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AdminTab from "./admin-tab/admin-tab";
import ButtonUI from "../../components/ui/button/button";
import HeadPageComponent from "../../components/layout/headpage/headpage";
// import DateMoment from "../../components/ui/date-moment/date-moment";
import {appActions} from '../../store/app-slice';

import "./admin.scss"; 
import { faRedo, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getAdminData } from "../../services/admin.service";

const AdminPage = () => {
  const { t } = useTranslation(["admin-page"]);
  const activateLanguage = useSelector(state => state.auth.activateLanguage)
  const dispatch = useDispatch();
  // const [updatedDate, setUpdatedDate] = useState(new Date().toISOString());
  const [isFetching, setIsFetching] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [adminStatus, setAdminStatus] = useState("");
  const [adminTab, setAdminTab] = useState(0);
  const [adminData, setAdminData] = useState([]);
  const [filteredAdminData, setFilteredAdminData] = useState([]);
 

  useEffect(() => { 
    if(!isFetching) {
      setIsFetching(true)
      dispatch(appActions.isSpawnActive(true));
      getAdminData().then((res) => {
        if(res.data.length > 0) {
          const resultData = res.data.map((obj) => {
            let langArr = obj.languageActive.split(",")
            const setlangs = activateLanguage.map(lang => {
              return {
                value: langArr.includes(lang),
                name: lang
              }
            })
            return {...obj, languageActive: setlangs}
          }) 
          setAdminData(resultData) 
          setIsFetching(false)
        }
        dispatch(appActions.isSpawnActive(false));
      })
    }
    
  }, [refreshData])

  useEffect(() => { 
    filterAdminData() 
  },[adminData, adminTab, adminStatus])

 
  const filterAdminData = () => {
    setRefreshData(false)
    if(adminData.length > 0 ) {
      const filtered =  adminData.filter(admin => {
        if(adminTab && adminTab !== admin.roleId){
           return false;
        }
        if(adminStatus !== "" && parseInt(adminStatus) !== parseInt(admin.status)){
          return false;
       }
       return admin;
      })
      setFilteredAdminData(filtered) 
    }
  }

  const slcAdminStatusHandler = (e) => {
    setAdminStatus(e.target.value) 
  }
  const switchAdminTabHandler = (tabValue) => {
    setAdminTab(tabValue) 
  }

  return (
    <section id="admin-page">
      <HeadPageComponent
        h1={"AdminPage"}
        icon={<FontAwesomeIcon icon={faUserShield} />}
        breadcrums={[{ title: "AdminPage", link: false }]} />
      <div className="card-control">
        <div className="card-head">
          <h2 className="head-title" >
            <ButtonUI
              onClick={()=> setRefreshData(refreshData + 1)}
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faRedo} />} >
              {t("Fetch")}
            </ButtonUI>
          </h2> 
          <div className="head-action">
            <FormControl variant="standard" size="small">
              <InputLabel id="slc-status">User Status</InputLabel>
              <Select
                className="slc-admin-status"
                labelId="slc-status"
                id="slc-status"
                onChange={slcAdminStatusHandler}
                value={adminStatus}
                label="slc-status" >
                <MenuItem value=""><em>Default</em></MenuItem>
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={2}>Pending</MenuItem>
                <MenuItem value={3}>Banned</MenuItem>
                <MenuItem value={4}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="card-body">
          <AdminTab 
            refreshData={() => setRefreshData(refreshData + 1)}
            adminData={filteredAdminData} 
            setAdminData={setAdminData} 
            adminTab={adminTab} 
            setAdminTab={switchAdminTabHandler} />
        </div>
        {/* <div className="card-footer">
          <div style={{ color: "gray", fontSize: ".65rem" }}>
            <span className="title">{t("LastUpdated")} : </span>
            <DateMoment format={"LLL"} date={updatedDate} />
          </div>
        </div> */}
      </div>
    </section>
  );
}

export default AdminPage;
