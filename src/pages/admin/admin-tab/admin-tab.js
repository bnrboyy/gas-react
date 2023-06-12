import React, { Fragment } from "react";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import CardAdmin from "./admin-card-tab";
import { useSelector } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box> {children} </Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index, isAllow) {
  return { id: `vertical-tab-${index}`, "aria-controls": `vertical-tabpanel-${index}`, className: `admin-tab-head-title ${(!isAllow)?"hidden-tab":""}`}
}


const AdminTab = (props) => {
  const userPermission = useSelector(state => state.auth.userPermission)
  const tabLists = [
    {index: 0, title: "All", allow: true },
    {index: 1, title: "Superadmin", allow: userPermission.superAdmin },
    {index: 2, title: "Admin", allow: userPermission.admin },
    {index: 3, title: "Officer", allow: userPermission.officer },
    {index: 4, title: "Rider", allow: userPermission.user },
  ]

  const handleChange = (event, newValue) => {
    props.setAdminTab(newValue);
  }

  return (
    <Fragment>
      <Box className="admin-tab-box" sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex" }}  >
        <Tabs className="admin-tab-header" 
          sx={{ borderRight: 1, borderColor: "divider" }}
          orientation="vertical"
          variant="scrollable"
          value={props.adminTab}
          onChange={handleChange}
          aria-label="admin tabs"  >
          {tabLists && tabLists.map((tab)=> <Tab label={tab.title} {...a11yProps(tab.index, tab.allow) } key={tab.index} /> )}
        </Tabs>
        {tabLists && tabLists.map((tab) => (
          <TabPanel className="tab-body" value={props.adminTab} index={tab.index} key={tab.index}>
            <CardAdmin data={props.adminData} refreshData={props.refreshData} />
          </TabPanel>
        ))}
      </Box>
    </Fragment>
  )
}

export default AdminTab;
