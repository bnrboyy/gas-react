import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import ButtonUI from "../../../components/ui/button/button";
import { useSelector } from "react-redux";

import "./member-modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faPencil,
  faRedo,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import { svChangeStatusMember } from "../../../services/members.service";
import { relativeTimeRounding } from "moment";

const MemberModal = (props) => {
  const { t } = useTranslation("member-page");
  const { memberShow, memberModal, setMemberModal, setRefreshData } = props;
  const [memberStatus, setMemberStatus] = useState(memberShow.member_status);
  const [memberEditData, setMemberEditData] = useState(memberShow);
  const validPassword = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

  const statusList = [
    {
      status: "Pending",
      value: "pending",
    },
    {
      status: "Confirm",
      value: "confirm",
    },
    {
      status: "Banned",
      value: "banned",
    },
  ];

  const handlerSave = () => {
    const formSave = {
      status: memberStatus,
    };
    if (memberEditData.member_name === "") {
      SwalUI({
        status: false,
        description: "Please type member name",
        showConf: true,
        timer: 99999,
      });
      return false;
    }
    if (memberEditData.phone_number === "") {
      SwalUI({
        status: false,
        description: "Please type phone number",
        showConf: true,
        timer: 99999,
      });
      return false;
    }
    if (!validPassword.test(memberEditData.password)) {
      SwalUI({
        status: false,
        description:
          "The password must be at least 8 characters, at least one letter and one number",
        showConf: true,
        timer: 99999,
      });
      return false;
    }
    svChangeStatusMember(memberShow.id, memberEditData).then((res) => {
      setMemberModal(false);
      SwalUI({ status: res.status, description: res.description });
      if (res.status) {
        setRefreshData((prev) => prev + 1);
      }
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={memberModal}
        onClose={(e) => setMemberModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="member-modal">
          <section id="member-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faUserPen} /> {t("MemberEdit")}
                  </h2>
                </div>
              </div>
              <div className="card-body">
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ "& .MuiTextField-root": { m: 1 } }}
                >
                  <div className="member-details">
                    <div className="input-full">
                      <TextField
                        onChange={(e) =>
                          setMemberEditData((prev) => {
                            return {
                              ...prev,
                              member_name: e.target.value,
                            };
                          })
                        }
                        label="Member Name"
                        value={memberEditData.member_name}
                        size="small"
                        fullWidth={true}
                        error={false}
                      />
                    </div>
                    <div className="input-full">
                      <TextField
                        onChange={(e) =>
                          setMemberEditData((prev) => {
                            return {
                              ...prev,
                              email: e.target.value,
                            };
                          })
                        }
                        label="Email"
                        value={memberEditData.email}
                        size="small"
                        fullWidth={true}
                        error={false}
                      />
                    </div>
                    <div className="input-full">
                      <TextField
                        onChange={(e) => {
                          setMemberEditData((prev) => {
                            return { ...prev, phone_number: e.target.value };
                          });
                        }}
                        label="Phone Number"
                        value={memberEditData.phone_number}
                        size="small"
                        fullWidth={true}
                        error={false}
                        type="number"
                      />
                    </div>
                    <div className="input-full">
                      <TextField
                        onChange={(e) =>
                          setMemberEditData((prev) => {
                            return {
                              ...prev,
                              password: e.target.value,
                            };
                          })
                        }
                        label="Password"
                        value={memberEditData.password}
                        size="small"
                        fullWidth={true}
                        error={false}
                      />
                    </div>
                    <div className="input-full">
                      <FormControl
                        sx={{ m: 1, minWidth: 200 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="member-type">
                          {t("SelectMemberStatus")}
                        </InputLabel>
                        <Select
                          labelId="member-type"
                          id="member-type"
                          value={memberEditData.member_status}
                          label={t("SelectMemberStatus")}
                          onChange={(e) =>
                            setMemberEditData((prev) => {
                              return {
                                ...prev,
                                member_status: e.target.value,
                              };
                            })
                          }
                        >
                          <MenuItem value={""} disabled>
                            {t("Select")}
                          </MenuItem>
                          {statusList.map((p) => (
                            <MenuItem key={p.value} value={p.value}>
                              {p.status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </Box>

                <div className="btn-action">
                  <ButtonUI
                    onClick={() => handlerSave()}
                    loader={true}
                    className="btn-save"
                    on="save"
                    width="md"
                  >
                    {t("Save")}
                  </ButtonUI>
                  <ButtonUI
                    onClick={() => setMemberModal(false)}
                    icon={<FontAwesomeIcon icon={faRedo} />}
                    className="btn-cancel"
                    on="cancel"
                    width="md"
                  >
                    {t("Cancel")}
                  </ButtonUI>
                </div>
              </div>
            </div>
          </section>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default MemberModal;
