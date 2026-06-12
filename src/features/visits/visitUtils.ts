const UPLOADS_BASE =
  import.meta.env.VITE_UPLOADS_BASE_URL?.replace(/\/$/, "") ?? "/uploads";

export const getVisitImageUrl = (filename?: string | null): string | null => {
  if (!filename?.trim()) {
    return null;
  }

  const value = filename.trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    return value;
  }

  if (value.startsWith("uploads/")) {
    return `/${value}`;
  }

  return `${UPLOADS_BASE}/visits/${value}`;
};

export const formatVisitDateTime = (value?: string | null): string => {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const visitStatusStyles: Record<
  string,
  { label: string; className: string }
> = {
  planned: {
    label: "Planned",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 ring-rose-600/20",
  },
};
