import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
    createVisit,
    fetchVisits,
    fetchMyVisits,
    uploadVisitPhoto,
    uploadVisitSelfie,
} from "./visitsSlice";
import { fetchCustomers } from "../customers/customersSlice";
import type { AppDispatch, RootState } from "../../app/store";
import type { CreateVisitRequest, VisitFormValues } from "./visitsTypes";
import {
    formatVisitDateTime,
    getVisitImageUrl,
    visitStatusStyles,
} from "./visitUtils";
import Pagination from "../../components/common/Pagination";

const defaultFormValues: VisitFormValues = {
    customer: "",
    location: {
        latitude: 0,
        longitude: 0,
        address: "",
    },
    notes: "",
};

const VisitStatusBadge = ({ status }: { status?: string }) => {
    const config = visitStatusStyles[status ?? ""] ?? {
        label: status ?? "Unknown",
        className: "bg-slate-50 text-slate-600 ring-slate-500/20",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
        >
            {config.label}
        </span>
    );
};

const ImageThumbnail = ({
    src,
    alt,
    label,
    onClick,
}: {
    src: string;
    alt: string;
    label?: string;
    onClick: () => void;
}) => {
    const [imageState, setImageState] = useState<"loading" | "loaded" | "error">("loading");

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClick();
                }
            }}
            className="group relative inline-flex h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-100 hover:border-slate-400 hover:shadow-sm"
            title={`View ${alt}`}
        >
            {imageState === "loading" && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400">
                    Loading
                </span>
            )}

            {imageState === "error" ? (
                <a
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] font-medium text-slate-600 underline"
                >
                    Open image
                </a>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    decoding="async"
                    className={`block h-full w-full object-cover transition group-hover:scale-105 ${imageState === "loaded" ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setImageState("loaded")}
                    onError={() => setImageState("error")}
                />
            )}

            {label && imageState === "loaded" && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-slate-900/70 px-1 py-0.5 text-[10px] font-medium text-white">
                    {label}
                </span>
            )}
        </div>
    );
};

const VisitsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { visits, myVisits, loading, error } = useSelector((state: RootState) => state.visits);
    const { customers } = useSelector((state: RootState) => state.customers);
    const authUser = useSelector((state: RootState) => state.auth.user);
    const userRole = authUser?.role;

    const [formOpen, setFormOpen] = useState(false);
    const [formValues, setFormValues] = useState<VisitFormValues>(defaultFormValues);
    const [searchTerm, setSearchTerm] = useState("");
    const [gettingLocation, setGettingLocation] = useState(false);
    const [photoFiles, setPhotoFiles] = useState<Record<string, File | null>>({});
    const [selfieFiles, setSelfieFiles] = useState<Record<string, File | null>>({});
    const [uploadingPhotoVisitId, setUploadingPhotoVisitId] = useState<string | null>(null);
    const [uploadingSelfieVisitId, setUploadingSelfieVisitId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
    const ITEMS_PER_PAGE = 5;

    const [currentPage, setCurrentPage] = useState(1);

    const refreshVisits = () => {
        if (userRole === "employee") {
            dispatch(fetchMyVisits());
            return;
        }

        if (userRole) {
            dispatch(fetchVisits());
        }
    };

    useEffect(() => {
        if (!userRole) return;

        if (userRole === "employee") {
            dispatch(fetchMyVisits());
        } else {
            dispatch(fetchVisits());
        }

        dispatch(fetchCustomers());
    }, [dispatch, userRole]);

    useEffect(() => {
        if (error) {
            if (userRole === "employee" && error.includes("access")) {
                return;
            }
            toast.error(error);
        }
    }, [error, userRole]);

    const displayVisits = userRole === "employee" ? myVisits : visits;

    const getCustomerName = (customer: string | { _id: string; customerName: string }) => {
        if (typeof customer === "string") {
            return customers.find((c) => c._id === customer)?.customerName ?? customer;
        }
        return customer?.customerName ?? customer?._id ?? "Unknown";
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported");
            return;
        }

        setGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormValues((prev) => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                }));

                setGettingLocation(false);
                toast.success("Location captured");
            },
            () => {
                setGettingLocation(false);
                toast.error("Unable to fetch location");
            },
        );
    };

    const filteredVisits = useMemo(
        () =>
            displayVisits.filter((visit) =>
                `${visit.location?.address ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${visit.notes ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${visit.visitStatus ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${getCustomerName(visit.customer)}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()),
            ),
        [searchTerm, displayVisits, customers],
    );

    const openCreateForm = () => {
        setFormValues(defaultFormValues);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormValues(defaultFormValues);
        setFormOpen(false);
    };

    const handleInputChange = (
        field: keyof VisitFormValues,
        value: string | number | { latitude: number; longitude: number; address: string },
    ) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleLocationChange = (field: keyof VisitFormValues["location"], value: string) => {
        setFormValues((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: field === "address" ? value : Number(value),
            },
        }));
    };

    const handleUploadPhoto = async (visitId: string) => {
        const photoFile = photoFiles[visitId];
        if (!photoFile) {
            toast.error("Select a photo before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("photo", photoFile);

        setUploadingPhotoVisitId(visitId);
        try {
            await dispatch(uploadVisitPhoto({ id: visitId, formData }) as any);
            toast.success("Photo uploaded successfully.");
            setPhotoFiles((prev) => ({ ...prev, [visitId]: null }));
            refreshVisits();
        } catch {
            // handled by slice / toast
        } finally {
            setUploadingPhotoVisitId(null);
        }
    };

    const handleUploadSelfie = async (visitId: string) => {
        const selfieFile = selfieFiles[visitId];
        if (!selfieFile) {
            toast.error("Select a selfie before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("selfie", selfieFile);

        setUploadingSelfieVisitId(visitId);
        try {
            await dispatch(uploadVisitSelfie({ id: visitId, formData }) as any);
            toast.success("Selfie uploaded successfully.");
            setSelfieFiles((prev) => ({ ...prev, [visitId]: null }));
            refreshVisits();
        } catch {
            // handled by slice / toast
        } finally {
            setUploadingSelfieVisitId(null);
        }
    };

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>,
        visitId: string,
        setter: React.Dispatch<React.SetStateAction<Record<string, File | null>>>,
    ) => {
        const file = event.target.files?.[0] ?? null;
        setter((prev) => ({ ...prev, [visitId]: file }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { customer, location, notes } = formValues;

        const validations = [
            { condition: !customer, message: "Please select a customer" },
            { condition: !location.address.trim(), message: "Please enter address" },
            { condition: !location.latitude || !location.longitude, message: "Please capture your current location" },
        ];
        const validationError = validations.find((v) => v.condition);
        if (validationError) {
            toast.error(validationError.message);
            return;
        }

        const payload: CreateVisitRequest = {
            customer,
            location,
            notes,
        };

        try {
            await dispatch(createVisit(payload) as any);
            toast.success("Visit created successfully.");
            closeForm();
            refreshVisits();
        } catch {
            // handled by slice / toast
        }
    };

    const pageTitle = userRole === "employee" ? "My Visits" : "Visit Management";
    const totalPages = Math.ceil(
        filteredVisits.length / ITEMS_PER_PAGE
    );

    const paginatedVisits = filteredVisits.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
                    <p className="text-sm text-gray-500">
                        Track customer visits with photos, selfies, and location details.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Search by customer, address, status..."
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500 sm:w-72"
                    />
                    {(userRole === "employee" || userRole === "manager") && (
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                            Add Visit
                        </button>
                    )}
                </div>
            </div>

            {formOpen && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Create visit</h2>
                            <p className="text-sm text-gray-500">Record a new visit for your customer.</p>
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
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            >
                                <option value="">Select customer</option>
                                {customers.map((customer) => (
                                    <option key={customer._id} value={customer._id}>
                                        {customer.customerName}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block lg:col-span-2">
                            <span className="mb-1 block text-sm font-medium text-slate-700">Address</span>
                            <input
                                type="text"
                                value={formValues.location.address}
                                onChange={(event) => handleLocationChange("address", event.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-slate-500"
                            />
                        </label>

                        <div className="lg:col-span-2">
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                {gettingLocation ? "Fetching..." : "Get Current Location"}
                            </button>

                            {formValues.location.latitude !== 0 &&
                                formValues.location.longitude !== 0 && (
                                    <p className="mt-2 text-sm text-emerald-600">
                                        Location captured successfully
                                    </p>
                                )}
                        </div>

                        <div className="flex flex-wrap gap-3 lg:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Create visit
                            </button>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Visit records</h2>
                        <p className="text-sm text-gray-500">Click any image to preview full size.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                        {displayVisits.length} visits
                    </span>
                </div>

                {loading ? (
                    <div className="px-6 py-10 text-sm text-slate-600">Loading visits...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-[1100px] w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Location</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Check-in</th>
                                    <th className="px-4 py-3">Check-out</th>
                                    <th className="px-4 py-3">Notes</th>
                                    <th className="px-4 py-3">Selfie</th>
                                    <th className="px-4 py-3">Visit Photos</th>
                                    <th className="px-4 py-3">Upload</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {paginatedVisits.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500">
                                            No visits found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedVisits.map((visit) => {
                                        const selfieUrl = getVisitImageUrl(visit.selfiePhoto);
                                        const visitPhotoUrls =
                                            visit.visitPhotos
                                                ?.map((photo) => ({
                                                    id: photo._id,
                                                    src: getVisitImageUrl(photo.imageUrl),
                                                    caption: photo.caption,
                                                }))
                                                .filter((photo) => photo.src) ?? [];

                                        return (
                                            <tr key={visit._id} className="align-top transition hover:bg-slate-50/60">
                                                <td className="px-4 py-4">
                                                    <p className="font-medium text-slate-900">
                                                        {getCustomerName(visit.customer)}
                                                    </p>
                                                    {visit.createdAt && (
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Created {formatVisitDateTime(visit.createdAt)}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="max-w-[220px] px-4 py-4">
                                                    <p className="text-slate-700">{visit.location?.address || "—"}</p>
                                                    <p className="mt-1 font-mono text-xs text-slate-400">
                                                        {visit.location?.latitude?.toFixed(5)},{" "}
                                                        {visit.location?.longitude?.toFixed(5)}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <VisitStatusBadge status={visit.visitStatus} />
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                                                    {formatVisitDateTime(visit.checkInTime ?? visit.createdAt)}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                                                    {formatVisitDateTime(visit.checkOutTime)}
                                                </td>

                                                <td className="max-w-[180px] px-4 py-4 text-slate-600">
                                                    <p className="line-clamp-3">{visit.notes?.trim() || "—"}</p>
                                                </td>

                                                <td className="px-4 py-4">
                                                    {selfieUrl ? (
                                                        <ImageThumbnail
                                                            src={selfieUrl}
                                                            alt="Visit selfie"
                                                            label="Selfie"
                                                            onClick={() =>
                                                                setPreviewImage({
                                                                    src: selfieUrl,
                                                                    alt: "Visit selfie",
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="inline-flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                                                            No selfie
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {visitPhotoUrls.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {visitPhotoUrls.map((photo, index) => (
                                                                <ImageThumbnail
                                                                    key={photo.id}
                                                                    src={photo.src!}
                                                                    alt={photo.caption || `Visit photo ${index + 1}`}
                                                                    label={`#${index + 1}`}
                                                                    onClick={() =>
                                                                        setPreviewImage({
                                                                            src: photo.src!,
                                                                            alt: photo.caption || `Visit photo ${index + 1}`,
                                                                        })
                                                                    }
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex min-h-16 items-center text-xs text-slate-400">
                                                            No photos
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="min-w-[200px] px-4 py-4">
                                                    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                                                        <div>
                                                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                                Visit photo
                                                            </label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(event) =>
                                                                    handleFileChange(event, visit._id, setPhotoFiles)
                                                                }
                                                                className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-slate-900 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUploadPhoto(visit._id)}
                                                                disabled={uploadingPhotoVisitId === visit._id}
                                                                className="mt-2 w-full rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {uploadingPhotoVisitId === visit._id
                                                                    ? "Uploading..."
                                                                    : "Upload photo"}
                                                            </button>
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                                Selfie
                                                            </label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                disabled={!!visit.selfiePhoto}
                                                                onChange={(event) =>
                                                                    handleFileChange(event, visit._id, setSelfieFiles)
                                                                }
                                                                className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-slate-900 file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700 disabled:opacity-50"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUploadSelfie(visit._id)}
                                                                disabled={
                                                                    uploadingSelfieVisitId === visit._id ||
                                                                    !!visit.selfiePhoto
                                                                }
                                                                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {visit.selfiePhoto
                                                                    ? "Selfie uploaded"
                                                                    : uploadingSelfieVisitId === visit._id
                                                                        ? "Uploading..."
                                                                        : "Upload selfie"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
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

            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4"
                    onClick={() => setPreviewImage(null)}
                    role="presentation"
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image preview"
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/80 px-3 py-1 text-sm font-semibold text-white transition hover:bg-slate-900"
                        >
                            Close
                        </button>
                        <img
                            src={previewImage.src}
                            alt={previewImage.alt}
                            className="max-h-[85vh] w-full object-contain"
                        />
                        <p className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
                            {previewImage.alt}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitsPage;
