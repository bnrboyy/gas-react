import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import ButtonUI from "../../../components/ui/button/button";

import "./employee-modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faRedo } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import { svEditEmployee } from "../../../services/employee.service";
import { useSelector } from "react-redux";

const EmployeeModal = (props) => {
  const { uploadPath } = useSelector((state) => state.app);
  const { t } = useTranslation("member-cate-page");
  const {
    editData,
    setEditData,
    employeeModal,
    setEmployeeModal,
    setRefreshData
  } = props;
  const [previews, setPreviews] = useState({ src: uploadPath + editData.profile_image, file: null, name: null });
  const [isError, setIsError] = useState({
    thumbnail: false,
    title: false
  });

  const status = [
    {
      id: 1,
      name: "active"
    },
    {
      id: 2,
      name: "pending"
    },
    {
      id: 3,
      name: "banned"
    },
    {
      id: 4,
      name: "inactive"
    }
  ];

  const setPreviewHandler = (data) => {
    setIsError({ ...isError, thumbnail: false });
    setPreviews(data);
  };

  const createValidators = () => {
    let isValid = true;
    if (previews.file === undefined || previews.file === null) {
      setIsError({ ...isError, thumbnail: true });
      isValid = false;
    }
    if (isValid) {
      createSlideHandler();
    }
  };

  const createSlideHandler = () => {
    const formData = new FormData();
    if (previews.file) {
      formData.append("imageFile", previews.file);
    }
    formData.append("address", editData.address);
    formData.append("birthday", editData.birthday);
    formData.append("created_at", editData.created_at);
    formData.append("district", editData.district);
    formData.append("firstname", editData.firstname);
    formData.append("gender", editData.gender);
    formData.append("lastname", editData.lastname);
    formData.append("moo", editData.moo);
    formData.append("phone_number", editData.phone_number);
    formData.append("province", editData.province);
    formData.append("status", editData.status);
    formData.append("subdistrict", editData.subdistrict);
    formData.append("zipcode", editData.zipcode);

    svEditEmployee(editData.id, formData).then((res) => {
      setEmployeeModal(false);
      SwalUI({ status: res.status, description: res.description });
      if (res.status) {
        setRefreshData((prev) => prev + 1);
      }
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={employeeModal}
        onClose={(e) => setEmployeeModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="employee-modal">
          <section id="employee-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faPencil} />{" "}
                    {t("employeeStatusChange")}
                  </h2>
                </div>
              </div>
              <div className="card-body">
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
                >
                  <FieldsetUI
                    className={`image-setting ${
                      isError.thumbnail ? "error" : ""
                    }`}
                    label={t("ModalInfoImage")}
                  >
                    <PreviewImageUI
                      className="edit-image"
                      previews={previews}
                      setPreviews={setPreviewHandler}
                    />
                  </FieldsetUI>

                  <div className="employee-details">
                    <h3 className="employee-detail-title">
                      {t("ModalDetail")}
                    </h3>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return { ...prevState, firstname: e.target.value };
                          })
                        }
                        value={editData.firstname}
                        className="text-field-custom"
                        fullWidth={true}
                        error={isError.firstname}
                        id="ad-firstname"
                        label="firstname"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              lastname: e.target.value
                            };
                          })
                        }
                        value={editData.lastname}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-lastname"
                        label="lastname"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              phone_number: e.target.value
                            };
                          })
                        }
                        value={editData.phone_number}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-phone-number"
                        label="phone number"
                        size="small"
                      />
                    </div>
                    <div className="input-half-flex">
                      <div className="input-half">
                        <TextField
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return {
                                ...prevState,
                                address: e.target.value
                              };
                            })
                          }
                          value={editData.address}
                          className="text-field-custom"
                          fullWidth={true}
                          error={false}
                          id="ad-address"
                          label="address"
                          size="small"
                        />
                      </div>
                      <div className="input-half">
                        <TextField
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return {
                                ...prevState,
                                moo: e.target.value
                              };
                            })
                          }
                          value={editData.moo}
                          className="text-field-custom"
                          fullWidth={true}
                          error={false}
                          id="ad-moo"
                          label="moo"
                          size="small"
                        />
                      </div>
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              subdistrict: e.target.value
                            };
                          })
                        }
                        value={editData.subdistrict}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-subdistrict"
                        label="subdistrict"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              district: e.target.value
                            };
                          })
                        }
                        value={editData.district}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-district"
                        label="district"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              province: e.target.value
                            };
                          })
                        }
                        value={editData.province}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-province"
                        label="province"
                        size="small"
                      />
                    </div>
                    <div className="input-xl-half">
                      <TextField
                        onChange={(e) =>
                          setEditData((prevState) => {
                            return {
                              ...prevState,
                              zipcode: e.target.value
                            };
                          })
                        }
                        value={editData.zipcode}
                        className="text-field-custom"
                        fullWidth={true}
                        error={false}
                        id="ad-zipcode"
                        label="zipcode"
                        size="small"
                      />
                    </div>
                    <div className="input-half">
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="label-add-employee-gender">
                          {t("SelectGender")}
                        </InputLabel>
                        <Select
                          labelId="add-employee-gender"
                          id="add-employee-gender"
                          value={editData.gender}
                          label={t("SelectGender")}
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return { ...prevState, gender: e.target.value };
                            })
                          }
                        >
                          <MenuItem value={""} disabled>
                            {t("None")}
                          </MenuItem>
                          <MenuItem value={"men"}>{t("Men")}</MenuItem>
                          <MenuItem value={"women"}>{t("Women")}</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-half">
                      <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        size="small"
                        className="form-control"
                      >
                        <InputLabel id="label-add-employee-type">
                          {t("status")}
                        </InputLabel>
                        <Select
                          labelId="add-employee-type"
                          id="add-employee-type"
                          value={editData.status}
                          label={t("status")}
                          onChange={(e) =>
                            setEditData((prevState) => {
                              return { ...prevState, status: e.target.value };
                            })
                          }
                        >
                          <MenuItem value={0} disabled>
                            {t("None")}
                          </MenuItem>
                          {status.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </Box>

                <div className="btn-action">
                  <ButtonUI
                    onClick={() => createValidators()}
                    loader={true}
                    className="btn-save"
                    on="save"
                    width="md"
                  />
                  <ButtonUI
                    onClick={() => setEmployeeModal(false)}
                    icon={<FontAwesomeIcon icon={faRedo} />}
                    className="btn-cancel"
                    on="cancel"
                    width="md"
                  />
                </div>
              </div>
            </div>
          </section>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default EmployeeModal;
