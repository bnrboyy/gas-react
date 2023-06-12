import {
  faArrowDownShortWide,
  faClock,
  faEyeSlash,
  faFolderOpen,
  faHandsWash,
  faLanguage,
  faUtensils
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, TablePagination } from "@mui/material";
import { t } from "i18next";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ContentCardUI from "../../../components/ui/content-card/content-card";
import DateMoment from "../../../components/ui/date-moment/date-moment";
import {
  getProductCategoryById,
  svDeleteProductCate
} from "../../../services/product-category.service";
import { appActions } from "../../../store/app-slice";
import ProductCateModalAdd from "../product-cate-action/product-cate-add-modal";
import ProductCateModalEdit from "../product-cate-action/product-cate-edit-modal";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";

const ProductsCateTab = (props) => {
  const dispatch = useDispatch();
  const isSuperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );
  const {
    setProductCateModalAdd,
    productCateModalAdd,
    tabSelect,
    productCate,
    isRowDisplay,
    setRefreshData,
  } = props;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limited, setLimited] = useState({ begin: 0, end: rowsPerPage });
  const [page, setPage] = useState(0);
  const [productCateModalEdit, setProductCateModalEdit] = useState({
    isEdit: true,
    isOpen: false
  });
  const modalSwal = withReactContent(Swal);

  const [filteredData, setFilteredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [editProduct, setEditProduct] = useState({});
  const language = useSelector((state) => state.app.language);

  const tabLists = [
    { value: "", title: "All", icon: <FontAwesomeIcon icon={faFolderOpen} /> },
    {
      value: "wash",
      title: "Wash&Dry",
      icon: <FontAwesomeIcon icon={faHandsWash} />
    },
    {
      value: "food",
      title: "Foods",
      icon: <FontAwesomeIcon icon={faUtensils} />
    },
    {
      value: "hidden",
      title: "Hidden",
      icon: <FontAwesomeIcon icon={faEyeSlash} />
    }
  ];

  const handleChange = (event, newValue) => {
    props.setTabSelect(newValue);
    setLimited({ begin: 0, end: rowsPerPage });
    setPage(0);
  };

  const addHandler = (item) => {
    dispatch(appActions.setEditData(item));
    setProductCateModalEdit({
      isEdit: false,
      isOpen: true
    });
  };

  const editHandler = (_id) => {
    getProductCategoryById({ id: _id, language: language }).then((res) => {
      const result = {
        id: res.data.id,
        title: res.data.title || "",
        details: res.data.details || "",
        display: !!res.data.display ? true : false,
        language: language,
        thumbnail_alt: res.data.thumbnail_alt || "",
        thumbnail_link: res.data.thumbnail_link || "",
        thumbnail_title: res.data.thumbnail_title || "",
        is_food: !!res.data.is_food ? true : false
      };
      setEditProduct(result);
      setProductCateModalEdit({
        isEdit: true,
        isOpen: true
      });
    });
  };

  const deleteHandler = (_id) => {
    modalSwal
      .fire({
        icon: "warning",
        title: "Are you sure?",
        text: "I want to delete this data!",
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#e11d48",
        showCancelButton: true,
        cancelButtonText: "Cancel"
      })
      .then((result) => {
        if (result.isConfirmed) {
          svDeleteProductCate({id: _id, language: language}).then((res) => {
            SwalUI({ status: res.status, description: res.description });
            if (res.status) {
              setRefreshData((prev) => prev + 1);
            }
          });
        }
      });
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
    const result = productCate?.filter((d) => {
      if (tabSelect !== "hidden") {
        if (tabSelect === "food") {
          if (!!d.is_food) {
            return d;
          }
        } else if (tabSelect === "") {
          return d;
        } else {
          if (!!!d.is_food) {
            return d;
          }
        }
      } else {
        if (d.display === 0) {
          return d;
        }
      }
    });
    if (result) {
      setTotalData(result.length);
      setFilteredData(result.slice(limited.begin, limited.end));
    }
  }, [tabSelect, productCate, page, rowsPerPage]);

  return (
    <Fragment>
      <Box className="slide-tab-section" sx={{ width: "100%" }}>
        <TabContext value={tabSelect}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              className={`tab-header`}
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              {tabLists.map((tab) => (
                <Tab
                  className="slide-tab-head-field"
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
              className={`slide-tab-body ${
                isRowDisplay ? "asRow" : "asColumn"
              }`}
              value={tab.value}
              key={tab.value}
            >
              <div className="item-list">
                {filteredData.map((item, index) => (
                  <ContentCardUI
                    onAddClick={() => editHandler(item.id)}
                    onEditClick={() => editHandler(item.id)}
                    onDeleteClick={() => deleteHandler(item.id)}
                    className="slide-card-content"
                    data={item}
                    isRowDisplay={isRowDisplay}
                    key={index}
                  >
                    <h3 className="title">
                      {isSuperAdmin && (
                        <span className="id" title="ref id">
                          [ {item.id} ]
                        </span>
                      )}
                      {item.title}
                    </h3>
                    <p className="desc">{item.details}</p>
                    <p className="display">
                      {item.created_at !== null && (
                        <Fragment>
                          <span className="fa-icon" title="hidden">
                            <FontAwesomeIcon icon={faClock} />
                          </span>
                          <span>
                            <DateMoment format={"LLL"} date={item.created_at} />
                          </span>
                        </Fragment>
                      )}
                    </p>
                    <p className="editor">
                      <span className="fa-icon" title="language">
                        <FontAwesomeIcon icon={faLanguage} />
                      </span>
                      <b>{item.language.toUpperCase()}</b>
                      <span className="fa-icon" title="priority">
                        <FontAwesomeIcon icon={faArrowDownShortWide} />
                        <b>{item.priority}</b>
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
      {
        <ProductCateModalAdd
          isEdit={false}
          totalData={totalData}
          isOpen={productCateModalAdd}
          setClose={setProductCateModalAdd}
          setRefreshData={setRefreshData}
        />
      }
      {productCateModalEdit.isOpen && (
        <ProductCateModalEdit
          isOpen={productCateModalEdit.isOpen}
          isEdit={productCateModalEdit.isEdit}
          setClose={setProductCateModalEdit}
          editProduct={editProduct}
          setRefreshData={setRefreshData}
        />
      )}
    </Fragment>
  );
};

export default ProductsCateTab;
