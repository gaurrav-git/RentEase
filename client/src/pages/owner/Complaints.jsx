import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

import { getComplaints, updateComplaintStatus } from "../../services/complaintService";

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({
        open: 0,
        inProgress: 0,
        resolved: 0,
        total: 0,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchComplaints = async () => {
        try {
            const response = await getComplaints();

            setComplaints(response.data);
            setStats(response.stats);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load complaints");
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
        const matchesSearch =
            complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.room_number.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "ALL" || complaint.status === statusFilter;

        return matchesSearch && matchesStatus;
    });
}, [complaints, searchTerm, statusFilter]);


const handleStatusChange = async (id, status) => {
    try {
        await updateComplaintStatus(id, status);

        toast.success("Complaint updated successfully");

        fetchComplaints();
    } catch (error) {
        toast.error("Failed to update complaint");
    }
};

    return (
            <div className="space-y-8">

                <div className="flex flex-col md:flex-row gap-4">

    <div className="relative flex-1">
        <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
        />

        <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border
            border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            focus:ring-2 focus:ring-indigo-500
            outline-none"
        />
    </div>

    <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="md:w-52 pl-11 pr-4 py-3 rounded-xl border
border-gray-300 dark:border-gray-700
bg-white dark:bg-gray-800
text-gray-900 dark:text-white
placeholder:text-gray-500 dark:placeholder:text-gray-400
focus:ring-2 focus:ring-indigo-500
outline-none"
    >
        <option value="ALL">All Status</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
    </select>

</div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="text-gray-500 dark:text-white">Open</h3>
        <p className="text-3xl font-bold mt-2 dark:text-white">{stats.open}</p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="text-gray-500 dark:text-white">In Progress</h3>
        <p className="text-3xl font-bold mt-2 dark:text-white">{stats.inProgress}</p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="text-gray-500 dark:text-white">Resolved</h3>
        <p className="text-3xl font-bold mt-2 dark:text-white">{stats.resolved}</p>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="text-gray-500 dark:text-white">Total</h3>
        <p className="text-3xl font-bold mt-2 dark:text-white">{stats.total}</p>
    </div>

</div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow">

    <div className="p-6 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white">
            Complaint History
        </h2>
    </div>

    <div className="max-h-[550px] overflow-y-auto p-6 space-y-5">

    {filteredComplaints.map((complaint) => (

    <div
        key={complaint.id}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 hover:shadow-md transition"
    >
        <div className="flex justify-between items-start">

            <div className="flex-1">

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {complaint.title}
                </h3>

                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {complaint.description}
                </p>

            </div>

            <select
    value={complaint.status}
    onChange={(e) =>
        handleStatusChange(complaint.id, e.target.value)
    }
    className="bg-white dark:bg-gray-800 rounded-xl shadow dark:text-white">
    <option value="OPEN">Open</option>
    <option value="IN_PROGRESS">In Progress</option>
    <option value="RESOLVED">Resolved</option>
</select>

        </div>

        <div className="mt-5 flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">

            <span>
                {complaint.tenant_name}
            </span>

            <span>
                {complaint.property_name}
            </span>

            <span>
                Room {complaint.room_number}
            </span>

            <span>
                {new Date(complaint.created_at).toLocaleDateString()}
            </span>

        </div>

    </div>

))
}
    </div>

</div>


            </div>
    );
};

export default Complaints;