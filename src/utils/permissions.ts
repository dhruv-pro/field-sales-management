import type { User } from "../features/auth/authTypes";
import type { IconType } from "react-icons";
import {
  FaHome,
  FaUsers,
  FaClipboardCheck,
  FaUserFriends,
  FaShoppingCart,
  FaBoxOpen,
  FaChartBar,
  FaMapMarkedAlt,
} from "react-icons/fa";

export type UserRole = User["role"];

export interface NavItem {
  label: string;
  to: string;
  roles: UserRole[];
  icon: IconType;
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    roles: ["admin", "manager"],
    icon: FaHome,
  },
  {
    label: "Users",
    to: "/users",
    roles: ["admin"],
    icon: FaUsers,
  },
  {
    label: "Attendance",
    to: "/attendence",
    roles: ["employee", "manager"],
    icon: FaClipboardCheck,
  },
  {
    label: "Customers",
    to: "/customers",
    roles: ["admin", "manager", "employee"],
    icon: FaUserFriends,
  },
  {
    label: "Orders",
    to: "/orders",
    roles: ["admin", "manager", "employee"],
    icon: FaShoppingCart,
  },
  {
    label: "Products",
    to: "/products",
    roles: ["admin", "manager", "employee"],
    icon: FaBoxOpen,
  },
  {
    label: "Reports",
    to: "/reports",
    roles: ["admin", "manager"],
    icon: FaChartBar,
  },
  {
    label: "Visits",
    to: "/visits",
    roles: ["admin", "manager", "employee"],
    icon: FaMapMarkedAlt,
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
