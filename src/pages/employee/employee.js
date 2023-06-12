import { faRedo, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import HeadPageComponent from "../../components/layout/headpage/headpage";
import ButtonUI from "../../components/ui/button/button";
import ContentFormatButton from "../../components/ui/toggle-format/toggle-format";
import "./employee.scss";
import EmployeeTab from "./employee-tab";
import { appActions } from "../../store/app-slice";
import { svGetEmployee } from '../../services/employee.service';
import SwalUI from "../../components/ui/swal-ui/swal-ui";

const Employee = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("members-page");
  const language = useSelector((state) => state.app.language);
  const [tabSelect, setTabSelect] = useState("");
  const [refreshData, setRefreshData] = useState(0);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    svGetEmployee().then((res) => {
      if (res.status) {
        const employee_data = res.data?.map((d) => {
          return {
            id: d.id,
            firstname: d.firstname,
            lastname: d.lastname,
            gender: d.gender,
            phone_number: d.phone_number,
            status: d.status,
            status_name: d.status_name,
            profile_image: d.profile_image,
            address: d.address,
            moo: d.moo,
            subdistrict: d.subdistrict,
            district: d.district,
            province: d.province,
            zipcode: d.zipcode,
            created_at: d.created_at,
            birthday: d.birthday,
          };
        });
        setEmployeeData(employee_data);
      } else {
        setEmployeeData([]);
      }
      dispatch(appActions.isSpawnActive(false));
    });
  }, [refreshData, language, tabSelect]);

  return (
    <section id="employee-page">
      <HeadPageComponent
        h1={"EmployeePage"}
        icon={<FontAwesomeIcon icon={faTag} />}
        breadcrums={[{ title: "EmployeePage", link: false }]}
      />
      <div className="card-control fixed-width">
        <div className="card-head">
          <div className="head-action">
            <h2 className="head-title">
              <ButtonUI
                onClick={() => setRefreshData(refreshData + 1)}
                on="create"
                isLoading={false}
                icon={<FontAwesomeIcon icon={faRedo} />}
              >
                {t("Fetch")}
              </ButtonUI>
            </h2>
          </div>
        </div>

        <EmployeeTab
          setRefreshData={setRefreshData}
          tabSelect={tabSelect}
          employeeData={employeeData}
          setTabSelect={setTabSelect}
          setEmployeeModal={setEmployeeModal}
          employeeModal={employeeModal}
        />
      </div>
    </section>
  );
};

export default Employee;
