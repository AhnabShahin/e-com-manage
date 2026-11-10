import type { Role } from "./types";

/** Where each role lands after signing in. */
export function roleHome(role: Role): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "shop_owner":
      return "/dashboard";
    default:
      return "/shops";
  }
}
