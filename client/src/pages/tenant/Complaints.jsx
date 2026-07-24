import TenantLayout from "../../layouts/TenantLayout";
import { useEffect, useState } from "react";
import { Search, Plus,Clock3, Wrench, CheckCircle2} from "lucide-react";
import { getMyComplaints } from "../../services/complaintService";
import { createComplaint } from "../../services/complaintService";
import toast from "react-hot-toast";

const Complaints = () => {

    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        resolved: 0,
    });

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

const [formData, setFormData] = useState({
    title: "",
    description: "",
});

const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await getMyComplaints();

            setComplaints(response.complaints);
            setStats(response.stats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
        return toast.error("Please fill in all fields.");
    }

    try {
        setSubmitting(true);

        await createComplaint(formData);

        toast.success("Complaint submitted successfully!");

        setShowModal(false);

        setFormData({
            title: "",
            description: "",
        });

        fetchComplaints();

    } catch (error) {
        toast.error(
            error.response?.data?.message || "Failed to submit complaint."
        );
    } finally {
        setSubmitting(false);
    }
};

    const filteredComplaints = complaints.filter((complaint) =>
    complaint.title.toLowerCase().includes(search.toLowerCase()) ||
    complaint.description.toLowerCase().includes(search.toLowerCase())
);

    return (
        <TenantLayout>

<div className="space-y-8">

  <div className="flex items-center justify-between">

        <div className="relative">
    <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
    />

    <input
        type="text"
        placeholder="Search complaints..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-80 pl-10 pr-4 py-2 border rounded-lg
      dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />

</div>

        <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
            <Plus size={18} />
            Raise Complaint
        </button>

    </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pending
                </p>

                <h2 className="text-3xl font-bold mt-2 dark:text-white">
                    {stats.pending}
                </h2>
            </div>

            <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                <Clock3 className="text-yellow-600" size={24} />
            </div>
        </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    In Progress
                </p>

                <h2 className="text-3xl font-bold mt-2 dark:text-white">
                    {stats.inProgress}
                </h2>
            </div>

            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Wrench className="text-blue-600" size={24} />
            </div>
    </div>
  </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Resolved
                </p>

                <h2 className="text-3xl font-bold mt-2 dark:text-white">
                    {stats.resolved}
                </h2>
            </div>

            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="text-green-600" size={24} />
            </div>
        </div>
    </div>
    
  </div>

      <div>

    {filteredComplaints.length === 0 ? (

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow text-center py-12">

            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">

                <Plus
                    size={28}
                    className="text-blue-600"
                />

            </div>

            <h2 className="mt-5 text-xl font-semibold dark:text-white">
                No complaints yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
                You're all set! If you experience any maintenance issue,
                click <strong>Raise Complaint</strong> above.
            </p>

        </div>

    ) : (

  <div className="space-y-4">
    {filteredComplaints.map((complaint) => (
        <div
            key={complaint.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-5"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold dark:text-white">
                        {complaint.title}
                    </h2>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {complaint.description}
                    </p>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === "OPEN"
                            ? "bg-yellow-100 text-yellow-700"
                            : complaint.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {complaint.status.replace("_", " ")}
                </span>
            </div>

            <div className="flex justify-between mt-5 text-sm text-gray-500 dark:text-gray-400">
                <span>
                    {complaint.property_name} • Room {complaint.room_number}
                </span>

                <span>
                    {new Date(complaint.created_at).toLocaleDateString()}
                </span>
            </div>
        </div>
    ))}
</div>

    )}

{showModal && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">

            <h2 className="text-2xl font-bold dark:text-white">
                Raise Complaint
            </h2>

            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
            >

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                        Complaint Title
                    </label>

                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                title: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g. Water leakage in bathroom"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                        Description
                    </label>

                    <textarea
                        rows={5}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        className="w-full border rounded-lg px-4 py-2 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Describe the issue..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">

                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-lg border dark:text-white"
                    >
                        Cancel
                    </button>

                      <button
                          type="submit"
                          disabled={submitting}
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                      >
                          {submitting ? "Submitting..." : "Submit"}
                      </button>

                </div>

            </form>

        </div>

    </div>
)}
</div>
</div>

        </TenantLayout>
    );
};

export default Complaints;