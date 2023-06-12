import React, { Fragment, useEffect, useState } from "react";
import { appActions } from "../../../store/app-slice";
import { useDispatch, useSelector } from "react-redux";
import { svDeleteCategoryByToken } from "../../../services/category.service";
import ContentCardUI from "../../../components/ui/content-card/content-card";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownShortWide,
  faEyeSlash,
  faFolderOpen,
  faLanguage,
  faPenNib,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import { faWindowRestore } from "@fortawesome/free-regular-svg-icons";
import { TablePagination } from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
const modalSwal = withReactContent(Swal);

const tabLists = [
  { value: "0", title: "All", icon: <FontAwesomeIcon icon={faFolderOpen} /> },
  { value: "1", title: "Menu", icon: <FontAwesomeIcon icon={faSitemap} /> },
  {
    value: "2",
    title: "Website Display",
    icon: <FontAwesomeIcon icon={faWindowRestore} />,
  },
  { value: "3", title: "Hidden", icon: <FontAwesomeIcon icon={faEyeSlash} /> },
];

const CategoryTab = (props) => {
  const { tabSelect, categoryData, isRowDisplay, totalData } = props;
  const dispatch = useDispatch();
  const isSuerperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limited, setLimited] = useState({ begin: 0, end: rowsPerPage });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const result = categoryData.filter((c) => {
      c.cate_thumbnail = c.cate_thumbnail ? c.cate_thumbnail : "";
      if (tabSelect === "0") {
        return c;
      } else if (tabSelect === "1" && c.is_menu === 1) {
        return c;
      } else if (tabSelect === "2" && c.is_main_page === 1) {
        return c;
      } else if (tabSelect === "3" && c.is_main_page !== 1) {
        return c;
      }
    });

    props.setTotalData(result.length);
    setFilteredData(result.slice(limited.begin, limited.end));
  }, [tabSelect, categoryData, page, rowsPerPage]);

  useEffect(() => {}, [filteredData]);

  const handleChange = (event, newValue) => {
    props.setCategoryTab(newValue);
  };

  /* Pagination */
  const handleChangePage = (event, newPage) => {
    setLimited({
      begin: newPage * rowsPerPage,
      end: (newPage + 1) * rowsPerPage,
    });
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    let rowPage = parseInt(event.target.value, 10);
    setRowsPerPage(rowPage);
    setLimited({ begin: 0, end: rowPage });
    setPage(0);
  };

  const addHandler = (item) => {
    props.setModalEditCate(true);
    dispatch(appActions.setEditData({ ...item, isEdit: false }));
  };

  const editHandler = (item) => {
    props.setModalEditCate(true);
    dispatch(appActions.setEditData({ ...item, isEdit: true }));
  };

  const deleteHandler = (item) => {
    modalSwal
      .fire({
        icon: "warning",
        title: "Are you sure?",
        text: "I want to delete this data!",
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#e11d48",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          svDeleteCategoryByToken(item.id, item.language).then((res) => {
            SwalUI({ status: res.status, description: res.description });
            if (res.status) {
              props.setRefreshData((prev) => prev + 1);
            }
          });
        }
      });
  };

  return (
    <Box className="category-tab-section" sx={{ width: "100%" }}>
      <TabContext value={tabSelect}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabLists.map((tab) => (
              <Tab
                className="category-tab-header"
                value={tab.value}
                key={tab.value}
                icon={tab.icon}
                label={tab.title}
              />
            ))}
          </TabList>
        </Box>
        {tabLists.map((tab) => (
          <TabPanel
            className={`category-tab-body ${
              isRowDisplay ? "asRow" : "asColumn"
            }`}
            value={tab.value}
            key={tab.value}
          >
            <div className="item-list">
              {filteredData.map((item, index) => (
                <ContentCardUI
                  key={index}
                  onAddClick={() => addHandler(item)}
                  onEditClick={() => editHandler(item)}
                  onDeleteClick={() => deleteHandler(item)}
                  className="category-card-content"
                  data={{
                    alt: item.cate_thumbnail_alt,
                    image: item.cate_thumbnail,
                    language: item.language,
                  }}
                  isRowDisplay={isRowDisplay}
                >
                  <h3 className="title">
                    {isSuerperAdmin && (
                      <span className="id" title="ref id">
                        [ {item.id} ]
                      </span>
                    )}
                    {item.cate_title}
                  </h3>
                  <p className="keyword">{item.cate_keyword}</p>
                  <p className="desc">{item.cate_description}</p>
                  {/* <p className="display">
                      { item.dateDisplay !== null && (
                        <Fragment>
                          <span className="fa-icon" title="show"><FontAwesomeIcon icon={faStopwatch} /></span>
                          <span><DateMoment format={"LLL"} date={item.dateDisplay} /></span>
                        </Fragment>    
                      )}
                      { item.dateHidden !== null && (
                        <Fragment>
                          <span className="fa-icon" title="hidden"><FontAwesomeIcon icon={faClock} /></span> 
                          <span><DateMoment format={"LLL"} date={item.dateHidden} /></span>
                        </Fragment>
                      )}
                    </p>   */}
                  <p className="editor">
                    {item.editor && (
                      <Fragment>
                        <span className="fa-icon" title="editor">
                          <FontAwesomeIcon icon={faPenNib} />
                        </span>
                        <span>{item.editor}</span>
                      </Fragment>
                    )}
                    <span className="fa-icon" title="language">
                      <FontAwesomeIcon icon={faLanguage} />
                    </span>
                    <b>{item.language.toUpperCase()}</b>
                    <span className="fa-icon" title="priority">
                      <FontAwesomeIcon icon={faArrowDownShortWide} />
                      <b>{item.cate_priority}</b>{" "}
                    </span>
                  </p>
                </ContentCardUI>
              ))}
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
  );
};

export default CategoryTab;
