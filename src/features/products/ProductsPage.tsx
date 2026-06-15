import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";

import {
    createProduct,
    deleteProduct,
    fetchProducts,
    updateProduct,
} from "./productsSlice";
import type { AppDispatch, RootState } from "../../app/store";
import type { CreateProductRequest, ProductFormValues, UpdateProductRequest } from "./productsTypes";
import Pagination from "../../components/common/Pagination";

type ProductFormState = Omit<ProductFormValues, "price" | "stock"> & {
    price: string;
    stock: string;
};

const defaultFormValues: ProductFormState = {
    sku: "",
    productName: "",
    category: "",
    description: "",
    price: "0",
    stock: "0",
};

const ProductsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    const [formOpen, setFormOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductFormState | null>(null);
    const [formValues, setFormValues] = useState<ProductFormState>(defaultFormValues);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const ITEMS_PER_PAGE = 5;

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filteredProducts = useMemo(
        () =>
            products.filter((product) =>
                (product.sku ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.productName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.category ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        [searchTerm, products],
    );

    const openCreateForm = () => {
        setSelectedProduct(null);
        setFormValues(defaultFormValues);
        setFormOpen(true);
    };

    const openEditForm = (product: any) => {
        setSelectedProduct({
            id: product._id,
            sku: product.sku ?? "",
            productName: product.productName,
            category: product.category ?? "",
            description: product.description,
            price: String(product.price ?? "0"),
            stock: String(product.stock ?? "0"),
        });
        setFormValues({
            id: product._id,
            sku: product.sku ?? "",
            productName: product.productName,
            category: product.category ?? "",
            description: product.description,
            price: String(product.price ?? "0"),
            stock: String(product.stock ?? "0"),
        });
        setFormOpen(true);
    };

    const closeForm = () => {
        setSelectedProduct(null);
        setFormValues(defaultFormValues);
        setFormOpen(false);
    };

    const handleInputChange = (field: keyof ProductFormState, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { sku, productName, category, description, price, stock } = formValues;
        const parsedPrice = Number(price);
        const parsedStock = Number(stock);

        if (!productName || !description || Number.isNaN(parsedPrice) || parsedPrice <= 0 || Number.isNaN(parsedStock) || parsedStock < 0) {
            toast.error("Please enter valid product details.");
            return;
        }

        const payload: CreateProductRequest | UpdateProductRequest = selectedProduct
            ? {
                id: selectedProduct.id!,
                sku,
                productName,
                category,
                description,
                price: parsedPrice,
                stock: parsedStock,
            }
            : {
                sku,
                productName,
                category,
                description,
                price: parsedPrice,
                stock: parsedStock,
            };

        try {
            if (selectedProduct) {
                await dispatch(updateProduct(payload as UpdateProductRequest) as any).unwrap();
                toast.success("Product updated successfully.");
            } else {
                await dispatch(createProduct(payload as CreateProductRequest) as any).unwrap();
                toast.success("Product created successfully.");
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
            await dispatch(deleteProduct(deleteId) as any).unwrap();
            toast.success("Product deleted successfully.");
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
        filteredProducts.length / ITEMS_PER_PAGE
    );

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-sm text-gray-500">Create and manage products for orders and inventory.</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search products"
                        className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500 sm:w-72"
                    />
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        Add Product
                    </button>
                </div>
            </div>

            {formOpen && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedProduct ? "Edit product" : "Create product"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {selectedProduct ? "Update product details." : "Add a new product to your catalog."}
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
                            <span className="mb-1 block text-sm font-medium text-slate-700">SKU</span>
                            <input
                                type="text"
                                value={formValues.sku}
                                onChange={(event) => handleInputChange("sku", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Product Name</span>
                            <input
                                type="text"
                                value={formValues.productName}
                                onChange={(event) => handleInputChange("productName", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
                            <input
                                type="text"
                                value={formValues.category}
                                onChange={(event) => handleInputChange("category", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block lg:col-span-2">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
                            <textarea
                                value={formValues.description}
                                onChange={(event) => handleInputChange("description", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                                rows={4}
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Price</span>
                            <input
                                type="number"
                                min={0}
                                value={formValues.price}
                                onChange={(event) => handleInputChange("price", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Stock</span>
                            <input
                                type="number"
                                min={0}
                                value={formValues.stock}
                                onChange={(event) => handleInputChange("stock", event.target.value)}
                                className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <div className="lg:col-span-2 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {selectedProduct ? "Save changes" : "Create product"}
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
                    <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                    <span className="text-sm text-gray-500">{products.length} products</span>
                </div>

                {loading ? (
                    <div className="space-y-3 text-sm text-slate-600">Loading products...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50 text-left text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">SKU</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Stock</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {paginatedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">
                                            No products found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td className="px-4 py-4 text-slate-900">{product.sku ?? "—"}</td>
                                            <td className="px-4 py-4 text-slate-900">{product.productName}</td>
                                            <td className="px-4 py-4 text-slate-500">{product.category ?? "—"}</td>
                                            <td className="px-4 py-4 text-slate-500">{product.description}</td>
                                            <td className="px-4 py-4 text-slate-500">₹{product.price.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-slate-500">{product.stock}</td>
                                            <td className="px-4 py-4 text-slate-500">{new Date(product.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 text-slate-500">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditForm(product)}
                                                        className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(product._id)}
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
                title="Delete product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
};

export default ProductsPage;
