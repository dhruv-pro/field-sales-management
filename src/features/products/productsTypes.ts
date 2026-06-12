export interface Product {
  _id: string;
  sku?: string;
  productName: string;
  category?: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  sku?: string;
  productName: string;
  category?: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
}

export interface ProductFormValues extends CreateProductRequest {
  id?: string;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}
