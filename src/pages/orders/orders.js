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
        const order_data = res.data?.map((d) => {
          return {
            orders_number: d.orders_number,
            delivery_drop_address: d.delivery_drop_address,
            delivery_drop_address_more: d.delivery_drop_address_more,
            delivery_pickup_address: d.delivery_pickup_address,
            delivery_pickup_address_more: d.delivery_pickup_address_more,
            details: d.details,
            phone_number: d.phone_number,
            status: d.status_name.toLowerCase(),
            transaction_date: d.transaction_date,
            shipping_date: d.shipping_date,
            type_order: d.type_order,
            date_pickup: d.date_pickup,
            date_drop: d.date_drop,
            pickup_image: d.pickup_image,
            drop_image: d.drop_image,
            member_name: d.member_name,
            branch_name: d.branch_name,
            branch_id: d.branch_id,
            delivery_pickup: d.delivery_pickup,
            delivery_drop: d.delivery_drop,
            status_id: d.status_id,
            id: d.id,
            total_price: d.total_price,
            payment_type: d.type_payment,
            payment_verified: d.payment_verified,
            
          };
        });
        setOrdersData(order_data);
        localStorage.setItem("order_length", String(ordersData.length));
      } else {
        setOrdersData([]);
      }
      dispatch(appActions.isSpawnActive(false));
    });
    svGetOrderPending().then((res) => {
      dispatch(appActions.setNewOrders(res.data.data));
      dispatch(appActions.setFollowNewOrders(res.data.data));
    });
  };

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    onFetchOrderData();
  }, [refreshData, language, tabSelect]);

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
              <InputLabel htmlFor={`text-search`}>{t("Order Number")}</InputLabel>
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
