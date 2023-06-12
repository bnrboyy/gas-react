import React from "react";
import { useTranslation } from "react-i18next";

import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Switch } from "@mui/material";
import { useSelector } from "react-redux";
 
const featureData = (arr) => {
  let data = new Array();
  for (var key in arr) {
    if (arr.hasOwnProperty(key)) {
      data.push({title: key, active: arr[key]})
    }
  }
  return data
}

const SystemSection = (props) => {
  const { t } = useTranslation("config-page");
  const features = useSelector(state => state.app.features)
  const data = featureData(features);

  return (
    <section className="seo-control small-blog">
      <div className="card-control">
        <div className="card-head">
          <div className="head-action">
            <h2 className="head-title"><FontAwesomeIcon icon={faWrench} /> {t("ตั้งค่าการทำงาน")}</h2>
          </div>
        </div>
        <div className="card-body">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="system config table" >
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{width: "10px"}} >#</TableCell>
                  <TableCell >{t("Title")}</TableCell>
                  <TableCell align="right">{t("Enable")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data && data.map((row, index) => (
                  <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                    <TableCell scope="row" align="center" >{index + 1}</TableCell>
                    <TableCell >{t(row.title)}</TableCell>
                    <TableCell align="right">
                        <Switch defaultChecked={(row.active)} disabled={true} aria-label={row.title} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </section>
  );
};

export default SystemSection;
