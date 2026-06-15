import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
    createCustomer,
    deleteCustomer,
    fetchCustomers,
    updateCustomer,
} from "./customersSlice";
import type { AppDispatch, RootState } from "../../app/store";
import type { CreateCustomerRequest, CustomerFormValues, UpdateCustomerRequest } from "./customersTypes";
import Pagination from "../../components/common/Pagination";

const defaultFormValues: CustomerFormValues = {
    customerCode: "",
    customerName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
};

const CustomersPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { customers, loading, error } = useSelector((state: RootState) => state.customers);

    const [formOpen, setFormOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerFormValues | null>(null);
    const [formValues, setFormValues] = useState<CustomerFormValues>(defaultFormValues);
    const [searchTerm, setSearchTerm] = useState("");
    const ITEMS_PER_PAGE = 5;

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filteredCustomers = useMemo(
        () =>
            customers.filter((customer) =>
                `${customer.customerName} ${customer.companyName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.city.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        [searchTerm, customers],
    );

    const openCreateForm = () => {
        setSelectedCustomer(null);
        setFormValues(defaultFormValues);
        setFormOpen(true);
    };

    const openEditForm = (customer: any) => {
        setSelectedCustomer({
            id: customer._id,
            customerCode: customer.customerCode,
            customerName: customer.customerName,
            companyName: customer.companyName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            country: customer.country,
        });
        setFormValues({
            id: customer._id,
            customerCode: customer.customerCode,
            customerName: customer.customerName,
            companyName: customer.companyName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            country: customer.country,
        });
        setFormOpen(true);
    };

    const closeForm = () => {
        setSelectedCustomer(null);
        setFormValues(defaultFormValues);
        setFormOpen(false);
    };

    const handleInputChange = (field: keyof CustomerFormValues, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const {
            customerCode,
            customerName,
            companyName,
            email,
            phone,
            address,
            city,
            state,
            country,
        } = formValues;

        if (!customerCode || !customerName || !companyName || !email) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const payload: CreateCustomerRequest | UpdateCustomerRequest = selectedCustomer
            ? {
                id: selectedCustomer.id!,
                customerCode,
                customerName,
                companyName,
                email,
                phone,
                address,
                city,
                state,
                country,
            }
            : {
                customerCode,
                customerName,
                companyName,
                email,
                phone,
                address,
                city,
                state,
                country,
            };

        try {
            if (selectedCustomer) {
                await dispatch(updateCustomer(payload as UpdateCustomerRequest) as any);
                toast.success("Customer updated successfully.");
            } else {
                await dispatch(createCustomer(payload as CreateCustomerRequest) as any);
                toast.success("Customer created successfully.");
            }
            closeForm();
        } catch {
            // handled by slice / toast
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this customer?")) {
            return;
        }

        try {
            await dispatch(deleteCustomer(id) as any);
            toast.success("Customer deleted successfully.");
        } catch {
            // handled by slice / toast
        }
    };
    const totalPages = Math.ceil(
        filteredCustomers.length / ITEMS_PER_PAGE
    );

    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
                    <p className="text-sm text-gray-500">Manage customer records for sales and service operations.</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search customers"
                        className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500 sm:w-72"
                    />
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Add Customer
                    </button>
                </div>
            </div>

            {formOpen && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedCustomer ? "Edit customer" : "Create customer"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {selectedCustomer ? "Update customer details." : "Add a new customer to the system."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                        >
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Customer code</span>
                            <input
                                type="text"
                                value={formValues.customerCode}
                                onChange={(event) => handleInputChange("customerCode", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Customer name</span>
                            <input
                                type="text"
                                value={formValues.customerName}
                                onChange={(event) => handleInputChange("customerName", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block lg:col-span-2">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Company name</span>
                            <input
                                type="text"
                                value={formValues.companyName}
                                onChange={(event) => handleInputChange("companyName", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
                            <input
                                type="email"
                                value={formValues.email}
                                onChange={(event) => handleInputChange("email", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Phone</span>
                            <input
                                type="tel"
                                value={formValues.phone}
                                onChange={(event) => handleInputChange("phone", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block lg:col-span-2">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Address</span>
                            <input
                                type="text"
                                value={formValues.address}
                                onChange={(event) => handleInputChange("address", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">City</span>
                            <input
                                type="text"
                                value={formValues.city}
                                onChange={(event) => handleInputChange("city", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">State</span>
                            <input
                                type="text"
                                value={formValues.state}
                                onChange={(event) => handleInputChange("state", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Country</span>
                            <input
                                type="text"
                                value={formValues.country}
                                onChange={(event) => handleInputChange("country", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <div className="lg:col-span-2 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {selectedCustomer ? "Save changes" : "Create customer"}
                            </button>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
                    <span className="text-sm text-gray-500">{customers.length} customers</span>
                </div>

                {loading ? (
                    <div className="space-y-3 text-sm text-slate-600">Loading customers...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-left text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">Code</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Company</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {paginatedCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                                            No customers found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedCustomers.map((customer) => (
                                        <tr key={customer._id}>
                                            <td className="px-4 py-4 text-slate-900">{customer.customerCode}</td>
                                            <td className="px-4 py-4 text-slate-900">{customer.customerName}</td>
                                            <td className="px-4 py-4 text-slate-500">{customer.companyName}</td>
                                            <td className="px-4 py-4 text-slate-500">{customer.email}</td>
                                            <td className="px-4 py-4 text-slate-500">{customer.phone}</td>
                                            <td className="px-4 py-4 text-slate-500">{customer.city}, {customer.state}</td>
                                            <td className="px-4 py-4 text-slate-500">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditForm(customer)}
                                                        className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(customer._id)}
                                                        className="rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </section>
        </div>
    );
};

export default CustomersPage;
