import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { faAdd, faDatabase, faLanguage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ButtonUI from "../../components/ui/button/button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import AddConfigModal from "./modal/addConfig";

import axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const modalSwal = withReactContent(Swal)

const DataTypeSection = (props) => {
  const { data } = props;
  const { t } = useTranslation("config-page");
  const language = useSelector((state) => state.app.language);
  const [openAddModal, setOpenAddModal] = useState(false);

  const modalFetchHandler = async (data) => {
    let bodyData = {
      typeName: data.type,
      title: data.title,
      language: language,
    }

    const created = await axios.post(`config/data_type/create`, bodyData).then(response => {
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

  const dataTypeDeleteHandler = async (token) => {
    const deleted = await axios.delete(`config/data_type/token/${token}`).then(response => {
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
                <FontAwesomeIcon icon={faDatabase} /> {t("DataType")}
            </h2>
            <ButtonUI
              onClick={(e) => setOpenAddModal(true)}
              on="create"
              isLoading={false}
              icon={<FontAwesomeIcon icon={faAdd} />}  >
              {t("New")}
            </ButtonUI>
          </div>
        </div>

        <div className="card-body">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="data type table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: "10px" }}> # </TableCell>
                  <TableCell>{t("Type")}</TableCell>
                  <TableCell>{t("Title")}</TableCell>
                  <TableCell align="center" sx={{ width: "100px" }} >{t("Action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                      <TableCell scope="row" align="center">{index + 1}</TableCell>
                      <TableCell>{row.typeName}</TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell align="right">
                        <div className="blog-action" >
                        <ButtonUI on="delete" width="xs" onClick={() => dataTypeDeleteHandler(row.token) } >{t("Delete")}</ButtonUI>
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
        placeholder={{type: "name",title: "Title", dimension: ""}}
        dimension={false}
        isOpenModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        onFetch={modalFetchHandler}
      />


    </Fragment>
  );
};

export default DataTypeSection;
