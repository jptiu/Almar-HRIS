import axiosInstance from "@/services/axiosInstance";

const mapMeResponseToProfile = (mePayload, creditsPayload = []) => {
  const user = mePayload?.user || {};

  return {
    personalInfo: {
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      phoneNumber: user.phone || "",
      address: [
        user.address_line_1,
        user.address_line_2,
        user.city,
        user.state,
        user.postal_code,
        user.country,
      ]
        .filter(Boolean)
        .join(", "),
      birthday: user.birthdate || "",
    },
    jobInfo: {
      employeeId: user.employee_id || "",
      department: user.department || "",
      position: user.position || "",
      employmentStatus: user.employee_status || "",
      hireDate: user.hire_date || "",
      supervisor: "N/A",
    },
    leaveCredits: (creditsPayload || []).map((credit) => ({
      type: credit.leave_type_name,
      used: Number(credit.used_days || 0),
      remaining: Number(credit.remaining_days || 0),
      total: Number(credit.total_days || 0),
    })),
  };
};

const mapProfilePayloadToApi = (data) => {
  const addressParts = String(data.address || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phoneNumber,
    birthdate: data.birthday,
    address_line_1: addressParts[0] || "",
    address_line_2: addressParts[1] || "",
    city: addressParts[2] || "",
    state: addressParts[3] || "",
    postal_code: addressParts[4] || "",
    country: addressParts[5] || "",
  };
};

/**
 * Fetch profile data
 * GET /api/me
 */
export const fetchProfileApi = async () => {
  const [{ data: meResponse }, { data: leaveCreditsResponse }] = await Promise.all([
    axiosInstance.get("/me"),
    axiosInstance.get("/me/leave/credits"),
  ]);

  if (!meResponse?.success) {
    throw new Error(meResponse?.message || "Failed to fetch profile");
  }

  const leaveCredits = leaveCreditsResponse?.success
    ? leaveCreditsResponse?.data?.credits || []
    : [];

  return mapMeResponseToProfile(meResponse.data, leaveCredits);
};

/**
 * Update personal information
 * PUT /api/me
 */
export const updatePersonalInfoApi = async (data) => {
  const payload = mapProfilePayloadToApi(data);
  const { data: response } = await axiosInstance.put("/me", payload);

  if (!response?.success) {
    throw new Error(response?.message || "Failed to update profile");
  }

  return response.data;
};

/**
 * Reset password
 * PUT /api/me
 */
export const resetPasswordApi = async (data) => {
  const { data: response } = await axiosInstance.put("/me", {
    password: data.newPassword,
  });

  if (!response?.success) {
    throw new Error(response?.message || "Failed to reset password");
  }

  return response.data;
};
