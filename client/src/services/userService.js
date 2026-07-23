import api from "./api";

export const changeEmail = (newEmail) => {
  return api.put("/users/change-email", {
    newEmail,
  });
};

export const changePassword = (currentPassword, newPassword) => {
  return api.put("/users/change-password", {
    currentPassword,
    newPassword,
  });
};