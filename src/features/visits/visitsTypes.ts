export type VisitStatus = "planned" | "in-progress" | "completed" | "cancelled";

export interface VisitPhoto {
  imageUrl: string;
  caption?: string;
  _id: string;
  uploadedAt: string;
}

export interface Visit {
  _id: string;
  customer: string | { _id: string; customerName: string; companyName?: string };
  employee?: string | { _id: string; firstName: string; lastName: string; email?: string };
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
  selfiePhoto?: string | null;
  selfieUploadedAt?: string | null;
  visitPhotos?: VisitPhoto[];
  checkInTime?: string;
  checkOutTime?: string | null;
  visitStatus?: VisitStatus;
  orderCreated?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVisitRequest {
  customer: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
}

export interface VisitFormValues extends CreateVisitRequest {
  id?: string;
}

export interface VisitsState {
  visits: Visit[];
  myVisits: Visit[];
  selectedVisit: Visit | null;
  loading: boolean;
  error: string | null;
}
