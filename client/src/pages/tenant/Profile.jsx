import { useEffect, useState } from "react";
import TenantLayout from "../../layouts/TenantLayout";
import { getTenantDashboard } from "../../services/tenantService";
import { changeEmail, changePassword } from "../../services/userService";
import {toast} from "react-hot-toast";
function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailData, setEmailData] = useState({
  newEmail: "",
});

const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getTenantDashboard();
        setProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const handleEmailUpdate = async () => {
  if (!emailData.newEmail.trim()) {
    toast.error("Please enter a new email.");
    return;
  }

  try {
    await changeEmail(emailData.newEmail);

    toast.success("Email updated successfully!");

    setProfile({
      ...profile,
      email: emailData.newEmail,
    });

    setEmailData({
      newEmail: "",
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update email."
    );
  }
};

const handlePasswordUpdate = async () => {
  if (
    !passwordData.currentPassword ||
    !passwordData.newPassword ||
    !passwordData.confirmPassword
  ) {
    toast.error("Please fill all password fields.");
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  try {
    await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    toast.success("Password updated successfully!");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update password."
    );
  }
};

  return (
  <TenantLayout>
    <div className="space-y-8">

      {/* Header */}

    </div>
    {/* Personal Information */}
<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
    Personal Information
  </h2>

  {loading ? (
    <p className="text-slate-500">Loading...</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>
        <p className="text-sm text-slate-500">Name</p>
        <p className="font-semibold text-slate-900 dark:text-white">
          {profile.name}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Email</p>
        <p className="font-semibold text-slate-900 dark:text-white">
          {profile.email}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Phone</p>
        <p className="font-semibold text-slate-900 dark:text-white">
          {profile.phone}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Property</p>
        <p className="font-semibold text-slate-900 dark:text-white">
          {profile.property_name}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Room Number</p>
        <p className="font-semibold text-slate-900 dark:text-white">
          {profile.room_number}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Monthly Rent</p>
        <p className="font-semibold text-slate-900 dark:text-white">
          ₹{Number(profile.rent).toLocaleString()}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Joining Date</p>
        <p className="font-semibold text-slate-900 dark:text-white">
          {new Date(profile.joining_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

    </div>
  )}
</div>
{/* Account Settings */}
<div className="mt-8">
  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
    Account Settings
  </h2>

  <p className="mt-2 mb-6 text-slate-500 dark:text-slate-400">
    Manage your email address and password.
  </p>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Change Email */}
<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
    Change Email
  </h2>

  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
        Current Email
      </label>

      <input
        type="email"
        value={profile?.email || ""}
        disabled
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
        New Email
      </label>

      <input
        type="email"
        placeholder="Enter new email"
        value = {emailData.newEmail}
        onChange={(e)=>
            setEmailData({
                ...emailData,
                newEmail: e.target.value,
            })
        }
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
      />
    </div>

    <button 
    onClick={handleEmailUpdate}
    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition">
      Update Email
    </button>
  </div>
</div>

  {/* Change Password */}
<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6">
  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
    Change Password
  </h2>

  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
        Current Password
      </label>

      <input
        type="password"
        value={passwordData.currentPassword}
            onChange={(e) =>
            setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
            })
            }
        placeholder="Enter current password"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
        New Password
      </label>

      <input
        type="password"
        value={passwordData.newPassword}
        onChange={(e) =>
        setPasswordData({
            ...passwordData,
            newPassword: e.target.value,
        })
        }
        placeholder="Enter new password"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
        Confirm Password
      </label>

      <input
        type="password"
        value={passwordData.confirmPassword}
        onChange={(e) =>
        setPasswordData({
            ...passwordData,
            confirmPassword: e.target.value,
        })
        }
        placeholder="Confirm new password"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
      />
    </div>

    <button 
    onClick={handlePasswordUpdate}
    className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 transition"
    >
      Change Password
    </button>
  </div>
</div>
  </div>
</div>
  </TenantLayout>
);
};
export default Profile;