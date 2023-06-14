import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ButtonUI from "../../../components/ui/button/button";
import ModalEditAdmin from "../admin-modal/modal-admin";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import { deleteAdminService } from "../../../services/admin.service";

import {
  faFeatherAlt,
  faPencil,
  faPenClip,
  faPenNib,
  faMotorcycle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const modalSwal = withReactContent(Swal);

const CardAdmin = (props) => {
  const { t } = useTranslation(["admin-page"]);
  const { data } = props;
  const profileId = useSelector((state) => state.auth.adminId);

  const [isOpenModal, setIsOpenModal] = useState();
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
     if(!isOpenModal) {
      setModalData(null)
     }
  }, [isOpenModal])
  
  if (data.length === 0) {
    return <div className="not-found">ไม่มีข้อมูล ...</div>;
  }

  const editAdminHandler = (data) => {
    setModalData(data);
    setIsOpenModal(true);
  }
  
  const deleteHandler = async (data) => {
    /* confirm */
    await modalSwal.fire({
      icon: 'warning',
      title: 'ลบบัญชี!',
      text: "คุณต้องการลบบัญชีนี้หรือไม่?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if(result.isConfirmed) {
        deleteAdminService(data.token).then( res => {
          if(res.status) {
            props.refreshData()
          }
          SwalUI({status: res.status, description: res.description})
        })
      }
      return 
    })
  }

  return (
    <Fragment>
      <div className="card-admin-body">
        {data.map((admin, index) => (
          <div className={`card-tab statusId-${admin.status}`} key={index}>
            <div className="cart-tab-actions">
              <div className="action-buttons">
                <ButtonUI
                  width="free"
                  on="edit"
                  onClick={(e) => editAdminHandler(admin)} >
                  {t("Edit")} 
                </ButtonUI>
                {admin.id !== profileId && (
                  <ButtonUI 
                    onClick={(e) => deleteHandler(admin)}
                    width="free" 
                    on="delete">
                    {t("Delete")}
                  </ButtonUI>
                )}
              </div>
            </div>
            <div className="circle-ping">
              <span className="circle-body" />
              {admin.id === profileId && <span className="circle-animate" />}
            </div>
            {!admin.registered && <div className="new-user">NEW</div>}
            <figure className="card-image">
              <img
                src={"/images/icons/user.png"}
                onError={(e) => e.target.setAttribute("src", "/images/icons/user.png") }
              />
            </figure>
            <div className="card-detail">
              <p className="name">
                {admin.roleId === 1 && (
                  <FontAwesomeIcon
                    className="admin-verify"
                    icon={faFeatherAlt}
                  />
                )}
                {admin.roleId === 2 && (
                  <FontAwesomeIcon icon={faMotorcycle} />
                )}
                {/* {admin.roleId === 3 && (
                  <FontAwesomeIcon className="admin-verify" icon={faPenClip} />
                )}
                {admin.roleId === 4 && (
                  <FontAwesomeIcon className="admin-verify" icon={faPencil} />
                )} */}
                {admin.displayName}
              </p>
              <p className="email">{admin.email}</p>
              <p className="role">( {admin.roleName} )</p>
            </div>
          </div>
        ))}
      </div>
      {isOpenModal && (
        <ModalEditAdmin
          refreshData={props.refreshData}
          setIsOpenModal={setIsOpenModal}
          modalData={modalData}
        />
      )}
    </Fragment>
  );
};

export default CardAdmin;
