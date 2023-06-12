import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import WebInfoTable from "./webinfo-table";
import WebInfoDetail from "./webinfo-detail";

import { faCircle as fasfaCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as farfaCircle }  from "@fortawesome/free-regular-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}  >
      {value === index && <Box> {children} </Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}
const a11yProps = (index) => ({ id: `vertical-tab-${index}`,  "aria-controls": `vertical-tabpanel-${index}`, className: "webinfo-tab-head-title" })
  
const WebinfoTab = (props) => {
  const { t } = useTranslation(["webinfo-page"]);
  useEffect(() => {
  
  }, [props.tabSelected, props.webinfoData]);
  
  if(props.tabLists.length === 0) {
    return <div>error</div>
  }

  const tabMenu = (tab, index) => {
  
    return (
      <Tab key={index} 
        icon={<FontAwesomeIcon icon={(index === props.tabSelected)?fasfaCircle:farfaCircle} />} 
        label={t(tab.title)} 
        {...a11yProps(index)} /> 
    )
  }

  const tabBody = (tab, index) => {
    return (
      <TabPanel className="tab-body" value={props.tabSelected} index={index} key={index}>
        {props.tabSelected === 0 && (
          <WebInfoDetail 
            refresh={props.refresh}
            data={props.detail} 
            webInfoData={props.webInfoData} 
            setWebInfoData={props.setWebInfoData} />
        )}

        {props.tabSelected > 0 && (
          <WebInfoTable  
            refresh={props.refresh}
            setWebInfoData={props.setWebInfoData}
            webInfoData={props.webInfoData} 
            setModalData={props.setModalData} 
            setEditModal={props.setEditModal} 
            setIsEditMode={props.setIsEditMode} /> 
        )}
      </TabPanel>
    )
  }

  const handleChange = (event, newValue) => {
    props.switchTabHandler(newValue);
  }
 
  return (
    <Fragment>
      <Box className="webinfo-tab-box" sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex" }}  >
        <Tabs sx={{ borderRight: 1, borderColor: "divider" }}
          orientation="vertical"
          variant="scrollable"
          value={props.tabSelected}
          onChange={handleChange}
          aria-label="webinfo tabs"  >
          {props.tabLists && props.tabLists.map((tab,index)=> tabMenu(tab, index) )}
        </Tabs>
        {props.tabLists && props.tabLists.map((tab,index) => tabBody(tab, index) )}  
      </Box>
    </Fragment>
  );
}

export default WebinfoTab;


