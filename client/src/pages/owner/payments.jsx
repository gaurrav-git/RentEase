import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getPayments,
    createPayment,
    getMyPayments,
    updatePayment,
    deletePayment,
} from "../../services/paymentService";
import { getTenants } from "../../services/tenantService";  
import { toast, Toaster } from "react-hot-toast";
import { Pencil, Trash2, Search } from "lucide-react";

const Payments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [tenants, setTenants] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPaymentId, setEditingPaymentId] = useState(null);

    const [formData, setFormData] = useState({
    tenant_id: "",
    room_id: "",
    amount: "",
    payment_date: "",
    status: "PENDING",
    });

    useEffect(() => {
        fetchPayments();
        fetchTenants();
    }, []);

    const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase();

    return (
        payment.tenant_name.toLowerCase().includes(search) ||
        payment.room_number.toLowerCase().includes(search)
    );
});

    const fetchPayments = async () => {
        try {
            const response = await getPayments();
            setPayments(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTenants = async () => {
    try {
        const response = await getTenants();
        setTenants(response.data || []);
    } catch (error) {
        console.error(error);
        setTenants([]);
    }
};

    const totalRevenue = payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingPayments = payments.filter(
    (p) =>
        p.status === "PENDING" &&
        new Date(p.payment_date) >= new Date()
).length;

    const paidPayments = payments.filter(
        (p) => p.status === "PAID"
    ).length;

    const overduePayments = payments.filter(
    (p) =>
        p.status === "PENDING" &&
        new Date(p.payment_date) < new Date()
).length;

    const handleSavePayment = async () => {
    try {
        if (isEditing) {

    await updatePayment(
        editingPaymentId,
        formData
    );

    toast.success("Payment updated successfully");

} else {

    await createPayment(formData);

    toast.success("Payment recorded successfully");

}

        setShowModal(false);

        setFormData({
            tenant_id: "",
            room_id: "",
            amount: "",
            payment_date: "",
            status: "PENDING",
        });

        fetchPayments();

    } catch (error) {
        console.error(error);

        toast.error(
            error.response?.data?.message ||
            "Failed to record payment"
        );
    }
};

const handleEdit = (payment) => {

    setIsEditing(true);
    setEditingPaymentId(payment.id);

    setFormData({
        tenant_id: payment.tenant_id,
        room_id: payment.room_id,
        amount: payment.amount,
        payment_date: payment.payment_date
        ? payment.payment_date.split("T")[0]
        : "",
        status: payment.status,
    });

    setShowModal(true);
};

const handleDelete = async (id) => {

    if (!window.confirm("Delete this payment?")) return;

    try {

        await deletePayment(id);

        toast.success("Payment deleted successfully");

        fetchPayments();

    } catch (error) {

        console.error(error);

        toast.error("Failed to delete payment");

    }
};



    return (
        <DashboardLayout>
        <Toaster position="top-right" />
        <div className="flex items-center justify-between mb-6">
    <div className="relative w-80">
        <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
        />

        <input
            type="text"
            placeholder="Search by tenant or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl
                       bg-white dark:bg-slate-800
                       dark:border-slate-700
                       dark:text-white
                       focus:outline-none
                       focus:ring-2
                       focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
                >
                    + Record Payment
                </button>
            </div>
            <div className="space-y-6">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
                        <p className="text-sm text-slate-500">Total Revenue</p>
                        <h2 className="text-2xl font-bold mt-2 dark:text-white">
                            ₹{totalRevenue.toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
                        <p className="text-sm text-slate-500">Paid</p>
                        <h2 className="text-2xl font-bold mt-2 dark:text-white">
                            {paidPayments}
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
                        <p className="text-sm text-slate-500">Pending</p>
                        <h2 className="text-2xl font-bold mt-2 dark:text-white">
                            {pendingPayments}
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
                        <p className="text-sm text-slate-500">Overdue</p>
                        <h2 className="text-2xl font-bold mt-2 dark:text-white">
                            {overduePayments}
                        </h2>
                    </div>

                </div>

                {/* Payments Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-100 dark:bg-slate-700">

                            <tr>
                                <th className="text-left px-6 py-3 dark:text-white">Tenant</th>
                                <th className="text-left px-6 py-3 dark:text-white">Property</th>
                                <th className="text-left px-6 py-3 dark:text-white">Room</th>
                                <th className="text-left px-6 py-3 dark:text-white">Amount</th>
                                <th className="text-left px-6 py-3 dark:text-white">Date</th>
                                <th className="text-left px-9 py-3 dark:text-white">Status</th>
                                <th className="px-9 py-3 text-left dark:text-white">Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-8"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-8 dark:text-slate-400"
                                    >
                                        No payments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="border-t dark:border-slate-700 dark:text-white"
                                    >
                                        <td className="px-6 py-4 dark:text-white">
                                            {payment.tenant_name}
                                        </td>

                                        <td className="px-6 py-4 dark:text-white">
                                            {payment.property_name}
                                        </td>

                                        <td className="px-6 py-4 dark:text-white">
                                            {payment.room_number}
                                        </td>

                                        <td className="px-6 py-4 dark:text-white">
                                            ₹{payment.amount}
                                        </td>

                                        <td className="px-6 py-4">
                                            {new Date(
                                                payment.payment_date
                                            ).toLocaleDateString()}
                                        </td>
                                        

                                        <td className="px-6 py-4">

                                            <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                payment.status === "PAID"
                                                    ? "bg-green-100 text-green-700"
                                                    : payment.status === "PENDING" &&
                                                    new Date(payment.payment_date) < new Date()
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {payment.status === "PENDING" &&
                                            new Date(payment.payment_date) < new Date()
                                                ? "OVERDUE"
                                                : payment.status}
                                        </span>

                                        </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">

                                    <button
                                        onClick={() => handleEdit(payment)}
                                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-600 transition"
                                    >
                                        <Pencil size={18}/>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(payment.id)}
                                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-slate-700 text-red-500 transition"
                                    >
                                        <Trash2 size={18}/>
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
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            {isEditing ? "Edit Payment" : "Record Payment"}
        </h2>

        <div className="space-y-4">

            {/* Tenant */}

            <select
                value={formData.tenant_id}
                onChange={(e) => {
                    const tenant = tenants.find(
                        (t) => t.user_id === Number(e.target.value)
                    );

                    setFormData({
                        ...formData,
                        tenant_id: tenant.user_id,
                        room_id: tenant.room_id,
                    });

                }}

                disabled={isEditing}
            className={`w-full p-3 rounded-lg border border-slate-300
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                isEditing
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed border-slate-600"
                    : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            }`}
            >

                <option value="">Select Tenant</option>

                {tenants.map((tenant) => (

                    <option
                        key={tenant.id}
                        value={tenant.user_id}
                    >
                        {tenant.name} • {tenant.property_name} • {tenant.room_number}
                    </option>

                ))}

            </select>

            {/* Amount */}

            <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        amount: e.target.value,
                    })
                }
                className="w-full p-3 rounded-lg border border-slate-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Date */}

            <input
        type="date"
        value={formData.payment_date}
        onChange={(e) =>
            setFormData({
                ...formData,
                payment_date: e.target.value,
        })
        }
        onClick={(e) => e.target.showPicker?.()}
        className="w-full p-3 rounded-lg border border-slate-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

            {/* Status */}

            <select
                value={formData.status}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        status: e.target.value,
                    })
                }
className="w-full p-3 rounded-lg border border-slate-300 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"            >

                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
            </select>

        </div>

        <div className="flex justify-end gap-3 mt-6">

            <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border dark:text-white"
            >
                Cancel
            </button>

            <button
                onClick={handleSavePayment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
                {isEditing ? "Update Payment" : "Save Payment"}
            </button>

        </div>

    </div>

</div>
)}
        </DashboardLayout>
    );
};

export default Payments;