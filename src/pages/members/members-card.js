import { faEye, faRandom, faTrash, faUserPen } from "@fortawesome/free-solid-svg-icons";
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
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
// import { t } from "i18next";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ButtonUI from "../../components/ui/button/button";
import DateMoment from "../../components/ui/date-moment/date-moment";
import {
  svDeleteMember,
  svGetMembersById,
} from "../../services/members.service";
import SwalUI from "../../components/ui/swal-ui/swal-ui";
import MemberModal from "./modal/member-modal";

const modalSwal = withReactContent(Swal);

const MembersCard = ({ item, setMemberModal, setRefreshData, memberModal }) => {
  const [showData, setShowData] = useState({});
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const { t } = useTranslation("member-page");

  const editHandler = (_id) => {
    svGetMembersById(_id).then((res) => {
      const result = {
        id: res.data.id,
        firstname: res.data.title || "",
        lastname: res.data.details || "",
        member_name: res.data.member_name || "",
        member_status: res.data.member_status,
        profile_image: res.data.profile_image || "",
        created_at: res.data.created_at,
        password: res.data.member_note,
        phone_number: res.data.phone_number,
        email: res.data.email,
      };
      setShowData(result);
      setMemberModal(true);
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
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          svDeleteMember(_id).then((res) => {
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
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Password</TableCell>
            <TableCell align="center">Phone Number</TableCell>
            <TableCell align="center">Verify Time</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item?.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell align="left">
                <Card sx={{ maxWidth: 100, height: 100 }}>
                  <img
                    src={
                      row.profile_image
                        ? uploadPath + row.profile_image
                        : "/images/no-image.png"
                    }
                    alt="green iguana"
                    style={{ height: "100%", width: "100%", minWidth: "80px"}}
                    object-fit={"cover"}
                  />
                  {/* <ImagePreview src={row.profile_image} /> */}
                </Card>
              </TableCell>
              <TableCell align="center">{row.member_name}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row.member_note}</TableCell>
              <TableCell align="center">{row.phone_number}</TableCell>
              <TableCell align="center">
                <DateMoment format={"LLL"} date={row.member_verify_at} />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.member_status}
                  size="small"
                  color={
                    row.member_status.toLowerCase() === "confirm"
                      ? "success"
                      : row.member_status.toLowerCase() === "pending"
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
                  icon={<FontAwesomeIcon icon={faUserPen} />}
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
      {memberModal && (
        <MemberModal
          memberShow={showData}
          memberModal={memberModal}
          setMemberModal={setMemberModal}
          setRefreshData={setRefreshData}
        />
      )}
    </TableContainer>
  );
};

const ImagePreview = ({ src }) => {
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const [preview, setPreview] = useState(uploadPath + src);

  const onErrorHandler = () => {
    setPreview("/images/no-image.png");
  };
  return (
    <img
      src={preview}
      style={{ height: "100%", width: "100%" }}
      alt="green iguana"
      object-fit={"cover"}
      onError={onErrorHandler}
    />
  );
};

export default MembersCard;
