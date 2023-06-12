import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../store/app-slice";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faImages,
  faRedo,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import ButtonUI from "../../components/ui/button/button";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import ProductsCateTab from "./products-cate-tab/products-cate-tab";
import { getProductCategory } from "../../services/product-category.service";
import "./product_cate.scss";

const ProductCate = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("product-cate-page");
  const language = useSelector((state) => state.app.language);
  const [tabSelect, setTabSelect] = useState("");
  const [isRowDisplay, setIsRowDisplay] = useState(true);
  const [productCateModalAdd, setProductCateModalAdd] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [productCate, setProductCate] = useState([]);

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    getProductCategory({ language: language }).then((res) => {
      const result = res.data.map((el) => {
        return {
          created_at: el.created_at,
          details: el.details,
          display: el.display,
          id: el.id,
          is_food: el.is_food,
          language: el.language,
          thumbnail_alt: el.thumbnail_alt,
          image: el.thumbnail_link,
          thumbnail_size: el.thumbnail_size,
          thumbnail_title: el.thumbnail_title,
          title: el.title,
          updated_at: el.updated_at,
        };
      });
      setProductCate(result);
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language, tabSelect]);
  
  return (
    <section id="products-cate-page">
      <HeadPageComponent
        h1={"ProductsCatePage"}
        icon={<FontAwesomeIcon icon={faTag} />}
        breadcrums={[{ title: "ProductsCatePage", link: false }]}
      />
      <div className="card-control fixed-width">
        <div className="card-head">
          <div className="head-action">
            <h2 className="head-title">
              <ButtonUI
                onClick={() => setRefreshData(refreshData + 1)}
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faRedo} />}
              >
                {t("Fetch")}
              </ButtonUI>
            </h2>
            <ContentFormatButton isRowDisplay={isRowDisplay} setIsRowDisplay={setIsRowDisplay} />
            <ButtonUI
              onClick={() => setProductCateModalAdd(true)}
              style={{ width: "150px" }}
              className="btn-add-slide"
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faAdd} />}
            >
              {t("btnAddProductCate")}
            </ButtonUI>
          </div>
        </div>

        <ProductsCateTab
          setRefreshData={setRefreshData}
          productCateModalAdd={productCateModalAdd}
          setProductCateModalAdd={setProductCateModalAdd}
          isRowDisplay={isRowDisplay}
          tabSelect={tabSelect}
          setTabSelect={setTabSelect}
          productCate={productCate}
        />
      </div>
    </section>
  );
};

export default ProductCate;
