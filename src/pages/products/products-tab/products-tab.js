import {
  faArrowDownShortWide,
  faClock,
  faEyeSlash,
  faFolderOpen,
  faHandsWash,
  faLanguage,
  faUtensils,
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
import { svDeleteProduct, svGetProductById } from "../../../services/product.service";
import { getProductCategory } from "../../../services/product-category.service";
import { getCategoryProduct } from "../../../services/category.service";
import { appActions } from "../../../store/app-slice";
import ProductModalAdd from "../product-action/product-add-modal";
import ProductModalEdit from "../product-action/product-edit-modal";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";

const ProductsTab = ({
  productModalAdd,
  setProductModalAdd,
  tabSelect,
  slideData,
  isRowDisplay,
  setRefreshData,
  setTabSelect,
}) => {
  const dispatch = useDispatch();
  const isSuperAdmin = useSelector((state) => state.auth.userPermission.superAdmin);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limited, setLimited] = useState({ begin: 0, end: rowsPerPage });
  const [page, setPage] = useState(0);
  const [productModalEdit, setProductModalEdit] = useState({
    isEdit: true,
    isOpen: false,
  });
  const { t } = useTranslation("product-page");
  const language = useSelector((state) => state.app.language);
  const modalSwal = withReactContent(Swal);

  const [filteredData, setFilteredData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [editProduct, setEditProduct] = useState({});
  const [productCate, setProductCate] = useState([]);
  const [cateForProduct, setCateForProduct] = useState([]);

  const tabLists = [
    { value: "", title: "ทั้งหมด", icon: <FontAwesomeIcon icon={faFolderOpen} /> },
    {
      value: "1",
      title: "เปลี่ยนถัง",
      icon: <FontAwesomeIcon icon={faHandsWash} />,
    },
    {
      value: "2",
      title: "ถังแก๊สใหม่",
      icon: <FontAwesomeIcon icon={faHandsWash} />,
    },
    {
      value: "3",
      title: "อุปกรณ์",
      icon: <FontAwesomeIcon icon={faHandsWash} />,
    },
    {
      value: "hidden",
      title: "รายการที่ไม่แสดง",
      icon: <FontAwesomeIcon icon={faEyeSlash} />,
    },
  ];

  const handleChange = (event, newValue) => {
    setTabSelect(newValue);
    setLimited({ begin: 0, end: rowsPerPage });
    setPage(0);
  };

  const addHandler = (item) => {
    dispatch(appActions.setEditData(item));
    setProductModalEdit({
      isEdit: false,
      isOpen: true,
    });
  };

  const editHandler = (_id) => {
    svGetProductById({ id: _id, language: language }).then((res) => {
      const result = {
        id: res.data.id,
        cate_id: parseInt(res.data.cate_id),
        content: res.data.content || "",
        description: res.data.description || "",
        details: res.data.details || "",
        display: !!res.data.display,
        language: res.data.language,
        more_details: res.data.more_details || "",
        price: res.data.price,
        thumbnail_alt: res.data.thumbnail_alt || "",
        thumbnail_link: res.data.thumbnail_link || "",
        thumbnail_title: res.data.thumbnail_title || "",
        title: res.data.title || "",
        created_at: res.data.created_at,
      };
      setEditProduct(result);
      setProductModalEdit({
        isEdit: true,
        isOpen: true,
      });
    });
  };

  const deleteHandler = (_id) => {
    modalSwal
      .fire({
        icon: "warning",
        title: "Are you sure?",
        text: "คุณต้องการลบข้อมูลหรือไม่?",
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#e11d48",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          svDeleteProduct({ id: _id, language: language }).then((res) => {
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

  // Select Product Category
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    getProductCategory(language).then((res) => {
      setProductCate(res.data);
    });
    getCategoryProduct(language).then((res) => {
      setCateForProduct(res.data);
    });

    const result = slideData?.filter((d) => {
      if (tabSelect !== "hidden") {
        return (
          (selectedCategoryId === "" || d.cate_id === selectedCategoryId) // Check if the selected category ID matches
        );
      } else {
        if (d.display === false) {
          return (

            (selectedCategoryId === "" || d.cate_id === selectedCategoryId) // Check if the selected category ID matches
          );
        }
      }
    });
    if (result) {
      setTotalData(result.length);
      setFilteredData(result.slice(limited.begin, limited.end));
    }
  }, [tabSelect, slideData, page, rowsPerPage, selectedCategoryId]);

   const handleChangeSelect = (event) => {
     const selectedId = event.target.value;
     const result = slideData.filter((item) => item.id === selectedId);
     setFilteredData(result);
     setSelectedCategoryId(selectedId); // Update the selected category ID state
   };


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
              className={`slide-tab-body ${isRowDisplay ? "asRow" : "asColumn"}`}
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
                    <p className="desc">{item.description}</p>
                    <p className="display">
                      {item.createdDate !== null && (
                        <Fragment>
                          <span className="fa-icon" title="hidden">
                            <FontAwesomeIcon icon={faClock} />
                          </span>
                          <span>
                            <DateMoment format={"LLL"} date={item.createdDate} />
                          </span>
                        </Fragment>
                      )}
                    </p>
                    <p className="editor">
                      <span className="fa-icon" title="language">
                        <FontAwesomeIcon icon={faLanguage} />
                      </span>
                      {/* <b>{item.language.toUpperCase()}</b> */}
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
        <ProductModalAdd
          setRefreshData={setRefreshData}
          isEdit={false}
          totalData={totalData}
          isOpen={productModalAdd}
          setClose={setProductModalAdd}
          productCate={productCate}
          cateForProduct={cateForProduct}
        />
      }
      {productModalEdit.isOpen && (
        <ProductModalEdit
          setRefreshData={setRefreshData}
          isOpen={productModalEdit.isOpen}
          isEdit={productModalEdit.isEdit}
          setClose={setProductModalEdit}
          editProduct={editProduct}
          productCate={productCate}
          cateForProduct={cateForProduct}
        />
      )}
    </Fragment>
  );
};

export default ProductsTab;
