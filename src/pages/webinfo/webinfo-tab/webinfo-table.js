import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import { webinfoDelete, webinfoDisplayToggle } from "../../../services/webinfo.service";
import ButtonUI from "../../../components/ui/button/button";
import { useSelector } from "react-redux";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Modal, Switch } from "@mui/material";
import { Box } from "@mui/system";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
const modalSwal = withReactContent(Swal)


const ModalPreview = (props) => {
  return (
    <Modal className={"modal-preview"} open={props.openModalShow}
      onClose={(e) => props.setOpenModalShow(false)}
      aria-labelledby="modal-preview"
      aria-describedby="modal-modal-description"  >
      <Box>
        <div className="modal-preview-body">
          <h2>Preview</h2>
          <div dangerouslySetInnerHTML={{ __html: props.showData}} />
          <ButtonUI className="btn-close" on="cancel"  onClick={(e) => props.setOpenModalShow(false)} >Close</ButtonUI>
        </div>
      </Box>
    </Modal>
  )
}

const WebInfoTable = (props) => {
  const { t } = useTranslation("webinfo-page");
  const language = useSelector(state => state.app.language) 
  const [openModalShow,setOpenModalShow] = useState(false) 
  const [showData,setShowData] = useState(null)
  const [isSettingDisplay, setIsSettingDisplay] = useState(false)
 
  useEffect(()=> {
 
  },[props.webInfoData])

  const displayInfoHandler = async (e, token) => {
    setIsSettingDisplay(true)
    
    if(!isSettingDisplay) {
      const data = {
        language: language,
        token: token
      }
      webinfoDisplayToggle(data).then(res => {
        props.refresh()
        setIsSettingDisplay(false)
      })
    }
  }
  
  const modalClickHandler = (row, isEdit) => {
    props.setIsEditMode(isEdit)
    props.setModalData(row)
    props.setEditModal(true)
  }

  const previewHandler = (row) => {
    setOpenModalShow(true);
    setShowData(row)
  }

  const deleteWebInfoHandler = (token) => {
    modalSwal.fire({
      position: 'center',
      icon: "warning",
      title: "Delete",
      text: "You want to delete data?",
      showConfirmButton: true,
      confirmButtonText: "Yes, delete it!",
      showCancelButton: true
    }).then( res => {
        if(res.isConfirmed) {
          webinfoDelete(language, token).then(res => {
            props.refresh()
            SwalUI({status: res.status, description: res.description})
          })
        }
    })

  }

  return (
    <TableContainer className="table-container" component={Paper}>
      <Table size="small" aria-label="webinfo table">
        <TableHead>
          <TableRow>
            <TableCell className="table-th" align="center" sx={{ width: "50px" }}>#</TableCell>
            <TableCell className="table-th head-title">{t("Title")}</TableCell> 
            <TableCell className="table-th head-value">{t("Value")}</TableCell>
            <TableCell className="table-th" align="center"sx={{ width: "100px" }}>{t("Source")}</TableCell>
            <TableCell className="table-th" align="center" sx={{ width: "100px" }}>{t("Display")}</TableCell>
            <TableCell className="table-th" align="center" sx={{ width: "100px" }}>{t("Action")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.webInfoData && props.webInfoData.map((row, index) => (
            <TableRow className="webinfo-table" sx={{ "&:last-child td, &:last-child th": { border: 0 },"td": {fontWeight: 300} }}  key={row.id} >
              <TableCell scope="row" align="center">{index + 1}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell align="center">
                {row.link !== "" && <a className="btn-link" target="_blank" href={row.link}>{t("LinkBtn")}</a>}
                {row.iframe !== "" && (
                  <Button className="btn-link" variant="text" onClick={(e) => previewHandler(row.iframe)}>{t("PreviewBtn")}</Button>
                )}
                </TableCell>
              <TableCell align="center">
                <Switch aria-label="Size switch" size="small" checked={row.display}  onChange={(e)=> displayInfoHandler(e, row.token) } />
              </TableCell>
              <TableCell align="right">
                <div className="blog-action">
                  {row.language.toLowerCase() !== language && <ButtonUI on="add" width="xs" onClick={(e)=>modalClickHandler(row, false)}> {t("Add")} </ButtonUI>}
                  {row.language.toLowerCase() === language && <ButtonUI on="edit" width="xs" onClick={(e)=>modalClickHandler(row, true)}> {t("Edit")}</ButtonUI>}
                  {(row.language.toLowerCase() === language && row.infoTypeId !== 1 ) && <ButtonUI on="delete" width="xs" onClick={(e)=>deleteWebInfoHandler(row.token)}> {t("Delete")} </ButtonUI>}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ModalPreview openModalShow={openModalShow} setOpenModalShow={setOpenModalShow} showData={showData} />
    </TableContainer>
  );
}

export default WebInfoTable;
