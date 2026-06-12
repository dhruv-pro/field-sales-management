export interface Customer {
  _id: string;
  customerCode: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  customerCode: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface UpdateCustomerRequest extends CreateCustomerRequest {
  id: string;
}

export interface CustomerFormValues extends CreateCustomerRequest {
  id?: string;
}

export interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}
