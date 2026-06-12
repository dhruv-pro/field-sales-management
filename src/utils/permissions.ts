import type { User } from "../features/auth/authTypes";

export type UserRole = User["role"];

export interface NavItem {
  label: string;
  to: string;
  roles: UserRole[];
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", roles: ["admin", "manager"] },
  { label: "Users", to: "/users", roles: ["admin"] },
  {
    label: "Attendance",
    to: "/attendence",
    roles: ["employee", "manager"],
  },
  {
    label: "Customers",
    to: "/customers",
    roles: ["admin", "manager", "employee"],
  },
  {
    label: "Orders",
    to: "/orders",
    roles: ["admin", "manager", "employee"],
  },
  {
    label: "Products",
    to: "/products",
    roles: ["admin", "manager", "employee"],
  },
  { label: "Reports", to: "/reports", roles: ["admin", "manager"] },
  {
    label: "Visits",
    to: "/visits",
    roles: ["admin", "manager", "employee"],
  },
];

export const getNavItemsForRole = (role?: UserRole | null): NavItem[] => {
  if (!role) {
    return [];
  }

  return navItems
    .filter((item) => item.roles.includes(role))
    .map((item) =>
      item.to === "/visits" && role === "employee"
        ? { ...item, label: "My Visits" }
        : item,
    );
};

export const isEmployee = (role?: UserRole | null): boolean =>
  role === "employee";
