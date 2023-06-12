import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ContentCardUI from "../../../components/ui/content-card/content-card";
import { appActions } from "../../../store/app-slice";
import DateMoment from "../../../components/ui/date-moment/date-moment";
import SlideModalAdd from "../slide-action/slide-add-modal";
import SlideModalEdit from "../slide-action/slide-edit-modal";
import { svDeleteSlideByToken } from "../../../services/slide.service";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faImages }  from "@fortawesome/free-regular-svg-icons"; 
import { faAd, faArrowDownShortWide, faEyeSlash, faFolderOpen, faLanguage, faPenNib, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { TablePagination } from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
const modalSwal = withReactContent(Swal);

const tabLists = [
    { value: "0", title: "TabAll", icon: <FontAwesomeIcon icon={faFolderOpen} /> },
    { value: "1", title: "TabImages", icon: <FontAwesomeIcon icon={faImages} /> },
    { value: "2", title: "TabAds", icon: <FontAwesomeIcon icon={faAd} /> },
    { value: "3", title: "TabHidden", icon: <FontAwesomeIcon icon={faEyeSlash} /> },
]
 
const SlideTab = (props) => {
  const {slideModalAdd, setSlideModalAdd, tabSelect, slideData, isRowDisplay, pageControl} = props

  const dispatch = useDispatch()
  const { t } = useTranslation('slide-page')
  const isSuerperAdmin = useSelector(state => state.auth.userPermission.superAdmin)
  const [filteredData, setFilteredData] = useState([])
  const [totalData, setTotalData] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [limited, setLimited] = useState({begin: 0, end: rowsPerPage})
  const [slideModalEdit, setSlideModalEdit ] = useState({
    isEdit: true,
    isOpen: false
  }) 

  useEffect(() => {
 
    const result = slideData.filter((d, index) =>  {
      let tabNumber = parseInt(tabSelect)
      if(typeof pageControl === 'number' && pageControl !== d.pageId) {
        return false;
      }
      if(d.display && tabNumber === 3) {
        return false;
      }
      if(tabNumber !== 0 && tabNumber !== parseInt(d.type)) {
        return false;
      }
      return d
    }) 
   
    setTotalData(result.length)
    setFilteredData(result.slice(limited.begin, limited.end))
 
  }, [tabSelect, slideData, page, rowsPerPage, pageControl]);

  useEffect(() => {
 
  }, [filteredData]);

  const handleChange = (event, newValue) => { 
    props.setTabSelect(newValue);
    setLimited({begin: 0, end: rowsPerPage  })
    setPage(0)
  }

  /* Pagination */
  const handleChangePage = (event, newPage) => {
    setLimited({begin: newPage * rowsPerPage, end: (((newPage+1) * rowsPerPage) )})
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    let rowPage = parseInt(event.target.value, 10)
    setRowsPerPage(rowPage);
    setLimited({begin: 0, end: rowPage  })
    setPage(0);
  }

  const addHandler = (item) => {
    dispatch(appActions.setEditData(item))
    setSlideModalEdit({
      isEdit: false,
      isOpen: true
    })
  }

  const editHandler = (item) => { 
    dispatch(appActions.setEditData(item))
    setSlideModalEdit({
      isEdit: true,
      isOpen: true
    }) 
  }

  const deleteHandler = (item) => {
    modalSwal.fire({
      icon:"warning",
      title: "Are you sure?",
      text: "I want to delete this data!",
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#e11d48",
      showCancelButton: true,
      cancelButtonText: "Cancel"
    }).then(result => {
      if(result.isConfirmed){
        svDeleteSlideByToken(item.token,item.language).then(res => {
          SwalUI({status: res.status, description: res.description})
          if(res.status) {
            props.setRefreshData(prev => prev + 1)
          }
        })
      }
    })
  }
  

  return (
    <Fragment>
      <Box className="slide-tab-section" sx={{ width: '100%' }}>
          <TabContext value={tabSelect}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList className={`tab-header`} onChange={handleChange} aria-label="lab API tabs example">
                  {tabLists.map((tab) => ( 
                    <Tab className="slide-tab-head-field" value={tab.value} key={tab.value} icon={tab.icon} iconPosition="start" label={t(tab.title)} />
                  ))}
              </TabList>
              </Box>
              {tabLists.map((tab) => (
                <TabPanel className={`slide-tab-body ${(isRowDisplay)?"asRow":"asColumn"}`} value={tab.value} key={tab.value}>
                  <div className="item-list">
                    {filteredData.map((item,index) => (
                      <ContentCardUI 
                        onAddClick={() => addHandler(item)}
                        onEditClick={() => editHandler(item)}
                        onDeleteClick={() => deleteHandler(item)}
                        className="slide-card-content" 
                        data={item} 
                        isRowDisplay={isRowDisplay} 
                        key={index} >
                        <h3 className="title">
                          {isSuerperAdmin && <span className="id" title="ref id">[ {item.id} ]</span> }
                          {(item.title !== "")?item.title:item.imageTitle}
                        </h3> 
                        <p className="desc">{item.description}</p>   
                        <p className="display">
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
                        </p>  
                        <p className="editor">
                          { item.editor && (
                            <Fragment>
                              <span className="fa-icon" title="editor"><FontAwesomeIcon icon={faPenNib} /></span>
                              <span>{item.editor}</span>
                            </Fragment>
                          )}
                          <span className="fa-icon" title="language"><FontAwesomeIcon icon={faLanguage} /></span>
                          <b>{item.language.toUpperCase()}</b> 
                          <span className="fa-icon" title="priority"><FontAwesomeIcon icon={faArrowDownShortWide} /><b>{item.priority}</b> </span>
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
      {slideModalAdd && 
        <SlideModalAdd 
          setRefreshData={props.setRefreshData} 
          totalData={totalData} 
          positionList={props.positionList} 
          isOpen={slideModalAdd} 
          setClose={setSlideModalAdd} /> }
      {slideModalEdit.isOpen && 
        <SlideModalEdit 
          setRefreshData={props.setRefreshData} 
          positionList={props.positionList} 
          isOpen={slideModalEdit.isOpen} 
          isEdit={slideModalEdit.isEdit} 
          setClose={setSlideModalEdit} /> }
    </Fragment>
  )
}


export default SlideTab;
