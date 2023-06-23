import { faAdd, faImages, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import ButtonUI from "../../components/ui/button/button";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import { getProduct } from "../../services/product.service";
import { appActions } from "../../store/app-slice";
import ProductsTab from "./products-tab/products-tab";
import "./products.scss";

const Products = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("product-page");
  const language = useSelector((state) => state.app.language);
  const [tabSelect, setTabSelect] = useState("");
  const [slideData, setSlideData] = useState([]);
  const [isRowDisplay, setIsRowDisplay] = useState(true);
  const [productModalAdd, setProductModalAdd] = useState(false);
  const [refreshData, setRefreshData] = useState(0);

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    const type_select = tabSelect !== "hidden" ? tabSelect : "";
    getProduct({ cateId: type_select, language: 'th' }).then((res) => {
      if (res.status) {
        const newData = res.data?.map((d) => {
          return {
            imageName: "",
            id: d.id,
            image: d.thumbnail_link,
            imageTitle: d.thumbnail_title,
            imageAlt: d.thumbnail_alt,
            cate_id: d.cate_id,
            title: d.title,
            description: d.description,
            display: d.display === 1 ? true : false,
            language: d.language,
            updatedDate: d.updated_at,
            createdDate: d.created_at,
          };
        });
        setSlideData(newData);
      } else {
        setSlideData([]);
      }
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language, tabSelect]);

  return (
    <section id="products-page">
      <HeadPageComponent
        h1={"ProductsPage"}
        icon={<FontAwesomeIcon icon={faImages} />}
        breadcrums={[{ title: "ProductsPage", link: false }]}
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
            <ContentFormatButton
              isRowDisplay={isRowDisplay}
              setIsRowDisplay={setIsRowDisplay}
            />
            <ButtonUI
              onClick={() => setProductModalAdd(true)}
              style={{ width: "150px" }}
              className="btn-add-slide"
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faAdd} />}
            >
              {t("btnAddProduct")}
            </ButtonUI>
          </div>
        </div>

        <ProductsTab
          setRefreshData={setRefreshData}
          productModalAdd={productModalAdd}
          setProductModalAdd={setProductModalAdd}
          isRowDisplay={isRowDisplay}
          tabSelect={tabSelect}
          setTabSelect={setTabSelect}
          slideData={slideData}
        />
      </div>
    </section>
  );
};

export default Products;
