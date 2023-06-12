import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import HeadPageComponent from '../../components/layout/headpage/headpage';

import './post.scss';
import { faAdd, faImages, faRedo, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonUI from "../../components/ui/button/button";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import PostTab from "./post-tab/post-tab";
import { getMenuList, getPosts } from '../../services/post.service';
import { appActions } from '../../store/app-slice';

const PostPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["post-page"]);
  const pageAvailable = useSelector((state) => state.app.frontOffice.pageAvailable );
  const language = useSelector((state) => state.app.language );
  const [postTab, setPostTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay ] = useState(false) 
  const [postData, setPostData] = useState([]);
  const [pageControl, setPageControl] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [category, setCategory] = useState([]);
  const [refreshData, setRefreshData ] = useState(0) 
  const [postModalAdd, setPostModalAdd ] = useState(false) 


  useEffect(()=>{
    getMenuList(language).then(res => {
      if(res.status) {
        let arr = [];
        for(let obj of res.category) {
          arr[`${obj.id}`] = {
            id: obj.id,
            title: obj.cate_title,
            language: obj.language,
            level: obj.cate_level,
            rootId: obj.cate_root_id,
            parentId: obj.cate_parent_id,
            checked: false
          }
        }
        setCategory(arr)
        setMenuList(res.menu)
        console.log('then')
      }
    })
  }, [language])

  useEffect(()=>{
    setPostData([])
    dispatch(appActions.isSpawnActive(true))
    getPosts(language).then(res => {
      if(res.status) {
        setPostData(res.data)
      }
      dispatch(appActions.isSpawnActive(false))
    })

  }, [refreshData, language])
 
  const OnChangePageControlHandler = (e) => {
    setPageControl(e.target.value);
  }
 
  return (
    <section id="post-page">
      <HeadPageComponent 
          h1={t("postH1")}  
          icon={<FontAwesomeIcon icon={faNewspaper} />} 
          breadcrums={[
              {title: t("postH1"), link: false }
          ]} 
      />
      <div className="card-control fixed-width">
        <div className="card-head">
          <div className="head-action">
            <h2 className="head-title">
              <ButtonUI
                onClick={() => setRefreshData(refreshData + 1)}
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faRedo} />} >
                {t("Fetch")}
              </ButtonUI>
            </h2>
            <ContentFormatButton isRowDisplay={isRowDisplay} setIsRowDisplay={setIsRowDisplay} />
            <FormControl className="searchpage" variant="standard">
              <InputLabel id="filter-pgae">{t("selectPageControl")}</InputLabel>
              <Select labelId="post-pgae"
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
                    <MenuItem 
                      key={menu.id} 
                      value={menu.id}>
                      {menu.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl> 
            <ButtonUI
                onClick={() => setPostModalAdd(true)}
                className="btn-add-post"
                on="create"
                icon={<FontAwesomeIcon icon={faAdd} />} >
                {t("btnAddPost")}
              </ButtonUI>
          </div>
        </div>

        <PostTab 
          postModalAdd={postModalAdd}
          setPostModalAdd={setPostModalAdd}
          setRefreshData={()=> setRefreshData(refreshData + 1)}
          pageControl={pageControl}
          category={category}
          setCategory={setCategory}
          menuList={menuList}
          postTab={postTab} 
          setPostTab={setPostTab} 
          postData={postData} 
          isRowDisplay={isRowDisplay} 
        />



      </div>

    </section>
  )
}

export default PostPage

