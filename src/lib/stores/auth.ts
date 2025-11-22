import { writable } from "svelte/store";
import type { AdminUser } from "$lib/supabase";

export const adminUser = writable<AdminUser | null>(null);
export const isAuthenticated = writable(false);

// Check if admin is logged in from localStorage
if (typeof window !== "undefined") {
  const storedAdmin = localStorage.getItem("admin_user");
  if (storedAdmin) {
    try {
      const admin = JSON.parse(storedAdmin);
      adminUser.set(admin);
      isAuthenticated.set(true);
    } catch (e) {
      localStorage.removeItem("admin_user");
    }
  }
}

export function setAdmin(admin: AdminUser | null) {
  if (admin) {
    adminUser.set(admin);
    isAuthenticated.set(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_user", JSON.stringify(admin));
    }
  } else {
    adminUser.set(null);
    isAuthenticated.set(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_user");
    }
  }
}
