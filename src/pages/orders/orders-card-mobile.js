import {
  faCartShopping,
  faClock,
  faLanguage,
  faMoneyBill,
  faCreditCard
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip } from "@mui/material";
import React from "react";
import { Fragment } from "react";
import ContentCardOrderUI from "../../components/ui/content-card-order/content-card-order";
import DateMoment from "../../components/ui/date-moment/date-moment";

const OrdersCardMobile = ({ items, editHandler, deleteHandler }) => {
  return (
    <div className="card-mobile" style={{gap: '1rem', display: 'flex', flexDirection: 'column'}}>
      {items.map((item, index) => (
        <ContentCardOrderUI
          onDeleteClick={(e) => deleteHandler(item.orders_number)}
          onEditClick={() => editHandler(item.orders_number, item.type_order)}
          className="slide-card-content"
          data={item}
          key={index}
        >
          <h3 className="title" style={{display: 'flex', justifyContent: 'space-between'}}>
            <span className="id" title="ref id">
              [ {item.orders_number} ]
            </span>
            <Chip
                  label={item.status}
                  size="small"
                  color={
                    item.status_id === 1
                      ? "secondary"
                      : item.status_id === 2
                      ? "warning"
                      : item.status_id === 3
                      ? "primary"
                      : item.status_id === 4
                      ? "success"
                      : "error"
                  }
                />
          </h3>
          <p className="desc">{item.member_name}</p>
          <p className="type-order">
            <span className="fa-icon" title="language">
              <FontAwesomeIcon icon={faCartShopping} />
            </span>
            <b> {item.type_order}</b>
          </p>
          <p className="editor">
            <span className="fa-icon" title="language">
              <FontAwesomeIcon icon={faCreditCard} />
            </span>
            <b>{item.payment_type === "transfer" ? " Transfer" : " COD"} : </b>
            <b style={{color: item.payment_verified ? "#2e7d32" : "#ed6c02"}}>{item.payment_verified ? "Verified" : "Pending"}</b>
          </p>
          <p className="price">
            <span className="fa-icon" title="price">
              <FontAwesomeIcon icon={faMoneyBill} />
              <b> {item.total_price} $</b>
            </span>
          </p>
          <p className="display">
            {item.transaction_date !== null && (
              <Fragment>
                <span className="fa-icon" title="hidden">
                  <FontAwesomeIcon icon={faClock} />{' '}
                </span>
                <span>
                  <DateMoment format={"LLL"} date={item.transaction_date} />
                </span>
              </Fragment>
            )}
          </p>
        </ContentCardOrderUI>
      ))}
    </div>
  );
};

export default OrdersCardMobile;
