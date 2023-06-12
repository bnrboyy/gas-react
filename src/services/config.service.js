import axios from "axios";

export const getConfigData = (language) => {
  return axios.get(`config/data?language=${language}`).then(
    (res) => {
      return { status: true, data: res.data.data };
    },
    (error) => {
      return {
        status: false,
        description: !error.response.data
          ? "Something went wrong."
          : error.response.data.description,
      };
    }
  );
};

export const configBannerCreate = (formData) => {
  return axios.post(`config/ad_type/create`, formData).then(
    (res) => {
      return { status: true, description: res.data.description };
    },
    (error) => {
      return {
        status: false,
        description: !error.response.data
          ? "Something went wrong."
          : error.response.data.description,
      };
    }
  );
};


export const manualUploadService = (formData) => {
    return axios.post(`config/upload/manual`, formData).then(
      (res) => {
        return { status: true, description: res.data.description };
      },
      (error) => {
        return {
          status: false,
          description: !error.response.data
            ? "Something went wrong."
            : error.response.data.description,
        };
      }
    );
  };

// export const deleteAdminService = (token) => {
//   return axios.delete(`admin/token/${token}`).then(
//     (res) =>  { return { status: true, description: res.data.description }},
//     (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
//   )
// }
