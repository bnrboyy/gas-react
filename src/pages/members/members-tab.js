import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, TablePagination } from "@mui/material";
import { t } from "i18next";
import React, { Fragment, useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import MembersCard from "./members-card";
import MemberModal from "./modal/member-modal";

const MembersTab = (props) => {
  const {
    tabSelect,
    setRefreshData,
    membersData
  } = props;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limited, setLimited] = useState({ begin: 0, end: rowsPerPage });
  const [page, setPage] = useState(0);
  const [memberModal, setMemberModal] = useState(false);

  const modalSwal = withReactContent(Swal);

  const [filteredData, setFilteredData] = useState(membersData);
  const [totalData, setTotalData] = useState(0);

  const tabLists = [
    { value: "", title: "All", icon: <FontAwesomeIcon icon={faFolderOpen} /> }
  ];

  const handleChange = (event, newValue) => {
    props.setTabSelect(newValue);
    setLimited({ begin: 0, end: rowsPerPage });
    setPage(0);
  };

  /* Pagination */
  const handleChangePage = (event, newPage) => {
    setLimited({
      begin: newPage * rowsPerPage,
      end: (newPage + 1) * rowsPerPage
    });
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    let rowPage = parseInt(event.target.value, 10);
    setRowsPerPage(rowPage);
    setLimited({ begin: 0, end: rowPage });
    setPage(0);
  };

  useEffect(() => {
    const result = membersData?.filter((d) => true);
    if (result) {
      setTotalData(result.length);
      setFilteredData(result.slice(limited.begin, limited.end));
    }
  }, [tabSelect, membersData, page, rowsPerPage]);

  return (
    <Fragment>
      <Box className="members-tab-section" sx={{ width: "100%" }}>
        <TabContext value={tabSelect}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              className={`tab-header`}
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              {tabLists.map((tab) => (
                <Tab
                  className="members-tab-head-field"
                  value={tab.value}
                  key={tab.value}
                  icon={tab.icon}
                  iconPosition="start"
                  label={t(tab.title)}
                />
              ))}
            </TabList>
          </Box>
          {tabLists.map((tab) => (
            <TabPanel
              className={`members-tab-body asRow`}
              value={tab.value}
              key={tab.value}
            >
              <div className="item-list">
                <MembersCard
                  item={filteredData}
                  memberModal={memberModal}
                  setMemberModal={setMemberModal}
                  setRefreshData={setRefreshData}
                />
              </div>

              <TablePagination
                component="div"
                count={totalData}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Fragment>
  );
};

export default MembersTab;
