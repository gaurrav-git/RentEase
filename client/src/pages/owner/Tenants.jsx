import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
    createTenant,
    updateTenant,
    deleteTenant,
    getTenants,
} from "../../services/tenantService";
import { getRooms } from "../../services/roomService";
import { getProperties } from "../../services/propertyService";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";

const Tenants = () => {
const [rooms, setRooms] = useState([]);
const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [editingId, setEditingId] = useState(null);
const [properties, setProperties] = useState([]);
const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    room_id: "",
    phone: "",
    aadhaar: "",
    occupation: "",
    joining_date: "",
    security_deposit: "",
});

  useEffect(() => {
    fetchTenants();
    loadProperties();
    loadRooms();
  }, []);



  const fetchTenants = async () => {
  try {
    setLoading(true);

    const response = await getTenants();

    setTenants(response.data.data);
  } catch (error) {
    console.error("Failed to fetch tenants:", error);
  } finally {
    setLoading(false);
  }
};

    const loadRooms = async () => {
        try {
            const response = await getRooms();
            setRooms(response.data.data);
        } catch (error) {
            console.error("Failed to load rooms:", error);
        }
    };

  const handleSaveTenant = async () => {

    if (isEditing) {

        if (
            !formData.name ||
            !formData.phone ||
            !formData.occupation ||
            !formData.room_id
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

    } else {

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.phone ||
            !formData.aadhaar ||
            !formData.occupation ||
            !formData.room_id ||
            !formData.joining_date ||
            !formData.security_deposit
        ) {
            toast.error("Please fill all required fields.");
            return;
        }
    }

    try {

        if (isEditing) {

            await updateTenant(editingId, formData);
            toast.success("Tenant updated successfully!");

        } else {

            await createTenant(formData);
            toast.success("Tenant created successfully!");

        }

        await fetchTenants();

        setShowModal(false);
        setIsEditing(false);
        setEditingId(null);

        setFormData({
            name: "",
            email: "",
            password: "",
            room_id: "",
            phone: "",
            aadhaar: "",
            occupation: "",
            joining_date: "",
            security_deposit: "",
        });

    } catch (error) {

        console.error(error);
        toast.error("Failed to save tenant.");

    }
};

const handleEdit = (tenant) => {
setEditingId(tenant.id);
    setFormData({
        id: tenant.id,
        name: tenant.name || "",
        phone: tenant.phone || "",
        occupation: tenant.occupation || "",
        room_id: tenant.room_id || "",
    });

    setIsEditing(true);
    setShowModal(true);
};

