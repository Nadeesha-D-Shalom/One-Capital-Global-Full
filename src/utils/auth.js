export const getAdminUser = () => {
  try {
    const stored = localStorage.getItem("admin_user");
    if (!stored) return null;
    const admin = JSON.parse(stored);
    if (!admin || typeof admin !== "object" || !admin.id) {
      localStorage.removeItem("admin_user");
      return null;
    }
    return admin;
  } catch {
    localStorage.removeItem("admin_user");
    return null;
  }
};

export const clearAdminUser = () => {
  localStorage.removeItem("admin_user");
  localStorage.removeItem("admin_active_tab");
};