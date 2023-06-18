import {
  faRedo,
  faSearch,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl, InputLabel, Input } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import ButtonUI from "../../components/ui/button/button";
import { svGetOrders, svGetOrderPending } from "../../services/orders.service";
import { appActions } from "../../store/app-slice";
import OrdersTab from "./orders-tab";
import "./orders.scss";
import { useSearchParams } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("orders-page");
  const language = useSelector((state) => state.app.language);
  const newOrders = useSelector((state) => state.app.newOrders);
  const [tabSelect, setTabSelect] = useState("0");
  const [refreshData, setRefreshData] = useState(0);
  const [ordersData, setOrdersData] = useState([]);
  const [ordersModal, setOrdersModal] = useState(false);
  const [textSearch, setTextSearch] = useState(
    searchParams.get("search") || ""
  );

  
  const onFetchOrderData = () => {
    svGetOrders(textSearch).then((res) => {
      if (res.status) {
        setOrdersData(res.data);
        localStorage.setItem("order_length", String(ordersData.length));
      } else {
        setOrdersData([]);
      }
      dispatch(appActions.isSpawnActive(false));
    });
    // svGetOrderPending().then((res) => {
    //   dispatch(appActions.setNewOrders(res.data.data));
    //   dispatch(appActions.setFollowNewOrders(res.data.data));
    // });
  };

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    onFetchOrderData();
  }, [refreshData, language, tabSelect, newOrders]);

  const OnChangeTextSearchHandler = (e) => {
    setTextSearch(e.target.value);
    setSearchParams(`search=${e.target.value}`);
    // navigate({pathname: '/orders',search: '?search=' + e.target.value })
    setRefreshData(refreshData + 1);
  };

  return (
    <section id="orders-page">
      <HeadPageComponent
        h1={"OrdersPage"}
        icon={<FontAwesomeIcon icon={faTruckFast} />}
        breadcrums={[{ title: "OrdersPage", link: false }]}
      />
      <div className="card-control fixed-width">
        <div className="card-head">
          <div className="head-action">
            <ButtonUI
              onClick={() => setRefreshData(refreshData + 1)}
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faRedo} />}
            >
              {t("Fetch")}
            </ButtonUI>
            <FormControl variant="standard">
              <InputLabel htmlFor={`text-search`}>{"เลขคำสั่งซื้อ"}</InputLabel>
              <Input
                size="small"
                id={`text-search`}
                value={textSearch}
                onChange={(e) => OnChangeTextSearchHandler(e)}
              />
            </FormControl>
          </div>
        </div>

        <OrdersTab
          ordersModal={ordersModal}
          setOrdersModal={setOrdersModal}
          ordersData={ordersData}
          setRefreshData={setRefreshData}
          refreshData={refreshData}
          tabSelect={tabSelect}
          setTabSelect={setTabSelect}
        />
      </div>
    </section>
  );
};

export default Orders;
