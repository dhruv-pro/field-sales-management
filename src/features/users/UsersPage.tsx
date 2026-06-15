import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import ConfirmModal from "../../components/common/ConfirmModal";
import { createUser, deleteUser, fetchUsers, updateUser } from "./usersSlice";
import type { AppDispatch, RootState } from "../../app/store";
import type { CreateUserRequest, UpdateUserRequest, UserFormValues } from "./usersTypes";
import Pagination from "../../components/common/Pagination";
import { FaSpinner } from "react-icons/fa";

const defaultFormValues: UserFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee",
    isActive: true,
};

const UsersPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading, error } = useSelector((state: RootState) => state.users);

    const [formOpen, setFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserFormValues | null>(null);
    const [formValues, setFormValues] = useState<UserFormValues>(defaultFormValues);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const ITEMS_PER_PAGE = 5;

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filteredUsers = useMemo(
        () =>
            users.filter((user) =>
                `${user.firstName} ${user.lastName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        [searchTerm, users],
    );

    const openCreateForm = () => {
        setSelectedUser(null);
        setFormValues(defaultFormValues);
        setFormOpen(true);
    };

    const openEditForm = (user: any) => {
        setSelectedUser({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "",
            role: user.role,
            isActive: user.isActive,
        });
        setFormValues({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: "",
            role: user.role,
            isActive: user.isActive,
        });
        setFormOpen(true);
    };

    const closeForm = () => {
        setSelectedUser(null);
        setFormValues(defaultFormValues);
        setFormOpen(false);
    };

    const handleInputChange = (field: keyof UserFormValues, value: string | boolean) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { firstName, lastName, email, password, role, isActive } = formValues;

        if (!firstName || !lastName || !email || !role) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const payload: CreateUserRequest | UpdateUserRequest = selectedUser
            ? {
                id: selectedUser.id!,
                firstName,
                lastName,
                email,
                role,
                isActive,
                ...(password ? { password } : {}),
            }
            : {
                firstName,
                lastName,
                email,
                password,
                role,
                isActive,
            };

        try {
            if (selectedUser) {
                await dispatch(updateUser(payload as UpdateUserRequest) as any);
                toast.success("User updated successfully.");
            } else {
                if (!password) {
                    toast.error("Password is required to create a user.");
                    return;
                }

                await dispatch(createUser(payload as CreateUserRequest) as any);
                toast.success("User created successfully.");
            }
            closeForm();
        } catch {
            // handled by slice / toast
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) {
            return;
        }

        try {
            await dispatch(deleteUser(deleteId) as any);
            toast.success("User deleted successfully.");
        } catch {
            // handled by slice / toast
        } finally {
            setConfirmOpen(false);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        setDeleteId(null);
    };
    const totalPages = Math.ceil(
        filteredUsers.length / ITEMS_PER_PAGE
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500">Create, update, and manage users for your sales team.</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search users"
                        className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500 sm:w-72"
                    />
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Add User
                    </button>
                </div>
            </div>

            {formOpen && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedUser ? "Edit user" : "Create user"}
                            </h2>
                            <p className="text-sm text-gray-500">{selectedUser ? "Update user details." : "Add a new user to your team."}</p>
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
                            <span className="mb-1 block text-sm font-medium text-slate-700">First name</span>
                            <input
                                type="text"
                                value={formValues.firstName}
                                onChange={(event) => handleInputChange("firstName", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Last name</span>
                            <input
                                type="text"
                                value={formValues.lastName}
                                onChange={(event) => handleInputChange("lastName", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block lg:col-span-2">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
                            <input
                                type="email"
                                value={formValues.email}
                                onChange={(event) => handleInputChange("email", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Role</span>
                            <select
                                value={formValues.role}
                                onChange={(event) => handleInputChange("role", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            >
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
                            <select
                                value={formValues.isActive ? "active" : "inactive"}
                                onChange={(event) => handleInputChange("isActive", event.target.value === "active")}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </label>

                        <label className="block lg:col-span-2">
                            <span className="mb-1 block text-sm font-medium text-slate-700">
                                {selectedUser ? "Password (leave blank to keep current)" : "Password"}
                            </span>
                            <input
                                type="password"
                                value={formValues.password}
                                onChange={(event) => handleInputChange("password", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <div className="lg:col-span-2 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {selectedUser ? "Save changes" : "Create user"}
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
                    <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                    <span className="text-sm text-gray-500">{users.length} users</span>
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
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {paginatedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td className="px-4 py-4 text-slate-900">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">{user.email}</td>
                                            <td className="px-4 py-4 text-slate-500">{user.role}</td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                                                >
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 text-slate-500">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditForm(user)}
                                                        className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(user._id)}
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

            <ConfirmModal
                open={confirmOpen}
                title="Delete user"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default UsersPage;
