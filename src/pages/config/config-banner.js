import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AddConfigModal from "./modal/addConfig";
import { configBannerCreate } from "../../services/config.service";
import EditConfigModal from "./modal/editConfig"; 
import ButtonUI from "../../components/ui/button/button";
import SwalUI from "../../components/ui/swal-ui/swal-ui";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { faAdd, faRectangleAd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const modalSwal = withReactContent(Swal);

const BannerSection = (props) => {
  const { data } = props;
  const { t } = useTranslation("config-page");
  const authToken = useSelector((state) => state.auth.authToken);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const modalFetchHandler = async (data) => {
    let _data = {
      position: data.title, 
      typeName: data.type,
      dimension: data.dimension,
    }

    configBannerCreate(_data).then( res => {
      props.refresh()
      SwalUI({status: res.status, description: res.description})
    })
   
  }

  const modalUpdateHandler = async (data) => {
    let bodyData = {
      token: modalData.token,
      position: data.title, 
      typeName: data.type,
      dimension: data.dimension,
    }

    const created = await axios.patch(`config/ad_type/edit`, bodyData).then(response => {
      return {status: true, description: response.data.description}
    }, error => {
      return {status: false, description: error.response.data.description}
    })

    if(created.status) {
      props.refresh()
      modalSwal.fire({
        position: 'center',
        icon: "success",
        title: t("success"),
        text: t(created.description),
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      modalSwal.fire({
        position: 'center',
        icon: "error",
        title: t("failure"),
        text: t(created.description),
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  const editModal = (row) => {
    setModalData(row)
    setOpenEditModal(true)
  }
 
  const deleteHanlder = async (token) => {
    const deleted = await axios.delete(`config/ad_type/token/${token}`,  {
      headers: { Authorization : `Bearer ${authToken}` }
    }).then(response => {
      return {status: true, description: response.data.description}
    }, error => {
      return {status: false, description: error.response.data.description}
    })

    if(deleted.status) {
      props.refresh()
      modalSwal.fire({
        position: 'center',
        icon: "success",
        title: t("success"),
        text: t(deleted.description),
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      modalSwal.fire({
        position: 'center',
        icon: "error",
        title: t("failure"),
        text: t(deleted.description),
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  return (
    <Fragment>
      <section className="language-control ">
        <div className="card-control">
          <div className="card-head">
            <div className="head-action">
              <h2 className="head-title">
                <FontAwesomeIcon icon={faRectangleAd} /> {t("AdsType")}
              </h2>
              <ButtonUI
                onClick={(e) => setOpenAddModal(true)}
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faAdd} />} >
                {t("New")}
              </ButtonUI>
            </div>
          </div>

          <div className="card-body">
            <TableContainer component={Paper}>
              <Table size="small" aria-label="banner table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: "10px" }}>
                      #
                    </TableCell>
                    <TableCell>{t("Type")}</TableCell>
                    <TableCell>{t("Title")}</TableCell>
                    <TableCell align="center" sx={{ width: "160px" }}>{t("Action")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{  "&:last-child td, &:last-child th": { border: 0 } }} >
                        <TableCell scope="row" align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.title} ({row.dimension})</TableCell>
                        <TableCell align="right">
                          <div className="blog-action">
                            <ButtonUI on="edit" width="xs" onClick={() => editModal(row) }>{t("Edit")}</ButtonUI>
                            <ButtonUI on="delete" width="xs" onClick={() => deleteHanlder(row.token)} >{t("Delete")}</ButtonUI>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </section>

      <AddConfigModal
        placeholder={{type: "position",title: "name", dimension: "100*100"}}
        dimension={true}
        isOpenModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        onFetch={modalFetchHandler}
      />

      <EditConfigModal
        isOpenModal={openEditModal}
        setModal={setOpenEditModal}
        modalData={modalData}
        setModalData={setModalData}
        onFetch={modalUpdateHandler}
      />
    </Fragment>
  );
};

export default BannerSection;
