import TenantLayout from "../../layouts/TenantLayout";
import { useEffect, useState } from "react";
import { IndianRupee, CheckCircle, Clock } from "lucide-react";
import { getMyPayments } from "../../services/paymentService";

const Payments = () => {
const [payments, setPayments] = useState([]);
const [stats, setStats] = useState({
    totalPaid: 0,
    pendingPayments: 0,
    monthlyRent: 0,
});
const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await getMyPayments();

            setPayments(response.payments);
            setStats(response.stats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
        <div className="flex justify-center items-center h-64">
            <div className="text-lg font-medium text-slate-500 dark:text-slate-300">
                Loading payments...
            </div>
        </div>
        ); 
    }

    return (
        <TenantLayout>

            {/* Summary Cards */}
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-7">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500">Total Paid</p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                                ₹ {stats.totalPaid}
                            </h2>
                        </div>

                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-7">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500">
                                Pending Payments
                            </p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                                {stats.pendingPayments}
                            </h2>
                        </div>

                        <Clock className="text-yellow-500" size={40} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-slate-500">
                                Monthly Rent
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                                ₹ {stats.monthlyRent}
                            </h2>
                        </div>

                        <IndianRupee
                            className="text-blue-600"
                            size={40}
                        />
                    </div>
                </div>

            </div>

            {/* Payment Table */}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">

                <div className="px-6 py-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-400">
                        Payment History
                    </h2>
                </div>

                {payments.length === 0 ? (

                    <div className="py-20 text-center">

                        <IndianRupee
                            className="mx-auto text-slate-400"
                            size={60}
                        />

                        <h3 className="mt-4 text-xl font-semibold">
                            No payment history yet
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Your rent payments will appear here once your
                            landlord records them.
                        </p>

                    </div>

                ) : (

                    <table className="w-full">

                        <thead className="bg-slate-100 dark:bg-slate-700">

                            <tr>

                                <th className="p-4 text-left">Property</th>

                                <th className="p-4 text-left">Room</th>

                                <th className="p-4 text-left">Amount</th>

                                <th className="p-4 text-left">Date</th>

                                <th className="p-4 text-left">Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {payments.map((payment) => (

                                <tr
                                    key={payment.id}
                                    className="border-b dark:border-slate-700"
                                >

                                    <td className="p-4">
                                        {payment.property_name}
                                    </td>

                                    <td className="p-4">
                                        {payment.room_number}
                                    </td>

                                    <td className="p-4">
                                        ₹ {payment.amount}
                                    </td>

                                    <td className="p-4">
                                        {new Date(
                                            payment.payment_date
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                payment.status === "PAID"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {payment.status}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>
        </div>

        </TenantLayout>
    );
};

export default Payments;