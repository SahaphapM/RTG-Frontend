import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo("/login"); // ✅ Redirect if not logged in
  }

  // ✅ Restrict pages based on roles
  const role = authStore.user?.role;
  const restrictedRoutes = {
    userOnly: ["/purchase-orders", "/projects", "/certificates"],
  };

  if (restrictedRoutes.userOnly.includes(to.path) && role !== "user") {
    return navigateTo("/purchase-orders"); // ✅ Redirect non-users
  }
});
