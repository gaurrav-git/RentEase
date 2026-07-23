import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
    createRoom,
    updateRoom,
    deleteRoom,
} from "../../services/roomService";
import { getProperties } from "../../services/propertyService";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getRooms } from "../../services/roomService";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [editingId, setEditingId] = useState(null);
const [properties, setProperties] = useState([]);
const [formData, setFormData] = useState({
    property_id: "",
    room_number: "",
    capacity: "",
    rent: "",
});

  useEffect(() => {
    fetchRooms();
    loadProperties();
  }, []);

  useEffect(() => {
    const filtered = rooms.filter(
      (room) =>
        room.room_number.toLowerCase().includes(search.toLowerCase()) ||
        room.property_name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredRooms(filtered);
  }, [search, rooms]);

  const fetchRooms = async () => {
  try {
    setLoading(true);

    const response = await getRooms();

    setRooms(response.data.data);
    setFilteredRooms(response.data.data);

  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  } finally {
    setLoading(false);
  }
};

  const handleSaveRoom = async () => {

    if (
        !formData.property_id ||
        !formData.room_number ||
        !formData.capacity ||
        !formData.rent
    ) {

        toast.error("Please fill all fields.");

        return;
    }

    try {

        if (isEditing) {

            await updateRoom(editingId, formData);

            toast.success("Room updated successfully!");

        } else {

            await createRoom(formData);

            toast.success("Room created successfully!");

        }

       await fetchRooms();

setShowModal(false);

setIsEditing(false);

setEditingId(null);

setFormData({
    property_id: "",
    room_number: "",
    capacity: "",
    rent: "",
});

    } catch (error) {

        console.error(error);

        toast.error("Failed to save room.");

    }

};

const handleEdit = (room) => {

    setIsEditing(true);

    setEditingId(room.id);

    setFormData({
        property_id: room.property_id,
        room_number: room.room_number,
        capacity: room.capacity,
        rent: Number(room.rent),
    });

    setShowModal(true);

};

const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this room?"
    );

    if (!confirmDelete) return;

    try {

        await deleteRoom(id);

        toast.success("Room deleted successfully!");

        await fetchRooms();

    } catch (error) {

        console.error(error);

        toast.error("Failed to delete room.");

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
    placeholder="Search rooms..."
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
        Add Room
    </button>

    </div>

        

        {/* Table */}
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
          <table className="min-w-full">
            <thead className="bg-slate-800 text-white">
  <tr>
    <th className="w-32 px-6 py-4 text-left">Room</th>
    <th className="w-56 px-28 py-4 text-left">Property</th>
    <th className="w-32 px-6 py-4 text-center">Capacity</th>
    <th className="w-32 px-6 py-4 text-center">Occupied</th>
    <th className="w-40 px-6 py-4 text-center">Rent</th>
    <th className="w-40 px-6 py-4 text-center">Status</th>
    <th className="w-32 px-6 py-4 text-center">Actions</th>
  </tr>
</thead>

<tbody>
    {filteredRooms.length === 0 ? (
        <tr>
            <td
                colSpan="7"
                className="text-center py-12 text-slate-500 dark:text-slate-400"
            >
                No rooms found.
            </td>
        </tr>
    ) : (
        filteredRooms.map((room) => (
            <tr
                key={room.id}
                className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                <td className="px-6 py-5  text-slate-900 dark:text-white">
                    {room.room_number}
                </td>

                <td className="px-6 py-5 text-center text-slate-900 dark:text-white">
                    {room.property_name}
                </td>

                <td className="px-6 py-5 text-center text-slate-900 dark:text-white">
                    {room.capacity}
                </td>

                <td className="px-6 py-5 text-center text-slate-900 dark:text-white">
                    {room.occupied}
                </td>

                <td className="px-6 py-5 text-center text-slate-900 dark:text-white">
                    ₹{Number(room.rent).toLocaleString()}
                </td>

                <td className="px-6 py-5 text-center">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            room.status
                        )}`}
                    >
                        {room.status}
                    </span>
                </td>

                <td className="px-6 py-5 text-center">
                    <div className="flex justify-center gap-2">
                        <button 
                        onClick={() => handleEdit(room)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition">
                            <Pencil size={20} />
                        </button>

                        <button 
                            onClick={() => handleDelete(room.id)}
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

{isEditing ? "Edit Room" : "Add Room"}

</h2>

<div className="space-y-4">

<select
value={formData.property_id}
onChange={(e)=>
setFormData({
...formData,
property_id:e.target.value
})
}
className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
>

<option value="">Select Property</option>

{properties.map(property=>(

<option
key={property.id}
value={property.id}
>

{property.name}

</option>

))}

</select>

<input
type="text"
placeholder="Room Number"
value={formData.room_number}
onChange={(e)=>
setFormData({
...formData,
room_number:e.target.value
})
}
className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
/>

<input
type="number"
placeholder="Capacity"
value={formData.capacity}
onChange={(e)=>
setFormData({
...formData,
capacity:e.target.value
})
}
className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
/>

<input
type="number"
placeholder="Monthly Rent"
value={formData.rent}
onChange={(e)=>
setFormData({
...formData,
rent:e.target.value
})
}
className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
/>

</div>

<div className="flex justify-end gap-3 mt-8">

<button
onClick={()=>setShowModal(false)}
className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700"
>

Cancel

</button>

<button
onClick={handleSaveRoom}
className="px-5 py-2.5 rounded-lg bg-blue-600 text-white"
>

{isEditing ? "Update Room" : "Save Room"}

</button>

</div>

</div>

</div>

)}
    </DashboardLayout>
  );
};

export default Rooms;

