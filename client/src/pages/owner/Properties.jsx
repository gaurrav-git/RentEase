import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {toast,  Toaster } from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getProperties,
    createProperty,
    updateProperty,
    deleteProperty,
} from "../../services/propertyService";
const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            const response = await getProperties();
            setProperties(response.data);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    const handleSaveProperty = async () => {

    if (
        !formData.name ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
    ) {
        toast.error("Please fill all fields.");
        return;
    }

    try {

        if (isEditing) {

    await updateProperty(editingId, formData);
        toast.success("Property updated successfully!");

} else {

    await createProperty(formData);
    toast.success("Property created successfully!");

}

        // Refresh table
        await loadProperties();

        // Close modal
        setShowModal(false);
        setIsEditing(false);
        setEditingId(null);

        // Clear form
        setFormData({
            name: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
        });

    } catch (error) {
        console.error(error);
        toast.error("Failed to save property.");
    }

    };


    const handleEdit = (property) => {

    setIsEditing(true);
    setEditingId(property.id);

    setFormData({
        name: property.name,
        address: property.address,
        city: property.city,
        state: property.state,
        pincode: property.pincode,
    });

    setShowModal(true);
};

    const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {

        await deleteProperty(id);

        await loadProperties();
        toast.success("Property deleted successfully!");
    } catch (error) {

        console.error(error);
        toast.error("Failed to delete property.");

    }
};

    const filteredProperties = properties.filter((property) => {
    const search = searchTerm.toLowerCase();

    return (
        property.name.toLowerCase().includes(search) ||
        property.city.toLowerCase().includes(search)
    );
});

    return (
        <DashboardLayout>
        <div className="px-8 py-6">

            <Toaster
        position="top-right"
        reverseOrder={false}
        />

            {/* Header */}

            <div className="flex items-center justify-between mb-6">
                <div className="relative mb-6">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition"
                >
                    <Plus size={18} />
                    Add Property
                </button>
            </div>
            

            {/* Table */}

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100 dark:bg-slate-800">

                        <tr>

                            <th className="text-left px-5 py-4 text-slate-700 dark:text-slate-300">
                                Property
                            </th>

                            <th className="text-left px-5 py-4 text-slate-700 dark:text-slate-300">
                                City
                            </th>

                            <th className="text-left px-5 py-4 text-slate-700 dark:text-slate-300">
                                State
                            </th>

                            <th className="text-left px-5 py-4 text-slate-700 dark:text-slate-300">
                                Pincode
                            </th>

                            <th className="text-center px-5 py-4 text-slate-700 dark:text-slate-300">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredProperties.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center py-12 text-slate-500 dark:text-slate-400"
                                >
                                    No properties found.
                                </td>

                            </tr>

                        ) : (

                            filteredProperties.map((property) => (

                                <tr
                                    key={property.id}
                                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >

                                    <td className="px-5 py-4 text-slate-900 dark:text-white">
                                        {property.name}
                                    </td>

                                    <td className="px-5 py-4 text-slate-900 dark:text-white">
                                        {property.city}
                                    </td>

                                    <td className="px-5 py-4 text-slate-900 dark:text-white">
                                        {property.state}
                                    </td>

                                    <td className="px-5 py-4 text-slate-900 dark:text-white">
                                        {property.pincode}
                                    </td>

                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() => handleEdit(property)}
                                                 className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition"
                                            >
                                                <Pencil size={20} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(property.id)}
                                                className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                                            >
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

            {/* Add Property Modal */}

            {showModal && (

                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl p-6">

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            {isEditing ? "Edit Property" : "Add Property"}
                        </h2>

                        <div className="space-y-4">

                            <input
                                type="text"
                                placeholder="Property Name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <textarea
                                rows="3"
                                placeholder="Address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="grid grid-cols-2 gap-4">

                                <input
                                    type="text"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            city: e.target.value,
                                        })
                                    }
                                    className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="text"
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            state: e.target.value,
                                        })
                                    }
                                    className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            <input
                                type="text"
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        pincode: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                        <div className="flex justify-end gap-3 mt-8">

                            <button
                                onClick={() => {

                                        setShowModal(false);

                                        setIsEditing(false);

                                        setEditingId(null);

                                        setFormData({
                                            name: "",
                                            address: "",
                                            city: "",
                                            state: "",
                                            pincode: "",
                                        });

                                }}
                                className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:opacity-90 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveProperty}
                                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                            >
                                    {isEditing ? "Update Property" : "Save Property"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
        </DashboardLayout>
    );
};

export default Properties;