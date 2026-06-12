import type { User } from "../auth/authTypes";

export type UserRole = "admin" | "manager" | "employee";

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface UpdateUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  password?: string;
}

export interface UserFormValues {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}
