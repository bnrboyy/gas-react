import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import { useDispatch, useSelector } from "react-redux";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import CategoryTab from "./category-tab/category-tab";
import ModalAddCategory from "./category-modal/cate-add-modal";
import ButtonUI from "../../components/ui/button/button";
import {appActions} from '../../store/app-slice';
import { getCategory } from "../../services/category.service";
import ModalEditCategory from "./category-modal/cate-edit-modal";

import "./category.scss"; 
import {
  faAdd,
  faSitemap,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 

const CategoryPage = () => {
  const { t } = useTranslation(["category-page"]);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.app.language);
  const [categoryTab, setCategoryTab] = useState("0");
  const [isRowDisplay, setIsRowDisplay] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [totalData, setTotalData] = useState(0)
  const [modalAddCate, setModalAddCate] = useState(false);
  const [modalEditCate, setModalEditCate] = useState(false);
  const [refreshData, setRefreshData] = useState(0);

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true))
    getCategory(language).then(res => {
      setCategoryData(res.data)
      setMenuList(res.menu)
      dispatch(appActions.isSpawnActive(false))
    })

  }, [refreshData, language])


  return (
    <section id="category-page">
      <HeadPageComponent
        h1={"categoryPage"}
        icon={<FontAwesomeIcon icon={faSitemap} />}
        breadcrums={[{ title: "categoryPage", link: false }]}
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
           
            <ButtonUI
              onClick={() => setModalAddCate(true)}
              className="btn-add-category"
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faAdd} />} >
              {t("Add Category")}
            </ButtonUI>
          </div>
        </div>
         
        <CategoryTab
          totalData={totalData}
          setTotalData={setTotalData}
          setRefreshData={setRefreshData}
          isRowDisplay={isRowDisplay}
          setModalEditCate={setModalEditCate}
          tabSelect={categoryTab}
          setCategoryTab={setCategoryTab}
          categoryData={categoryData}
        />

        <ModalAddCategory 
          totalData={totalData}
          setRefreshData={setRefreshData}
          menuList={menuList} 
          isOpen={modalAddCate} 
          setClose={setModalAddCate} 
          categoryData={categoryData}
          />

        <ModalEditCategory 
          categoryData={categoryData}
          setRefreshData={setRefreshData}
          menuList={menuList} 
          isOpen={modalEditCate} 
          setClose={setModalEditCate} />

      </div>
    </section>
  )
}

export default CategoryPage;
