import React, { useEffect, useState } from "react";
import ButtonUI from "../../../components/ui/button/button";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTextHeight } from '@fortawesome/free-solid-svg-icons';

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LangConfigPagination from "./langPagination";
import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const modalSwal = withReactContent(Swal);


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#343a40",
    color: "#fff",
    fontFamily: "Kanit",
    fontWeight: 400,
    paddingLeft: 10,
    paddingRight: 10
  },
  "th" : { maxWidth: "200px"}, 
  [`&.${tableCellClasses.head} .default-lang`]: {
    color: '#9ca3af',
    fontSize: ".875rem", 
    paddingLeft: '.5rem',
    fontWeight: 300
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "Kanit",
    fontWeight: 300,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
  "td" : { 
    padding: 5,
  }, 
  "td p" : { 
    wordBreak: "break-all",
    overflow: "hidden"
  }, 
  ".action-btn button" : {
    margin: ".3rem",
  },
  ".fixedPage" : { 
    minWidth: 120
  },
  ".fixedCol" : { 
    minWidth: 180
  }
}));

const createColumns = (title, align = "left") => {
  return { name: title, align };
};


/**
 * @param langConfigList [{ no: NUMBER, token: STRING,  param: STRING,  th: STRING, en: STRING, pageTitle: STRING, pageId: NUMBER, updated_at: DATE }]
 * @returns 
 */
function LangConfigTable(props) {
  const {langConfigList, pagi} = props;

  const { t } = useTranslation(["sidebar", "langconfig"]);
  const defaultLanguage = useSelector((state) => state.app.defaultLanguage)
  const activateLanguage = useSelector((state) => state.auth.activateLanguage)
  const [tableColumns, setTableColumns] = useState([]);

  useEffect(() => {

    if(tableColumns.length === 0 && activateLanguage.length > 0) {
      const columnData = activateLanguage.map((lang) => createColumns(lang.toUpperCase(), 'center'))
      setTableColumns([
        createColumns(t("langconfig:No"), "center"),
        createColumns(t("langconfig:Parameter"), 'center'),
        ...columnData,
        createColumns(t("langconfig:PageControl"), "center"),
        createColumns(t("langconfig:Action"), "center"),
      ])
     
    }
  }, [langConfigList, pagi]);
 
  const OnClickEditHandler = (langData) => {
    // checkDate = true / false  // ถ้า true ให้เช็กก่อน
    // ถ้า langData.updated_at !=  dataBase.updated_at // ตอน save ไม่ตรงกับปัจจุบันให้แจ้งเตือนว่ามีการอัพเดทข้อมูลก่อนหน้า ให้ยืนยัน
    // response มีการเปลี่ยนข้อมูลเดียวกันจากที่อื่น ต้องการแก้ไขทับข้อมูลเดิมหรือไม่?
    props.editData(langData)
  }

  const OnClickDeleteHandler = async (langData) => {
    const result = await axios.delete(`language/delete/${langData.param}`).then(response => {
      return {status: true, description: response.data.description}
    }, error => {
      return {status: false, description: error.response.data.description}
    })

    if(result.status) {
      props.setRefreshData(true);
      modalSwal.fire({
        position: "center",
        width: 450,
        icon: "success",
        title: "Successful",
        text: result.description,
        showConfirmButton: false,
        timer: 1500,
      })
        
    } else {
      modalSwal.fire({
        position: "center",
        width: 450,
        icon: "error",
        title: "Failed",
        text: result.description,
        showConfirmButton: false,
        timer: 1500,
      })
    }

  }

  return (
    <TableContainer id="lang-table" component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {tableColumns &&
              tableColumns.map((col) => (
                <StyledTableCell key={col.name} align={col.align} >
                  {col.name} {(col.name === defaultLanguage.toUpperCase()) && <span className="default-lang">( {t("default")} )</span>}
                </StyledTableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          { langConfigList.map((lang,index ) => (
            <StyledTableRow key={index + 1}>
              <StyledTableCell scope="row" align="center">{index + 1}</StyledTableCell>
              <StyledTableCell align="left"><p>{lang.param}</p></StyledTableCell>
              {activateLanguage.map((langCol) => (
                <StyledTableCell key={langCol} align="left">
                  { 
                    (langCol === defaultLanguage) 
                      ? <p className={'text-title-show'} title={lang[langCol]}>{lang[langCol]}</p>
                      : (langCol !== defaultLanguage && (lang[langCol] && lang[langCol] != "")) 
                          ?<p className={'text-title'} title={lang[langCol]}><FontAwesomeIcon icon={faTextHeight} /></p> 
                          :<p style={{textAlign:"center"}}>-</p> 
                  }
                </StyledTableCell>
              ))}
              <StyledTableCell className="page-control fixedPage " align="center">{lang.pageTitle}</StyledTableCell>
              <StyledTableCell align="center" className="action-btn fixedCol"> 
                  <ButtonUI
                    key={`edit-${index + 1}`}
                    onClick={(e) => OnClickEditHandler(lang)}
                    on="edit"
                    width="xs" >
                    {t("Edit")}
                  </ButtonUI>
                  <ButtonUI
                 
                    key={`delete-${index + 1}`}
                    onClick={(e) => OnClickDeleteHandler(lang)}
                    on="delete"
                    width="xs" >
                    {t("Delete")}
                  </ButtonUI>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        <TableFooter>
          <LangConfigPagination 
            filterData={props.filterData} 
            pageIndex={pagi.pageIndex} 
            pageLength={pagi.pageLimit}  
            total={pagi.total} />
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default LangConfigTable;
