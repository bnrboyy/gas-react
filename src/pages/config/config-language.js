import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import axios from "axios";

import ButtonUI from "../../components/ui/button/button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { faAdd, faLanguag, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddConfigModal from "./modal/addConfig";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Switch } from "@mui/material";

const modalSwal = withReactContent(Swal)
const LanguageSection = (props) => { 
  const { data, bank } = props;
  const { t } = useTranslation("config-page"); 
  const language = useSelector(state=>state.app.language)
  const uploadPath = useSelector(state=>state.app.uploadPath)
  const multilingual = useSelector((state) => state.app.features.multilingual);
  const [openAddModal, setOpenAddModal] = useState(false);

  const modalFetchHandler = async (data) => {
    const formData = new FormData();
    if(data.upload.length > 0 ) {
      formData.append('image', data.upload[0])
    }
    formData.append('language', data.type.toLowerCase())
    formData.append('title', data.title)

    const created = await axios.post(`config/language/create`, formData).then(response => {
      return {status: true, description: response.data.description}
    }, error => {
      return {status: false, description: error.response.data.description}
    })

    if(created.status) {
      props.refresh()
      modalSwal.fire({
        position: 'center',
        icon: 'success',
        width: 450,
        title: "Successful",
        text: created.description,
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      modalSwal.fire({
        position: 'center',
        icon: 'error',
        width: 450,
        title: "Failure",
        text: created.description,
        showConfirmButton: false,
        timer: 1500
      })
    }
 
  }

  const languageDeleteHandler = async (token) => {
    /* Confirm to delete */
    const confirmed = await modalSwal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You want to delete a language!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      return result.isConfirmed
    })
    /* Fetching delete */
    if(confirmed) {
      const deleted = await axios.delete(`config/language/token/${token}`).then( response => {
        return {status: true, description: response.data.description}
      }, error => {
        return {status: false, description: error.response.data.description}
      })

      /* result display */
      if(deleted.status) {
        props.refresh()
        modalSwal.fire({
          position: 'center',
          icon: 'success',
          width: 450,
          title: "Successful",
          text: deleted.description,
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        modalSwal.fire({
          position: 'center',
          icon: 'error',
          width: 450,
          title: "Failure",
          text: deleted.description,
          showConfirmButton: false,
          timer: 1500
        })
      }
    }

  }

  return (
    <Fragment>
      <section className="language-control ">
        <div className="card-control">
          <div className="card-head">
            <div className="head-action">
              <h2 className="head-title">
              <FontAwesomeIcon icon={faMoneyBillTransfer} /> {"รายการบัญชีธนาคาร"}
              </h2>
              {multilingual && (
                <ButtonUI
                  onClick={(e) => setOpenAddModal(true)}
                  on="create"
                  isLoading={false}
                  icon={<FontAwesomeIcon icon={faAdd} />} >
                  {"เพิ่มธนาคาร"}
                </ButtonUI>
              )}

            </div>
          </div>

          <div className="card-body">
            <TableContainer component={Paper}>
              <Table size="small" aria-label="system config table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: "10px" }}>  # </TableCell>
                    <TableCell>{"รูปภาพ"}</TableCell>
                    <TableCell>{"ชื่อธนาคาร"}</TableCell>
                    <TableCell>{"ชื่อบัญชี"}</TableCell>
                    <TableCell>{"เลขบัญชี"}</TableCell>
                    <TableCell align="center">{"การแสดงผล"}</TableCell>
                    <TableCell align="center" sx={{ width: "100px" }}>{t("Action")} </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bank &&
                    bank.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }} >
                        <TableCell scope="row" align="center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="blog-language">
                            <img src={`${uploadPath}${row.bank_image}`}/>
                          </div>
                        </TableCell>
                        <TableCell>{row.bank_name}</TableCell>
                        <TableCell>{row.bank_account}</TableCell>
                        <TableCell>{row.bank_number}</TableCell>
                        <TableCell align="center">
                          <Switch aria-label="Size switch" size="small" checked={true}  /*onChange={(e)=> displayInfoHandler(e, row.token) } *//>
                        </TableCell>
                        <TableCell align="right">
                          <div className="blog-action">
                            <ButtonUI on="edit" width="xs" onClick={(e)=> languageDeleteHandler(row.token)}>{"แก้ไข"}</ButtonUI>
                            <ButtonUI on="delete" width="xs" onClick={(e)=> languageDeleteHandler(row.token)}>{"ลบ"}</ButtonUI>
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
        placeholder={{type: language, title: "Language Name", dimension: ""}}
        upload={true}
        dimension={false}
        isOpenModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
        onFetch={modalFetchHandler}
      />
    </Fragment>
  );
};

export default LanguageSection;
