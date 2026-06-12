export interface OrderItemPayload {
  product: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customer: string;
  visit: string;
  items: OrderItemPayload[];
}

export interface UpdateOrderRequest extends CreateOrderRequest {
  id: string;
}

export interface OrderFormValues extends CreateOrderRequest {
  id?: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  customer?:
    | {
        _id: string;
        customerName: string;
      }
    | string;
  visit?: string;
  items: OrderItemPayload[];
  totalAmount?: number;
  orderStatus?: string;
  createdAt: string;
}

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}