const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this tenant?"
    );

    if (!confirmDelete) return;

    try {

        await deleteTenant(id);

        toast.success("Tenant deleted successfully!");

        await fetchTenants();

    } catch (error) {

        console.error(error);

        toast.error("Failed to delete tenant.");

    }

};

  const loadProperties = async () => {
    try {

        const response = await getProperties();

        setProperties(response.data);

    } catch (error) {

        console.error(error);

    }
};


  const getStatusClass = (status) => {
    switch (status) {
      case "VACANT":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";

      case "OCCUPIED":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase()) ||
    tenant.property_name.toLowerCase().includes(search.toLowerCase()) ||
    tenant.room_number.toLowerCase().includes(search.toLowerCase()) ||
    tenant.phone.includes(search)
);

  return (
    <DashboardLayout>
        <Toaster
    position="top-right"
    reverseOrder={false}
    />
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">

    {/* Search */}

    <div className="relative w-64">

        <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400  dark:text-gray-400" 
        />

        <input
    type="text"
    placeholder="Search tenants..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
        w-full
        rounded-xl
        py-3
        pl-10
        pr-4
        border

        bg-white
        border-gray-300
        text-gray-900
        placeholder-gray-500

        dark:bg-[#111827]
        dark:border-gray-700
        dark:text-white
        dark:placeholder-gray-400

        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
    "
/>

    </div>

    {/* Add Button */}

    <button
        className="flex items-center gap-2
                   bg-blue-600
                   hover:bg-blue-700
                   px-6 py-3
                   rounded-xl
                   text-white
                   transition"
                   onClick={() => {

        setShowModal(true);

        setIsEditing(false);

        setFormData({
            property_id: "",
            room_number: "",
            capacity: "",
            rent: "",
        });

    }}
    >
        <Plus size={18}/>
        Add Tenant
    </button>

    </div>

        

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
          <table className="min-w-full">
            <thead className="bg-slate-800 text-white">
  <tr>
    <th className="w-32 px-6 py-4 text-left">Tenant</th>
    <th className="w-56 px-28 py-4 text-left">Property</th>
    <th className="w-32 px-6 py-4 text-center">Room</th>
    <th className="w-32 px-6 py-4 text-center">Phone</th>
    <th className="w-40 px-6 py-4 text-center">Deposit</th>
    <th className="w-40 px-6 py-4 text-center">Status</th>
    <th className="w-32 px-6 py-4 text-center">Actions</th>
  </tr>
</thead>

<tbody>
    {filteredTenants.length === 0 ? (
        <tr>
            <td
                colSpan="7"
                className="text-center py-12 text-slate-500 dark:text-slate-400"
            >
                No tenants found.
            </td>
        </tr>
    ) : (
        filteredTenants.map((tenant) => (
            <tr
                key={tenant.id}
                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                <td className="px-6 py-5  text-slate-900 dark:text-white">
                    {tenant.name}
                </td>

                <td className="px-6 py-5 text-center text-slate-900 dark:text-white">
                    {tenant.property_name}
                </td>

                <td className="px-6 py-5 text-center text-slate-900 dark:text-white">
                    {tenant.room_number}
                </td>

                <td className="px-6 py-5 text-center text-slate-900 dark:text-white">
                    {tenant.phone}
                </td>

                <td className="px-6 py-5 text-center text-slate-900 dark:text-white">
                    ₹{Number(tenant.security_deposit).toLocaleString()}
                </td>

                <td className="px-6 py-5 text-center">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            tenant.status
                        )}`}
                    >
                        {tenant.status}
                    </span>
                </td>

                <td className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-2">
                        <button 
                        onClick={() => handleEdit(tenant)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition">
                            <Pencil size={20} />
                        </button>

                        <button 
                            onClick={() => handleDelete(tenant.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </td>
            </tr>
        ))
    )}
</tbody>
          </table>
        </div>
      </div>

      {showModal && (

<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6">

<h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">

{isEditing ? "Edit Tenant" : "Add Tenant"}

</h2>

    <div className="space-y-4">

    <input
    type="text"
    placeholder="Full Name"
    value={formData.name || ""}
    onChange={(e) =>
        setFormData({
            ...formData,
            name: e.target.value,
        })
    }
    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
/>

    {!isEditing && (
    <input
        type="email"
        placeholder="Email"
        value={formData.email || ""}
        onChange={(e) =>
            setFormData({
                ...formData,
                email: e.target.value,
            })
        }
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
    />
)}

    {!isEditing && (
        <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    password: e.target.value,
                })
            }
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
    )}

    <input
        type="text"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) =>
            setFormData({
                ...formData,
                phone: e.target.value,
            })
        }
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
    />

    {!isEditing && (
    <input
        type="text"
        placeholder="Aadhaar Number"
        value={formData.aadhaar || ""}
        onChange={(e) =>
            setFormData({
                ...formData,
                aadhaar: e.target.value,
            })
        }
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
    />
)}

    <input
        type="text"
        placeholder="Occupation"
        value={formData.occupation}
        onChange={(e) =>
            setFormData({
                ...formData,
                occupation: e.target.value,
            })
        }
        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
    />

    <select
    value={formData.room_id}
    onChange={(e) =>
        setFormData({
            ...formData,
            room_id: e.target.value,
        })
    }
    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
>
    <option value="">Select Room</option>

    {rooms.map((room) => {
        const isFull = room.occupied >= room.capacity;

        return (
            <option
                key={room.id}
                value={room.id}
                disabled={isFull}
            >
                {room.property_name} - {room.room_number}{" "}
                {isFull
                    ? `(FULL ${room.occupied}/${room.capacity})`
                    : `(${room.occupied}/${room.capacity})`}
            </option>
        );
    })}
</select>

    {!isEditing && (
        <input
            type="date"
            value={formData.joining_date}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    joining_date: e.target.value,
                })
            }
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
    )}

    {!isEditing && (
        <input
            type="number"
            placeholder="Security Deposit"
            value={formData.security_deposit}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    security_deposit: e.target.value,
                })
            }
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
    )}

</div>

<div className="flex justify-end gap-3 mt-8">

    <button
        onClick={() => setShowModal(false)}
        className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-white"
    >
        Cancel
    </button>

    <button
        onClick={handleSaveTenant}
        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white"
    >
        {isEditing ? "Update Tenant" : "Save Tenant"}
    </button>

    </div>

    </div>

    </div>

)}
    </DashboardLayout>
  );
};

export default Tenants;

