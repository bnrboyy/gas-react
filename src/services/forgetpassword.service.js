import axios from "axios";

export const forgetPasswordService = (formData) => {
  return axios.post(`forget-password`, formData).then(
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
  )
}

export const resetPasswordService = (formData) => {
    return axios.post(`reset-password`, formData).then(
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
  }
  
  