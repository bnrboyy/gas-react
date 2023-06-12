import React, {  Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateMoment from "../../../components/ui/date-moment/date-moment";
import ModalAddPost from "../post-modal/post-add-modal";
import ModalEditPost from "../post-modal/post-edit-modal";
import ContentCardUI from "../../../components/ui/content-card/content-card";
 
import { faEyeSlash, faFolderOpen,  faMapPin, faLanguage, faLink, faPenNib, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faNewspaper }  from "@fortawesome/free-regular-svg-icons"; 
import { TablePagination } from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import { svDeletePostByToken } from "../../../services/post.service";
import { appActions } from "../../../store/app-slice";
import { useTranslation } from "react-i18next";
const modalSwal = withReactContent(Swal);

const tabLists = [
    { value: "0", title: "All", icon: <FontAwesomeIcon icon={faFolderOpen} /> },
    { value: "1", title: "Display", icon: <FontAwesomeIcon icon={faNewspaper} /> },
    { value: "2", title: "Pin Post", icon: <FontAwesomeIcon icon={faMapPin} /> },
    { value: "3", title: "Hidden", icon: <FontAwesomeIcon icon={faEyeSlash} /> },
] 


const PostTab = (props) => {
  const { t } = useTranslation('post-page')
  const { postModalAdd,setPostModalAdd,menuList, postTab, postData, isRowDisplay, pageControl, category } = props;
  const dispatch = useDispatch()
  const isSuerperAdmin = useSelector(state => state.auth.userPermission.superAdmin)
  const [totalData, setTotalData] = useState(-1)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [limited, setLimited] = useState({begin: 0, end: rowsPerPage})
  const [filteredData, setFilteredData] = useState([]) 
  const [ items , setItems ] = useState(null) 
  const [postModalEdit, setPostModalEdit] = useState({
    isEdit: false,
    isOpen: false
  })  

  useEffect(() => { 
    if(category.length > 0) {
      setPostFilterData().then(res => {
        setTotalData(res.length)
        setFilteredData(res.slice(limited.begin, limited.end))
      })
    }
  }, [postTab, postData, page, rowsPerPage, pageControl, category]);

  const setPostFilterData = async () => {
    const filtered = await postData.filter((f) => { 
      /* กรอง Tab */
      if(postTab === "1" && f.status_display === 0){
        return false;
      } else if(postTab === "2" && f.pin === 0){
        return false;
      } else if(postTab === "3" && f.status_display === 1){
        return false
      }
      /* กรอง Page */
      if(pageControl !== "") {
        let category = f.category.slice(1,-1).split(',')
        if(!category.includes(`${pageControl}`)){
          return false
        } 
      }
      return f
    })
    const maped = await filtered.map((d) => {
      let exp = d.category.slice(1,-1).split(',')
      const cateLists = exp.map(cid => category[parseInt(cid)])
      return {...d, cateLists}
    }) 
    return maped;
  }

  const handleTabChange = (event, newValue) => {
    props.setPostTab(newValue);
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
    // dispatch(appActions.setEditData({...item, mount: ((item.mount)?1:0) + 1}))
    setItems(item)
    setPostModalEdit({
      isEdit: false,
      isOpen: true
    }) 
  }
  
  const editHandler = (item) => {
    setItems(item)
    setPostModalEdit({
      isEdit: true,
      isOpen: true
    }) 

  } 
  const deleteHandler = (item) => {
    let buttonIcon = (item.is_maincontent === 1)?"question":"warning";
    let text = (item.is_maincontent === 1)?" ( Main Content )":" Content";
 
    modalSwal.fire({
      icon: buttonIcon,
      title: "Delete" + text,
      text: `Do you want to delete "${item.title}" ?`  ,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#e11d48",
      showCancelButton: true,
      cancelButtonText: "Cancel"
    }).then(result => {
      if(result.isConfirmed){
        svDeletePostByToken(item.id,item.language).then(res => {
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

    <Box className="post-tab-section" sx={{ width: '100%' }}>
      <TabContext value={postTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
              {tabLists.map((tab) => (
                <Tab className="post-tab-header" 
                  value={tab.value} 
                  key={tab.value} 
                  icon={tab.icon} 
                  label={t(tab.title)} />
              ))}
          </TabList>
          </Box>
          {tabLists.map((tab) =>  (
          
            <TabPanel className={`post-tab-body ${(isRowDisplay)?"asRow":"asColumn"}`} value={tab.value} key={tab.value}>
              <div className="item-list"> 
                {filteredData.map((item,index) => (
                  <ContentCardUI 
                    key={index} 
                    onAddClick={() => addHandler(item)}
                    onEditClick={() => editHandler(item)}
                    onDeleteClick={() => deleteHandler(item)}
                    mainContent={item.is_maincontent}
                    className="post-card-content" 
                    data={{
                      alt: item.thumbnail_alt,
                      image: item.thumbnail_link,
                      language: item.language,
                    }} 
                    isRowDisplay={isRowDisplay} 
                  >
                    <h3 className="title">
                      {isSuerperAdmin && <span className="id" title="ref id">[ {item.id} ]</span> }
                      {item.title}
                      {item.is_maincontent ? <span className="id" title="ref id"> ( Main Content )</span> : <></>}
                    </h3> 
                    <p className="desc">{item.description}</p>
                    <p className="cate">
                      <span className="fa-icon" title="category"> <FontAwesomeIcon icon={faLink} /></span>
                      <span>{item.cateLists.map((c,index) => (index>0)?` , ${c?.title}`:c?.title) }</span>
                    </p> 
                    <p className="display">
                    { item.date_begin_display !== null && (
                      <Fragment>
                        <span className="fa-icon" title="show"><FontAwesomeIcon icon={faStopwatch} /></span>
                        <span><DateMoment format={"LLL"} date={item.date_begin_display} /></span>
                      </Fragment>
                    )}
                    { item.date_end_display !== null && (
                      <Fragment>
                        <span className="fa-icon" title="hidden"><FontAwesomeIcon icon={faClock} /></span> 
                        <span><DateMoment format={"LLL"} date={item.date_end_display} /></span>
                      </Fragment>
                    )}
                  </p> 
                    <p className="editor">
                      {item.editorName && (
                        <>
                          <span className="fa-icon" title="editor"><FontAwesomeIcon icon={faPenNib} /></span>
                          <span>{item.editorName}</span>
                        </>
                      )}
                      <span className="fa-icon" title="editor"><FontAwesomeIcon icon={faLanguage} /></span>
                      <b>{item.language.toUpperCase()}</b> 
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

    {postModalAdd && 
      <ModalAddPost 
        category={category}
        menuList={menuList}
        setRefreshData={props.setRefreshData} 
        totalData={totalData} 
        isOpen={postModalAdd} 
        setClose={setPostModalAdd} /> } 
    {postModalEdit.isOpen && (
      <ModalEditPost 
        items={items}
        category={category}
        menuList={menuList}
        setRefreshData={props.setRefreshData} 
        totalData={totalData} 
        setCategory={props.setCategory}
        isEdit={postModalEdit.isEdit} 
        isOpen={postModalEdit.isOpen} 
        setClose={setPostModalEdit} 
      /> 
    )}
    </Fragment>
  )
}

export default PostTab;
