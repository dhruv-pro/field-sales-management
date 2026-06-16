import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { createOrder, deleteOrder, fetchOrders, updateOrder } from "./ordersSlice";
import { fetchCustomers } from "../customers/customersSlice";
import { fetchProducts } from "../products/productsSlice";
import { fetchVisits } from "../visits/visitsSlice";
import type { AppDispatch, RootState } from "../../app/store";
import type { CreateOrderRequest, OrderFormValues, UpdateOrderRequest } from "./ordersTypes";
import Pagination from "../../components/common/Pagination";
import { FaSpinner } from "react-icons/fa";

const defaultFormValues: OrderFormValues = {
    customer: "",
    visit: "",
    items: [
        {
            product: "",
            quantity: 1,
        },
    ],
};

const OrdersPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, error } = useSelector((state: RootState) => state.orders);
    const { customers } = useSelector((state: RootState) => state.customers);
    const { visits } = useSelector((state: RootState) => state.visits);
    const { products } = useSelector((state: RootState) => state.products);

    const [formOpen, setFormOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderFormValues | null>(null);
    const [formValues, setFormValues] = useState<OrderFormValues>(defaultFormValues);
    const [searchTerm, setSearchTerm] = useState("");
    const ITEMS_PER_PAGE = 5;

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchCustomers());
        dispatch(fetchVisits());
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredOrders = useMemo(
        () =>
            orders.filter((order) =>
                `${order.orderNumber ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${typeof order.customer === "string" ? order.customer : order.customer?.customerName ?? ""}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
            ),
        [orders, searchTerm],
    );

    const getVisitLabel = (visit: any) => {
        let customerName = "Unknown customer";

        if (typeof visit.customer === "object") {
            customerName = visit.customer?.customerName ?? customerName;
        } else {
            const customer = customers.find(
                (item) => item._id === visit.customer
            );
            customerName = customer?.customerName ?? customerName;
        }

        const address = visit.location?.address;

        return address
            ? `${customerName} — ${address}`
            : `${customerName} — ${visit.notes || `Visit ${visit._id}`}`;
    };

    const openCreateForm = () => {
        setSelectedOrder(null);
        setFormValues(defaultFormValues);
        setFormOpen(true);
    };

    const openEditForm = (order: any) => {
        setSelectedOrder({
            id: order._id,
            customer: order.customer?._id ?? order.customer,
            visit: order.visit,
            items: order.items.map((item: any) => ({
                product: item.product,
                quantity: item.quantity,
            })),
        });
        setFormValues({
            id: order._id,
            customer: order.customer?._id ?? order.customer,
            visit: order.visit,
            items: order.items.map((item: any) => ({
                product: item.product,
                quantity: item.quantity,
            })),
        });
        setFormOpen(true);
    };

    const closeForm = () => {
        setSelectedOrder(null);
        setFormValues(defaultFormValues);
        setFormOpen(false);
    };

    const handleInputChange = (field: keyof OrderFormValues, value: string | number | { product: string; quantity: number }[]) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (index: number, field: "product" | "quantity", value: string | number) => {
        setFormValues((prev) => {
            const items = [...prev.items];
            items[index] = {
                ...items[index],
                [field]: field === "quantity" ? Number(value) : value,
            };
            return { ...prev, items };
        });
    };

    const addOrderItem = () => {
        setFormValues((prev) => ({
            ...prev,
            items: [...prev.items, { product: "", quantity: 1 }],
        }));
    };

    const removeOrderItem = (index: number) => {
        setFormValues((prev) => ({
            ...prev,
            items: prev.items.filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { customer, visit, items } = formValues;

        if (!customer || !visit || items.length === 0) {
            toast.error("Please fill in all required fields and add at least one order item.");
            return;
        }

        if (items.some((item) => !item.product || item.quantity <= 0)) {
            toast.error("Please provide valid product and quantity for each item.");
            return;
        }

        const payload: CreateOrderRequest | UpdateOrderRequest = selectedOrder
            ? {
                id: selectedOrder.id!,
                customer,
                visit,
                items,
            }
            : {
                customer,
                visit,
                items,
            };

        try {
            if (selectedOrder) {
                await dispatch(
                    updateOrder(payload as UpdateOrderRequest)
                ).unwrap();

                toast.success("Order updated successfully.");
            } else {
                await dispatch(
                    createOrder(payload as CreateOrderRequest)
                ).unwrap();

                toast.success("Order created successfully.");
            }

            closeForm();
        } catch (error: any) {
            toast.error(error || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this order?")) {
            return;
        }

        try {
            await dispatch(deleteOrder(id) as any);
            toast.success("Order deleted successfully.");
        } catch {
            // handled by slice / toast
        }
    };

    const totalPages = Math.ceil(
        filteredOrders.length / ITEMS_PER_PAGE
    );

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-sm text-gray-500">Create and manage orders from customers and visits.</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search orders"
                        className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500 sm:w-72"
                    />
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Add Order
                    </button>
                </div>
            </div>

            {formOpen && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedOrder ? "Edit order" : "Create order"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {selectedOrder ? "Update order details." : "Add a new order for a customer visit."}
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
                            <span className="mb-1 block text-sm font-medium text-slate-700">Customer</span>
                            <select
                                value={formValues.customer}
                                onChange={(event) => handleInputChange("customer", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            >
                                <option value="">Select customer</option>
                                {customers.map((customer) => (
                                    <option key={customer._id} value={customer._id}>
                                        {customer.customerName}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Visit</span>
                            <select
                                value={formValues.visit}
                                onChange={(event) => handleInputChange("visit", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            >
                                <option value="">Select visit</option>
                                {visits.map((visit) => (
                                    <option key={visit._id} value={visit._id}>
                                        {getVisitLabel(visit)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-700">Order items</p>
                                <button
                                    type="button"
                                    onClick={addOrderItem}
                                    className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                                >
                                    Add item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formValues.items.map((item, index) => (
                                    <div key={index} className="grid gap-4 sm:grid-cols-3">
                                        <label className="block">
                                            <span className="mb-1 block text-sm font-medium text-slate-700">Product</span>
                                            <select
                                                value={item.product}
                                                onChange={(event) => handleItemChange(index, "product", event.target.value)}
                                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                                            >
                                                <option value="">Select product</option>
                                                {products.map((product) => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.productName}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="mb-1 block text-sm font-medium text-slate-700">Quantity</span>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min={1}
                                                onChange={(event) => handleItemChange(index, "quantity", Number(event.target.value))}
                                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                                            />
                                        </label>
                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeOrderItem(index)}
                                                className="rounded bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {selectedOrder ? "Save changes" : "Create order"}
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
                    <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
                    <span className="text-sm text-gray-500">{orders.length} orders</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center ">
                        <FaSpinner className="animate-spin text-xl" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-left text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">Order</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Visit</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-4 py-4 text-slate-900">{order.orderNumber ?? order._id}</td>
                                            <td className="px-4 py-4 text-slate-500">
                                                {typeof order.customer === "string"
                                                    ? order.customer
                                                    : order.customer?.customerName ?? "Unknown"}
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">{order.visit}</td>
                                            <td className="px-4 py-4 text-slate-500">{order.items.length}</td>
                                            <td className="px-4 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 text-slate-500">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditForm(order)}
                                                        className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(order._id)}
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

export default OrdersPage;
