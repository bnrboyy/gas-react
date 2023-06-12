import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ButtonUI from "../../components/ui/button/button";
import DateMoment from "../../components/ui/date-moment/date-moment";
import {
  svDeleteEmployee,
  svGetEmployeeById
} from "../../services/employee.service";
import SwalUI from "../../components/ui/swal-ui/swal-ui";
import EmployeeModal from "./modal/employee-modal";
import { useSelector } from "react-redux";

const modalSwal = withReactContent(Swal);

const EmployeeCard = ({
  item,
  setEmployeeModal,
  employeeModal,
  setRefreshData
}) => {
  const [editData, setEditData] = useState({});
  const { uploadPath } = useSelector((state) => state.app);
  
  const editHandler = (_id) => {
    svGetEmployeeById(_id).then((res) => {
      if(res.status){
        const result = {
          id: res.data.id,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          gender: res.data.gender,
          phone_number: res.data.phone_number,
          status: res.data.status,
          status_name: res.data.status_name,
          profile_image: res.data.profile_image || "",
          address: res.data.address,
          moo: res.data.moo,
          subdistrict: res.data.subdistrict,
          district: res.data.district,
          province: res.data.province,
          zipcode: res.data.zipcode,
          created_at: res.data.created_at,
          birthday: res.data.birthday
        };
        setEditData(result);
        setEmployeeModal(true);
        setRefreshData((prev) => prev + 1);
      }
    });
  };

  const deleteHandler = (_id) => {
    modalSwal
      .fire({
        icon: "warning",
        title: "Are you sure?",
        text: "I want to delete this data!",
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#e11d48",
        showCancelButton: true,
        cancelButtonText: "Cancel"
      })
      .then((result) => {
        if (result.isConfirmed) {
          svDeleteEmployee(_id).then((res) => {
            SwalUI({ status: res.status, description: res.description });
            if (res.status) {
              setRefreshData((prev) => prev + 1);
            }
          });
        }
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="left">Profile Image</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Register Date</TableCell>
            <TableCell align="center">Gender</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="left">
                <Card sx={{ maxWidth: 100, height: 100 }}>
                  <ImagePreview src={uploadPath + row.profile_image} />
                </Card>
              </TableCell>
              <TableCell align="left">
                {row.firstname + " " + row.lastname}
              </TableCell>
              <TableCell align="left">
                <DateMoment format={"LLL"} date={row.created_at} />
              </TableCell>
              <TableCell align="center">{row.gender}</TableCell>
              <TableCell align="center">
                <Chip
                  label={row.status_name}
                  size="small"
                  color={
                    row.status_name === "active"
                      ? "success"
                      : row.status_name === "pending"
                      ? "warning"
                      : "error"
                  }
                />
              </TableCell>
              <TableCell align="center" className="column-action">
                <ButtonUI
                  onClick={(e) => editHandler(row.id)}
                  on="show"
                  className="btn-custom onShow"
                  width="md"
                  icon={<FontAwesomeIcon icon={faPencil} />}
                >
                  {t("Edit")}
                </ButtonUI>
                <ButtonUI
                  onClick={(e) => deleteHandler(row.id)}
                  on="delete"
                  className="btn-custom onDelete"
                  icon={<FontAwesomeIcon icon={faTrash} />}
                >
                  {t("Delete")}
                </ButtonUI>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {employeeModal && (
        <EmployeeModal
          editData={editData}
          setEditData={setEditData}
          employeeModal={employeeModal}
          setEmployeeModal={setEmployeeModal}
          setRefreshData={setRefreshData}
        />
      )}
    </TableContainer>
  );
};

const ImagePreview = ({src}) => {
  const [preview, setPreview] = useState(src);

  const onErrorHandler = () => {
    setPreview("/images/no-image.png");
  };

  return (
    <img
      src={preview}
      style={{ height: "100%" }}
      alt="green iguana"
      object-fit={"cover"}
      onError={onErrorHandler}
    />
  );
};

export default EmployeeCard;
